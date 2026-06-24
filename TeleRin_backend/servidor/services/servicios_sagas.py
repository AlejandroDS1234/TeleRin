from servidor.core.db import conectar
import psycopg2.extras

def obtener_info_todas_sagas():
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""  """)