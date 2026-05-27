import psycopg2 as ps
import psycopg2.extras
import os
from flask import redirect, url_for

def conectar():
    try:
        db = ps.connect(
            host=os.getenv("POSTGRES_HOST", "localhost"),
            port=os.getenv("POSTGRES_PORT", "5432"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            database=os.getenv("POSTGRES_DB")
        )
        if db is None:
            return redirect(url_for("index"))
        return db
    except:
        print("Error al conectar")

def dato_en_db(dato: str | None, nombre_dato: str | dict, tabla: str = "USUARIOS") -> dict | None:
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            comando=f"""SELECT * FROM "{tabla}" WHERE """
            datos=[]
            if isinstance(nombre_dato, dict):
                condicion=""
                for clave in nombre_dato.keys():
                    condicion+=f"{clave} = %s AND "
                    datos.append(nombre_dato[clave])
                condicion=condicion[:-5]
                comando+=condicion
            else:
                comando+=f"{nombre_dato} = %s"
                datos.append(dato)
            cursor.execute(comando, tuple(datos))
            resultado=cursor.fetchall()
            return resultado
        
def insertar_db(tabla: str, datos: dict):
    with conectar() as db:
        with db.cursor() as cursor:
            comando=f"""INSERT INTO "{tabla}" ("""
            datos_insertar=[]
            datos_str=""
            valores=""") VALUES ("""
            for clave in datos.keys():
                datos_str+=f"{clave}, "
                datos_insertar.append(datos[clave])
                valores+="%s, "
            datos_str=datos_str[0:-2]
            valores=valores[0:-2]
            valores+=")"
            comando+=datos_str
            comando+=valores
            cursor.execute(comando, tuple(datos_insertar))
            db.commit()
            
def actualizar_datos(tabla: str, datos: dict, condicion: dict):
    with conectar() as db:
        with db.cursor() as cursor:
            comando=f"""UPDATE "{tabla}" SET """
            datos_actualizar=[]
            datos_str=""
            for clave in datos.keys():
                datos_str+=f"{clave} = %s, "
                datos_actualizar.append(datos[clave])
            datos_str=datos_str[0:-2]
            comando+=datos_str
            comando+=" WHERE "
            datos_str=""
            for clave in condicion.keys():
                datos_str+=f"{clave} = %s AND "
                datos_actualizar.append(condicion[clave])
            datos_str=datos_str[:-5]
            comando+=datos_str
            cursor.execute(comando, tuple(datos_actualizar))
            db.commit()