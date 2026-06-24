from servidor.services.servicios_texto import hay_caracteres_repetidos
from servidor.core.db import dato_en_db, conectar
from servidor.core.decoradores import necesita
from servidor.services.servicios_sesion import obtener_usuario, sesion_iniciada
import psycopg2.extras

@necesita("usuario", sesion_iniciada)
def verificar_nommbre_historia(nombre: str, id_saga: str, id_historia: str):
    usuario_actual = obtener_usuario()
    if not nombre:
        return {"mensaje": "El nombre no puede estar vacio", "tipo": "warning"}
    if hay_caracteres_repetidos(nombre):
        return {"mensaje": "Nombre no valido", "tipo": "warning"}
    if len(nombre)>50 or len(nombre.split(" "))>8:
        return {"mensaje": "Nombre muy largo", "tipo": "warning"}
    with conectar() as db:
        with db.cursor() as cursor:
            cursor.execute("""SELECT id_historia FROM "historias" WHERE codigo_usuario = %s AND id_saga = %s AND nombre_historia = %s""", (usuario_actual["codigo_usuario"], id_saga, nombre))
            historia_id = cursor.fetchone()
            if historia_id and historia_id[0] != id_historia:
                return {"mensaje": "Ya existe una historia con ese nombre", "tipo": "warning"}
    return False


def verificar_descripcion_historia(descripcion: str):
    if not descripcion:
        return {"mensaje": "La descripcion no puede estar vacia", "tipo": "warning"}
    if hay_caracteres_repetidos(descripcion):
        return {"mensaje": "Descripcion no valida", "tipo": "warning"}
    if len(descripcion)>700 or len(descripcion.split(" "))>10:
        return {"mensaje": "Descripcion muy larga", "tipo": "warning"}
    return False

def verificar_saga(id_saga: str):
    usuario_actual = obtener_usuario()
    id_usuario_saga=dato_en_db(None, {"codigo_usuario": usuario_actual["codigo_usuario"], "id_saga": id_saga}, "saga")
    if not id_usuario_saga and not id_saga.strip() == "":
        return {"mensaje":"No tienes acceso a esta saga","tipo": "warning"}
    return False
    
    
def verificar_historia(texto: str):
    if not texto:
        return {"mensaje": "La historia no puede estar vacia", "tipo": "warning"}
    if len(texto.replace(" ", ""))<500 or len(texto)<1000: 
        return {"mensaje": "La historia es muy corta","tipo": "warning"}
    return False

def verificar_id(id: str):
    if not id:
        return {"mensaje": "El id no puede estar vacio", "tipo": "warning"}
    if not dato_en_db(id, "id_historia", "historias"):
        return {"mensaje": "El id no es valido", "tipo": "warning"}
    if not dato_en_db(None, {"id_historia": id, "codigo_usuario": obtener_usuario()["codigo_usuario"]}, "historias"):
        return {"mensaje": "No tienes acceso a esta historia", "tipo": "warning"}
    return False

def obtener_info_todas_historias():  
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT h.id_historia, h.nombre_historia, h.descripcion_historia, u.nombre_usuario, u.codigo_usuario, u.foto_perfil_usuario,COUNT(ch.calificacion) AS vistas, ROUND(COALESCE(AVG(ch.calificacion), 0)) AS calificacion, h.visibilidad_historia, COALESCE(array_agg(hs.nombre_hashtag) FILTER (WHERE hh.id_hashtag IS NOT NULL), '{}') AS hashtags, h.contenido_historia, h.id_saga, s.nombre_saga FROM "historias" h LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia JOIN "USUARIOS" u ON h.codigo_usuario = u.codigo_usuario LEFT JOIN hashtags_historias hh ON h.id_historia = hh.id_historia LEFT JOIN hashtags hs ON hh.id_hashtag = hs.id_hashtag LEFT JOIN saga s ON h.id_saga = s.id_saga WHERE h.publicada = TRUE GROUP BY h.id_historia, h.nombre_historia, h.descripcion_historia, u.nombre_usuario, u.codigo_usuario, h.visibilidad_historia, h.fecha_actualizacion, h.contenido_historia, h.id_saga, s.nombre_saga""")
            historias=cursor.fetchall()
            return historias
  
def obtener_info_historia(id_historia):
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT h.id_historia, h.nombre_historia, h.descripcion_historia, u.nombre_usuario, u.codigo_usuario, u.foto_perfil_usuario,COUNT(ch.calificacion) AS vistas, ROUND(COALESCE(AVG(ch.calificacion), 0)) AS calificacion, h.visibilidad_historia, COALESCE(array_agg(hs.nombre_hashtag) FILTER (WHERE hh.id_hashtag IS NOT NULL), '{}') AS hashtags, h.contenido_historia, h.id_saga, s.nombre_saga FROM "historias" h LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia JOIN "USUARIOS" u ON h.codigo_usuario = u.codigo_usuario LEFT JOIN hashtags_historias hh ON h.id_historia = hh.id_historia LEFT JOIN hashtags hs ON hh.id_hashtag = hs.id_hashtag LEFT JOIN saga s ON h.id_saga = s.id_saga WHERE h.publicada = TRUE AND h.id_historia= %s GROUP BY h.id_historia, h.nombre_historia, h.descripcion_historia, u.nombre_usuario, u.codigo_usuario, h.visibilidad_historia, h.fecha_actualizacion, h.contenido_historia, h.id_saga, s.nombre_saga""", (id_historia,))
            historia=cursor.fetchone()
            return historia