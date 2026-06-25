from flask import Blueprint, request, jsonify
import psycopg2.extras

from servidor.core.db import actualizar_datos, conectar
from servidor.core.decoradores import necesita
from servidor.services.servicios_sesion import obtener_usuario, sesion_iniciada
from servidor.services.servicios_perfil import (
    verficar_nombre_usuario,
    verificar_descripcion_usuario,
    verificar_pais_usuario,
    verificar_genero_usuario,
)
from servidor.services.servicios_archivos import (
    ruta_guardado,
    validar_imagen_completa,
    guardar_imagen,
)
from servidor.services.servicios_busqueda import actualizar_autor_indices

perfil_bp = Blueprint("perfil", __name__)

@perfil_bp.route("/api/perfil", methods=["POST"])
def perfil(): 
    verificaciones = {"nombre_usuario": verficar_nombre_usuario, "descripcion_personal": verificar_descripcion_usuario, "id_pais": verificar_pais_usuario, "id_genero": verificar_genero_usuario}
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
    form = request.get_json()
    clave, dato =  list(form.items())[0]
    dato = dato.strip()
    mensaje=verificaciones[clave](dato)
    if mensaje["tipo"] == "success":
        actualizar_datos("USUARIOS", {clave: dato}, {"codigo_usuario": usuario_actual["codigo_usuario"]})
        print("actualizado")
    return jsonify({"mensaje": mensaje, "dato": {"clave": clave, "valor": dato}})
   
@perfil_bp.route("/api/guardar_foto_perfil", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def guardar_foto_perfil():
    if request.method=="POST":
        usuario_actual = obtener_usuario()
        if not usuario_actual:
            return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
        imagen=request.files['imagen']
        mensaje, resultado = validar_imagen_completa(imagen)
        if resultado:
            return jsonify({"mensaje": mensaje, "tipo": "danger"})
        nombre_archivo, ruta=ruta_guardado(usuario_actual["codigo_usuario"], "_perfil", "Fotos/perfil")
        guardar_imagen(imagen, ruta, "perfil")
        actualizar_datos("USUARIOS", {"foto_perfil_usuario": nombre_archivo}, {"correo_usuario": usuario_actual["correo_usuario"]})
        actualizar_autor_indices(usuario_actual["codigo_usuario"], { "foto_perfil_usuario": nombre_archivo }, "historias")
        return jsonify({"mensaje": "Foto de perfil actualizada", "tipo": "success", "foto_perfil_usuario": nombre_archivo})
    
    
@perfil_bp.route("/api/perfil/<codigo_usuario>", methods=["POST"])
def perfil_usuario(codigo_usuario):
    usuario_actual = obtener_usuario()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT codigo_usuario FROM "USUARIOS" WHERE codigo_usuario = %s""", (codigo_usuario,))
            usuario = cursor.fetchone()
            if usuario and usuario["codigo_usuario"] == usuario_actual["codigo_usuario"]:
                 return jsonify({"redirigir": "/perfil"})
            cursor.execute("""SELECT codigo_usuario, nombre_usuario, descripcion_personal, id_pais, id_genero, foto_perfil_usuario FROM "USUARIOS" WHERE codigo_usuario = %s""", (codigo_usuario,))
            usuario = cursor.fetchone()
            if not usuario:
                return jsonify({"redirigir": "/inicio","mensaje_redirigir": {"mensaje": "Usuario no encontrado", "tipo": "danger"}})
            return jsonify(usuario)


