from flask import Blueprint, request, jsonify
import datetime
import psycopg2.extras
from psycopg2.extras import Json

from servidor.core.db import conectar, dato_en_db, insertar_db, actualizar_datos
from servidor.core.decoradores import necesita
from servidor.services.servicios_sesion import obtener_usuario, sesion_iniciada
from servidor.services.servicios_texto import detectar_idioma, obtener_hashtags


historias_bp = Blueprint("historias", __name__)

def hashtag_db(texto: str, id: str, tabla_campo: str):
    hashtags=obtener_hashtags(texto)
    if len(hashtags)<1:
        return False
    for hashtag in hashtags:
        if not dato_en_db(hashtag, "nombre_hashtag", "hashtags"):
            insertar_db("hashtags", {"nombre_hashtag": hashtag})
        index_hashtag=dato_en_db(hashtag, "nombre_hashtag", "hashtags")[0]["id_hashtag"]
        insertar_db(tabla_campo["tabla"], {tabla_campo["campo"]: id, "id_hashtag": index_hashtag})
    return True

@historias_bp.route("/api/guardar_historial/<id_historia>", methods=["POST"])
def guardar_historial(id_historia: str):
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
    codigo_usuario=usuario_actual["codigo_usuario"]
    tiempo=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with conectar() as db:
        with db.cursor() as cursor:
            cursor.execute('INSERT INTO "historial" (codigo_usuario, id_historia, tiempo_vista) VALUES (%s, %s, %s) ON CONFLICT (codigo_usuario, id_historia) DO UPDATE SET tiempo_vista = EXCLUDED.tiempo_vista', (codigo_usuario, id_historia, tiempo))
    return jsonify(["guardado #no se usa"])

@historias_bp.route("/api/crear_historia", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def crear_historia():
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return jsonify({"mensaje":"Necesitas usuario para acceder","tipo": "warning"})
    form = request.get_json()
    nombre_historia=form["nombre_historia"].strip()
    descripcion_historia=form["descripcion_historia"].strip()
    saga_historia=form["saga_historia"]
    historia=Json(form["historia"])
    texto_historia=form["texto_historia"]
    visivilidad_historia=form["visibilidad_historia"] 
    fecha_actualizacion=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    id_historia=f"""-historia-{usuario_actual["codigo_usuario"]}-{saga_historia}-{nombre_historia.strip()}"""
    id_usuario_saga=dato_en_db(None, {"codigo_usuario": usuario_actual["codigo_usuario"], "id_saga": saga_historia}, "saga")
    if not id_usuario_saga and not saga_historia.strip() == "":
        return jsonify({"mensaje":"No tienes acceso a esta saga","tipo": "warning"})
    if nombre_historia.strip() == "" or descripcion_historia.strip() == "":
        return jsonify({"mensaje":"Llena todos los datos","tipo": "warning"})
    if len(nombre_historia.split(" "))>8 or len(nombre_historia)>50:
        return jsonify({"mensaje": "El nombre de la historia es muy largo","tipo": "warning"})
    if len(descripcion_historia.split(" "))>200 or len(descripcion_historia)>500:
        return jsonify({"mensaje":"La descripcion de la historia es muy larga","tipo": "warning"})
    if dato_en_db(None,{"nombre_historia": nombre_historia, "id_saga": saga_historia, "codigo_usuario": usuario_actual["codigo_usuario"]} , "historias"):
        return jsonify({"mensaje":"Ya existe una historia con ese nombre","tipo": "warning"})
    if len(texto_historia.replace(" ", ""))<500 or len(texto_historia)<1000: 
        return jsonify({"mensaje": "El texto de la historia es muy corto","tipo": "warning"})
    idioma = detectar_idioma(texto_historia)
    insertar_db("historias", {"nombre_historia": nombre_historia, "descripcion_historia": descripcion_historia, "visibilidad_historia": visivilidad_historia,"id_saga": saga_historia, "fecha_actualizacion": fecha_actualizacion, "id_historia": id_historia,"contenido_historia": historia,"codigo_usuario": usuario_actual["codigo_usuario"], "idioma": idioma})
    hashtag_db(descripcion_historia, id_historia, {"tabla": "hashtags_historias", "campo": "id_historia"})
    redirigir = f"/historia/{id_historia}"
    if not visivilidad_historia:
        redirigir = "/perfil"
    return jsonify({"redirigir": redirigir, "mensaje_redirigir": {"mensaje": "Historia creada exitosamente", "tipo": "success"}})

@historias_bp.route("/api/historia/<id_historia>", methods=["POST"])
def historia(id_historia):
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT h.nombre_historia, h.id_historia, h.descripcion_historia, h.contenido_historia ,TO_CHAR(h.fecha_actualizacion, 'DD/MM/YYYY') as fecha_actualizacion, u.nombre_usuario, ROUND(COALESCE(AVG(ch.calificacion), 0)) AS calificacion_p, COUNT(ch.calificacion) AS personas FROM "historias" h LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia JOIN "USUARIOS" u ON h.codigo_usuario = u.codigo_usuario WHERE h.visibilidad_historia = %s AND h.id_historia = %s GROUP BY h.nombre_historia, h.id_historia, h.fecha_actualizacion, u.nombre_usuario ORDER BY calificacion_p DESC LIMIT 20""", (True, id_historia))
            historia=cursor.fetchone()
    if not historia:
        return jsonify({"redirigir": "/inicio", "mensaje_redirigir":{"mensaje": "Historia no disponible", "tipo": "danger"}})
    return jsonify(historia)

@historias_bp.route("/api/calificar_historia/<id_historia>", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def calificar_historia(id_historia):
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
    form = request.get_json()
    calificacion = form.get("calificacion")
    id_usuario = usuario_actual["codigo_usuario"]
    historia = dato_en_db(id_historia, "id_historia", "historias")
    if not historia:
        return jsonify({"mensaje": "Historia no encontrada", "tipo": "danger"})
    if calificacion == 0:
        if dato_en_db(None, {"id_historia": id_historia, "codigo_usuario": id_usuario}, "calificacion_historia"):
            with conectar() as db:
                with db.cursor() as cursor:
                    cursor.execute('DELETE FROM "calificacion_historia" WHERE id_historia = %s AND codigo_usuario = %s',(id_historia, id_usuario))
                    db.commit()
        return jsonify({"fin": "Calificacion quitada", "tipo": "danger"})
    if calificacion not in [1, 2, 3]:
        return jsonify({"fin": "Calificación no válida", "tipo": "danger"})
    if dato_en_db(None, {"id_historia": id_historia, "codigo_usuario": id_usuario}, "calificacion_historia"):
        actualizar_datos("calificacion_historia", {"calificacion": calificacion}, {"id_historia": id_historia, "codigo_usuario": id_usuario})
        return jsonify({"fin": "calificacion cambiada", "tipo": "success"})
    insertar_db("calificacion_historia", {"id_historia": id_historia, "calificacion": calificacion, "codigo_usuario": id_usuario})
    return jsonify({"fin": "calificacion cambiada", "tipo": "success"})
  
@historias_bp.route("/api/calificacion_historia/<id_historia>", methods=["POST"])
def calificacion_historia(id_historia):
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
    calificacion = dato_en_db(None, {"id_historia": id_historia, "codigo_usuario": usuario_actual["codigo_usuario"]}, "calificacion_historia")
    return jsonify(calificacion[0]["calificacion"] if calificacion else 0)
  
@historias_bp.route("/api/historial_usuario", methods=["POST"])
def historial_usuario():
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
    codigo_usuario=usuario_actual["codigo_usuario"]
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT h.nombre_historia, h.id_historia, TO_CHAR(h.fecha_actualizacion, 'DD/MM/YYYY') as fecha_actualizacion, h.descripcion_historia, u.nombre_usuario, ROUND(COALESCE(AVG(ch.calificacion), 0)) AS calificacion_p FROM "historias" h JOIN "historial" hl ON h.id_historia = hl.id_historia LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia JOIN "USUARIOS" u ON h.codigo_usuario = u.codigo_usuario WHERE hl.codigo_usuario = %s GROUP BY h.nombre_historia, h.id_historia, h.fecha_actualizacion, h.descripcion_historia, u.nombre_usuario, hl.tiempo_vista ORDER BY hl.tiempo_vista DESC""", (codigo_usuario,))
            historias=cursor.fetchall() 
    return jsonify(historias)

@historias_bp.route("/api/historias_creadas/<codigo_usuario>", methods=["POST"])
def historias_creadas(codigo_usuario):
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT h.nombre_historia, h.id_historia, h.descripcion_historia, u.nombre_usuario, ROUND(COALESCE(AVG(ch.calificacion), 0)) AS calificacion_p, COUNT(ch.calificacion) AS personas FROM "historias" h LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia JOIN "USUARIOS" u ON h.codigo_usuario = u.codigo_usuario WHERE h.codigo_usuario = %s GROUP BY h.nombre_historia, h.id_historia, h.fecha_actualizacion, u.nombre_usuario ORDER BY calificacion_p DESC LIMIT 20""", (codigo_usuario,))
            historias=cursor.fetchall()
    return jsonify(historias)
