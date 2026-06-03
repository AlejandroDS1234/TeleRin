from flask import Blueprint, request, jsonify
import psycopg2.extras
from servidor.core.db import actualizar_datos, conectar
from servidor.core.decoradores import necesita
from servidor.services.servicios_sesion import obtener_usuario, sesion_iniciada



usuarios_bp = Blueprint("usuarios", __name__)

@usuarios_bp.route("/api/seguidos/<codigo_usuario>", methods=["POST"])
def seguidos(codigo_usuario):
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT u.nombre_usuario, u.foto_perfil_usuario, u.codigo_usuario FROM "USUARIOS" u JOIN usuarios_seguidos us ON us.codigo_usuario_seguido = u.codigo_usuario WHERE us.codigo_usuario_seguidor = %s""", (codigo_usuario,))
            seguidos = cursor.fetchall()
            print(seguidos)
            print(codigo_usuario)
            return jsonify(seguidos)
        
        
@usuarios_bp.route("/api/seguidores/<codigo_usuario>", methods=["POST"])
def seguidores(codigo_usuario):
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT u.nombre_usuario, u.foto_perfil_usuario, u.codigo_usuario FROM "USUARIOS" u JOIN usuarios_seguidos us ON us.codigo_usuario_seguidor = u.codigo_usuario WHERE us.codigo_usuario_seguido = %s""", (codigo_usuario,))
            seguidores = cursor.fetchall()
            return jsonify(seguidores)