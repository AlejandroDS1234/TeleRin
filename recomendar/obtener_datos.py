import psycopg2

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
    comando_obtener_todas_historias = """SELECT h.id_historia, h.nombre_historia, h.descripcion_historia, h.codigo_usuario, h.idioma, s.nombre_saga , STRING_AGG(ht.nombre_hashtag, ' ') AS hashtags
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

def obtener_historial(id_usuario: str):
    comado_obtener_historial = """SELECT
    hu.codigo_usuario,
    h.id_historia,
    h.nombre_historia,
    h.descripcion_historia,
    h.idioma,
    s.nombre_saga,
    STRING_AGG(ht.nombre_hashtag,' ') AS hashtags
    FROM historial hu
    JOIN historias h
    ON h.id_historia = hu.id_historia
    LEFT JOIN saga s
    ON s.id_saga = h.id_saga
    LEFT JOIN hashtags_historias hh
    ON hh.id_historia = h.id_historia
    LEFT JOIN hashtags ht
    ON ht.id_hashtag = hh.id_hashtag
    WHERE hu.codigo_usuario = %s
    GROUP BY hu.codigo_usuario,h.id_historia,h.nombre_historia,h.descripcion_historia,s.nombre_saga"""
    with conectar() as db:
        with db.cursor() as cursor:
            cursor.execute(comado_obtener_historial, (id_usuario,))
            historial = cursor.fetchall()
    return historial

def obtener_sagas():
    comando_obtener_todas_sagas = """
    SELECT s.nombre_saga, s.descripcion_saga, s.codigo_usuario, STRING_AGG(ht.nombre_hashtag, ' ') AS hashtags
        FROM saga s
        LEFT JOIN hashtags_sagas hs
        ON hs.id_saga = s.id_saga
        LEFT JOIN hashtags ht
        ON ht.id_hashtag = hs.id_hashtag
        GROUP BY s.id_saga,s.nombre_saga,s.descripcion_saga,s.codigo_usuario
    """
    with conectar() as db:
        with db.cursor() as cursor:
            cursor.execute(comando_obtener_todas_sagas)
            sagas = cursor.fetchall()
    return sagas




    




