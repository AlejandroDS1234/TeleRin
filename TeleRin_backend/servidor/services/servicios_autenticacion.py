import socket
from flask import request, session, jsonify
from werkzeug.security import check_password_hash
import random
import psycopg2.extras

from servidor.core.db import conectar, insertar_db
from servidor.core.decoradores import registrar_funcion
from servidor.services.servicios_sesion import guardar_sesion
from servidor.services.servicios_texto import encriptar

def obtener_ip():
    ip_local = socket.gethostbyname(socket.gethostname())
    user_agent = request.headers.get("User-Agent", "")
    lenguaje=request.headers.get("Accept-Lenguage", "")
    encoding=request.headers.get("Accept-Encoding", "")
    dispositivo=f"{ip_local}--{user_agent}--{lenguaje}--{encoding}"
    return dispositivo

def verificar_ip(correo: str):
    dispositivo=obtener_ip()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT ip_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
            ip=cursor.fetchone()
            ips_verificar = [check_password_hash(ip, dispositivo) for ip in ip["ip_usuario"]]
            if any(ips_verificar):
                return True
    return False

def guardar_ip(correo: str):
    dispositivo=obtener_ip()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT ip_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
            ip=cursor.fetchone()
            ips = ip["ip_usuario"]
            ips_verificar=[]
            if ips is not None:
                ips_verificar=[check_password_hash(ip, dispositivo) for ip in ips ]
            if ip["ip_usuario"] == None or any(ips_verificar)==False:
                dispositivo=encriptar(dispositivo)
                cursor.execute('UPDATE "USUARIOS" SET ip_usuario = array_append(ip_usuario, %s) WHERE correo_usuario = %s', (dispositivo, correo) )

@registrar_funcion("registro")
def registro(form: dict):
    nombre_us=form["nombre_usuario"]
    correo_us=form["correo_usuario"]
    contraseña_us=form["contraseña_usuario"]
    codigo_us_numero=random.randint(100000,999999)
    codigo_us=f"{codigo_us_numero}{correo_us[0:5]}"
    contraseña_encriptada=encriptar(f"{correo_us}{contraseña_us}")
    insertar_db("USUARIOS",{"nombre_usuario": nombre_us, "correo_usuario": correo_us, "contraseña_usuario": contraseña_encriptada, "codigo_usuario": codigo_us})
    guardar_ip(correo_us)
    guardar_sesion(correo_us)
    return jsonify({"redirigir": "/inicio", "mensaje_redirigir": {"mensaje": "Registrado exitosamente", "tipo": "success"}})
        
@registrar_funcion("iniciar_sesion_dispositivo_nuevo")
def iniciar_sesion_dispositivo_nuevo(dato: dict | str):
    correo = dato["correo_usuario"] if isinstance(dato, dict) else dato
    guardar_ip(correo)
    guardar_sesion(correo)
    return jsonify({"redirigir": "/inicio", "mensaje_redirigir": {"mensaje": "Inicio de sesión exitoso", "tipo": "success"}})

@registrar_funcion("cambiar_contraseña_comprobador")
def cambiar_contraseña_comprobador(_=None):
    session["cambiar_contraseña_usuario"]=True
    return jsonify({"redirigir": "/cambiar_contraseña", "mensaje_redirigir": {"mensaje": "Cambia tu contraseña", "tipo": "success"}})
