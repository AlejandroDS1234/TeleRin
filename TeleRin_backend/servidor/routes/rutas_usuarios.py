from flask import Blueprint, request, jsonify
import psycopg2.extras
from servidor.core.db import conectar, insertar_db
from servidor.core.decoradores import necesita
from servidor.services.servicios_sesion import obtener_usuario, sesion_iniciada
from servidor.services.servicios_busqueda import actualizar_documento
from servidor.services.servicios_usuarios import obtener_usuario_codigo, siguiendo_usuario

usuarios_bp = Blueprint("usuarios", __name__)

@usuarios_bp.route("/api/seguidos/<codigo_usuario>", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def seguidos(codigo_usuario):
    usuario = obtener_usuario()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT u.nombre_usuario, u.foto_perfil_usuario, u.codigo_usuario,
                            EXISTS (
                                SELECT TRUE 
                                FROM usuarios_seguidos us2 
                                WHERE us2.codigo_usuario_seguidor = %s AND us2.codigo_usuario_seguido = u.codigo_usuario
                            ) AS seguido
                            FROM "USUARIOS" u
                            JOIN usuarios_seguidos us
                            ON us.codigo_usuario_seguido = u.codigo_usuario
                            WHERE us.codigo_usuario_seguidor = %s""", (usuario["codigo_usuario"],codigo_usuario,))
            seguidos = cursor.fetchall()
            return jsonify(seguidos)
        
@usuarios_bp.route("/api/seguidores/<codigo_usuario>", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def seguidores(codigo_usuario):
    usuario = obtener_usuario()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT u.nombre_usuario, u.foto_perfil_usuario, u.codigo_usuario,
                            EXISTS (
                                SELECT TRUE 
                                FROM usuarios_seguidos us2 
                                WHERE us2.codigo_usuario_seguidor = %s AND us2.codigo_usuario_seguido = u.codigo_usuario
                            ) AS seguido
                            FROM "USUARIOS" u
                            JOIN usuarios_seguidos us
                            ON us.codigo_usuario_seguidor = u.codigo_usuario
                            WHERE us.codigo_usuario_seguido = %s""", (usuario["codigo_usuario"], codigo_usuario))
            seguidores = cursor.fetchall()
            return jsonify(seguidores)
        
@usuarios_bp.route("/api/siguiendo_usuario/<codigo_usuario>", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def siguiendo_usuario_ruta(codigo_usuario):
    return jsonify(siguiendo_usuario(codigo_usuario))
  
@usuarios_bp.route("/api/seguir_usuario/<codigo_usuario>", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def seguir_usuario(codigo_usuario):
    usuario_actual = obtener_usuario()
    insertar_db("usuarios_seguidos", {"codigo_usuario_seguidor": usuario_actual["codigo_usuario"], "codigo_usuario_seguido": codigo_usuario})
    actualizar_documento("usuarios", codigo_usuario, obtener_usuario_codigo(codigo_usuario))
    return jsonify({"codigo": codigo_usuario, "tipo": "success"})

@usuarios_bp.route("/api/dejar_seguir_usuario/<codigo_usuario>", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def dejar_seguir_usuario(codigo_usuario):
    usuario_actual = obtener_usuario()
    with conectar() as db:
        with db.cursor() as cursor:
            cursor.execute("""DELETE FROM usuarios_seguidos WHERE codigo_usuario_seguidor = %s AND codigo_usuario_seguido = %s""", (usuario_actual["codigo_usuario"], codigo_usuario))
    actualizar_documento("usuarios", codigo_usuario, obtener_usuario_codigo(codigo_usuario))
    return jsonify({"codigo": codigo_usuario, "tipo": "success"})



    
