import psycopg2
import pandas as pd


def conectar():
    try:
        conexion = psycopg2.connect(
            host="db",
            port=5432,
            user="postgres",
            password="123456",
            database="TeleRin"
        )
    except psycopg2.Error as e:
        print("Error al conectar a la base de datos:", e)
        return None
    return conexion


def obtener_historias():
    comando_obtener_todas_historias = """SELECT h.id_historia, h.nombre_historia, h.descripcion_historia, h.codigo_usuario, s.nombre_saga , STRING_AGG(ht.nombre_hashtag, ' ') AS hashtags
    FROM historias h
    LEFT JOIN hashtags_historias hh
    ON hh.id_historia = h.id_historia
    LEFT JOIN saga s
    ON s.id_saga = h.id_saga
    LEFT JOIN hashtags ht
    ON ht.id_hashtag = hh.id_hashtag
    GROUP BY h.id_historia,h.nombre_historia,h.descripcion_historia,h.codigo_usuario,s.nombre_saga"""
    with conectar() as db:
        with db.cursor() as cursor:
            cursor.execute(comando_obtener_todas_historias)
            historias = cursor.fetchall()
    return historias



