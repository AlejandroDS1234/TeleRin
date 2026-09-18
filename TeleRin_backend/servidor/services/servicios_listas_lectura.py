import psycopg2.extras
from servidor.core.db import conectar, insertar_db, dato_en_db, actualizar_datos
import uuid


def crear_lista_lectura(nombre: str, codigo_usuario: str, visibilidad: bool):
    id_lista = uuid.uuid4()
    insertar_db(
        "listas_lectura",
        {
            "id_lista": id_lista,
            "nombre_lista": nombre,
            "visibilidad": visibilidad,
            "codigo_usuario": codigo_usuario,
        },
    )
