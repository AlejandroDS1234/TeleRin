from flask import Blueprint, request, jsonify
import psycopg2.extras
from servidor.core.db import conectar

pruebas_bp = Blueprint("pruebas", __name__)

@pruebas_bp.route("/api/simulacion_recomendar_libros", methods=["POST"])

def simulacion_recomendar():
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT h.nombre_historia, h.id_historia, h.descripcion_historia, u.nombre_usuario, ROUND(COALESCE(AVG(ch.calificacion), 0)) AS calificacion_p, COUNT(ch.calificacion) AS personas FROM "historias" h LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia JOIN "USUARIOS" u ON h.codigo_usuario = u.codigo_usuario WHERE h.visibilidad_historia = %s AND id_saga = '' GROUP BY h.nombre_historia, h.id_historia, h.fecha_actualizacion, u.nombre_usuario ORDER BY calificacion_p DESC LIMIT 20""", (True,))
            historias=cursor.fetchall()
    return jsonify(historias)

@pruebas_bp.route("/api/simulacion_recomenda_sagas", methods=["POST"])
def simulacion_recomendar_sagas():
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT s.nombre_saga, s.id_saga, s.imagen_saga, s.descripcion_saga, COUNT(h.id_saga) AS libros FROM "saga" s LEFT JOIN historias h ON s.id_saga =  h.id_saga AND h.visibilidad_historia = %s GROUP BY s.nombre_saga, s.id_saga LIMIT 20""", (True,))
            sagas= cursor.fetchall()
    return jsonify(sagas)