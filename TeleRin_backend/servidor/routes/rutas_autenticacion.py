from flask import Blueprint, request, jsonify, session, abort
from werkzeug.security import check_password_hash
import psycopg2.extras

from servidor.core.db import conectar, dato_en_db, actualizar_datos
from servidor.core.decoradores import necesita, funciones
from servidor.services.servicios_sesion import (
    guardar_temporalmente_datos,
    guardar_funcion_proveniente,
    obtener_usuario,
    sesion_iniciada,
)
from servidor.services.servicios_texto import validar_email, comprobar_contraseña, encriptar
from servidor.services.servicios_email import enviar_correo
from servidor.services.servicios_autenticacion import (
    verificar_ip,
    iniciar_sesion_dispositivo_nuevo,
    obtener_ip,
    iniciar_sesion_google,
    registrarse_google,
)
from google.oauth2 import id_token
from google.auth.transport import requests
import os

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/usuario", methods=["POST", "GET"])
@necesita("usuario", sesion_iniciada)
def sesion_usuario():
    columnas = request.get_json(silent=True) or ["correo_usuario", "codigo_usuario"]
    faltantes = any(col not in ["nombre_usuario", "correo_usuario", "descripcion_personal", "id_pais", "id_genero", "foto_perfil_usuario", "codigo_usuario"] for col in columnas)
    if faltantes:
        return jsonify({"mensaje": f"error", "tipo": "danger"})
    usuario = obtener_usuario()
    if not usuario:
        return jsonify({"mensaje": "usuario no encontrado", "tipo": "danger"})
    usuario_filtrado = {columna: usuario[columna] for columna in columnas}
    return jsonify(usuario_filtrado)

@auth_bp.route("/api/registrarse", methods=["POST"])
def registrarse():
    form = request.get_json()
    nombre_us=form["nombre_usuario"]
    correo_us=form["correo_usuario"]
    contraseña_us=form["contraseña_usuario"]
    email=validar_email(correo_us)
    if not email:
        return jsonify({"mensaje":"Correo no valido", "tipo":"danger"})
    if dato_en_db(email, 'correo_usuario'):
        return jsonify({"mensaje":"Correo ya registrado", "tipo":"warning"})
    if not comprobar_contraseña(contraseña_us):
        return jsonify({"mensaje":"Ponga una contraseña mas segura (8 caracteres, 3 mayusculas, 3 minusculas, 2 numeros)", "tipo":"danger"})
    guardar_temporalmente_datos(form)
    guardar_funcion_proveniente("registro")
    return enviar_correo(correo_us)
 
@auth_bp.route("/api/ingresar_codigo_validacion", methods=["GET"])
@necesita("codigo de validacion", lambda: session.get("codigo_validacion")!=None)
def ingresar_codigo_validacion():
    return jsonify({"status": True}) 

@auth_bp.route("/api/validar_codigo", methods=["POST"])
@necesita("codigo", lambda: session.get("codigo_validacion")!=None)
def validar_codigo():
    if request.method!="POST":
        abort(405)  
    codigo=request.get_json().get("codigo")
    if check_password_hash(session["codigo_validacion"], f"{session['datos_temporales']['correo_usuario']}{codigo}"):
        session.pop("codigo_validacion")
        return funciones[session["funcion_proveniente"]](session["datos_temporales"])
    return jsonify({"mensaje":"Codigo de validacion incorrecto", "tipo":"danger"})

@auth_bp.route("/api/iniciar_sesion", methods=["POST"])
def iniciar_sesion():
    form = request.get_json()
    correo=form["correo_usuario"]
    contraseña=form["contraseña_usuario"]
    contraseña_encriptada=f"{correo}{contraseña}"
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            usuario=dato_en_db(correo, "correo_usuario")
            if not usuario:
                return jsonify({"mensaje":"Correo no registrado", "tipo":"warning"})
            try:
                if not check_password_hash(usuario[0]["contraseña_usuario"], contraseña_encriptada):
                    return jsonify({"mensaje":"Contraseña incorrecta", "tipo":"danger"})
            except AttributeError:
                return jsonify({"mensaje":"Inicia sesion por google", "tipo":"danger"})
            if not verificar_ip(correo):
                guardar_temporalmente_datos({"correo_usuario": correo})
                guardar_funcion_proveniente("iniciar_sesion_dispositivo_nuevo")
                return enviar_correo(correo)
            return iniciar_sesion_dispositivo_nuevo(correo)

@auth_bp.route("/api/codigo_verificacion_cambiar_contrasena", methods=["POST"])
def codigo_verificacion_cambiar_contraseña():
    form = request.get_json()
    correo=form["correo_para_codigo_usuario"]
    email=validar_email(correo)
    if not email:
        return jsonify({"mensaje":"Correo no valido", "tipo":"danger"})
    usuario=dato_en_db(email, "correo_usuario")
    if not usuario:
        return jsonify({"mensaje":"Correo no registrado", "tipo":"warning"})
    guardar_temporalmente_datos({"correo_usuario": correo})
    guardar_funcion_proveniente("cambiar_contraseña_comprobador")
    return enviar_correo(correo)

@auth_bp.route("/api/cambiar_contraseña", methods=["POST", "GET"])
@necesita("verificar tu usuario", lambda: session.get("cambiar_contraseña_usuario"))
def cambiar_contraseña():
    if request.method!="POST":
        return jsonify({"status": True})
    form = request.get_json()
    correo=session["datos_temporales"]["correo_usuario"]
    contraseña_nueva=form["contraseña_usuario_nueva"]
    contraseña_nueva_confirmacion=form["contraseña_usuario_nueva_confirmacion"]
    if contraseña_nueva != contraseña_nueva_confirmacion:
        return jsonify({"mensaje":"Las contraseñas nuevas no coinciden", "tipo":"danger"})
    if not comprobar_contraseña(contraseña_nueva):
        return jsonify({"mensaje":"Ponga una contraseña mas segura (8 caracteres, 3 mayusculas, 3 minusculas, 2 numeros)", "tipo":"danger"})
    contraseña_nueva_encriptada=encriptar(f"{correo}{contraseña_nueva}")
    actualizar_datos("USUARIOS", {"contraseña_usuario": contraseña_nueva_encriptada}, {"correo_usuario": correo})
    session.pop("cambiar_contraseña_usuario")
    return jsonify({"redirigir": "/iniciar_sesion", "mensaje_redirigir": {"mensaje": "Contraseña cambiada exitosamente, inicia sesión de nuevo", "tipo": "success"}})

@auth_bp.route("/api/iniciar_google", methods=["POST"])
def iniciar_google():
    form = request.get_json()
    creadenciales = form["token"]
    id_info = id_token.verify_oauth2_token(creadenciales, requests.Request(), os.getenv("CLIENT_ID"), clock_skew_in_seconds=10)
    email = id_info["email"]
    mensaje = {}
    if dato_en_db(email, "correo_usuario"):
        mensaje = iniciar_sesion_google(email, id_info["sub"])
    else:
        mensaje = registrarse_google(id_info["name"], email, id_info["sub"], id_info["picture"])
    return mensaje
    
        
        




@auth_bp.route("/api/cerrar_sesion", methods=["GET", "POST"])
def cerrar_sesion():
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        session.clear()
        return jsonify({"redirigir": "/", "mensaje_redirigir": {"mensaje": "Sesión cerrada", "tipo": "success"}})
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            ip = obtener_ip()
            cursor.execute('SELECT ip_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (usuario_actual["correo_usuario"],))
            ips = cursor.fetchone()
            hash = None
            for ip_usuario in ips["ip_usuario"]:
                if check_password_hash(ip_usuario, ip):
                    hash = ip_usuario
                    break 
            cursor.execute('UPDATE "USUARIOS" SET ip_usuario = array_remove(ip_usuario, %s) WHERE correo_usuario = %s', (hash, usuario_actual["correo_usuario"]))
            session.clear()
    return jsonify({"redirigir": "/", "mensaje_redirigir": {"mensaje": "Sesión cerrada", "tipo": "success"}})


