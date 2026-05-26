from flask import session
import psycopg2 as ps
import psycopg2.extras
from servidor.core.db import conectar

def guardar_temporalmente_datos(datos: dict):
    session["datos_temporales"]=datos
            
def guardar_funcion_proveniente(nombre_funcion: str):
    session["funcion_proveniente"]=nombre_funcion

def guardar_sesion(correo: str):
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT codigo_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
            codigo_usuario=cursor.fetchone()
            if codigo_usuario:
                session["codigo_usuario"] = codigo_usuario["codigo_usuario"]

def obtener_usuario():
    codigo = session.get("codigo_usuario")
    if not codigo:
        return None
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT * FROM "USUARIOS" WHERE codigo_usuario = %s', (codigo,))
            usuario=cursor.fetchone()
            return usuario

def sesion_iniciada():
    return session.get("codigo_usuario") != None