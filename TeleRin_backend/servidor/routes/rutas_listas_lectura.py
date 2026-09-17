from flask import Blueprint, jsonify
from servidor.core.db import dato_en_db, conectar
from servidor.services.servicios_sesion import obtener_usuario
import psycopg2.extras

listas_lectura_bp = Blueprint("listas_lectura", __name__)


@listas_lectura_bp.route("/api/crear_lista_lectura", methods=["POST"])
def crear_lista_lectura():
    pass


@listas_lectura_bp.route("/api/listas_lectura/<codigo_usuario>", methods=["GET"])
def listas_lectura(codigo_usuario):
    usuario = obtener_usuario()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute(
                """
            with conteo_libros AS (
                SELECT id_lista, COUNT(*) AS total_libros
                FROM lista_lectura_historias
                GROUP BY id_lista
            )
            SELECT l.id_lista, l.nombre_lista, l.visibilidad,
            COALESCE(c.total_libros, 0) AS cantidad_elementos,
            json_build_object('nombre_usuario', u.nombre_usuario, 'foto_perfil_usuario', u.foto_perfil_usuario, 'codigo_usuario', u.codigo_usuario) AS autor
            FROM listas_lectura l
            JOIN "USUARIOS" u ON l.codigo_usuario = u.codigo_usuario
            LEFT JOIN conteo_libros c  ON c.id_lista = l.id_lista
            WHERE l.codigo_usuario = %s AND l.visibilidad IN %s
            """,
                (
                    codigo_usuario,
                    (True, (not bool(usuario["codigo_usuario"] == codigo_usuario))),
                ),
            )
            datos = cursor.fetchall()
            print(datos)
    return jsonify(datos)
