from flask import Blueprint, jsonify
from servidor.core.db import dato_en_db, conectar
import psycopg2.extras

listas_lectura_bp = Blueprint("listas_lectura", __name__)


@listas_lectura_bp.route("/api/crear_lista_lectura", methods=["POST"])
def crear_lista_lectura():
    pass


@listas_lectura_bp.route("/api/listas_lectura/<codigo_usuario>", methods=["GET"])
def listas_lectura(codigo_usuario):
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute(
                "SELECT * FROM listas_lectura WHERE codigo_usuario = %s",
                (codigo_usuario,),
            )
            datos = cursor.fetchall()
    return jsonify(datos)
