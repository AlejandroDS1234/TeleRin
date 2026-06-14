
from flask import Blueprint, request, jsonify
from PIL import Image
import psycopg2.extras
from servidor.core.db import conectar, dato_en_db, insertar_db
from servidor.core.decoradores import necesita
from servidor.services.servicios_sesion import obtener_usuario, sesion_iniciada
from servidor.services.servicios_archivos import (
    ruta_guardado,
    validar_imagen_completa,
    generar_imagen_reducida,
    guardar_imagen,
)
from servidor.routes.rutas_historias import hashtag_db

sagas_bp = Blueprint("sagas", __name__)


@sagas_bp.route("/api/crear_saga", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def crear_saga():
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
    nombre_saga=request.form["nombre_saga"].strip()
    descripcion_saga=request.form["descripcion_saga"].strip()
    imagen_saga=request.files.get("imagen_saga", None)
    id_saga=f"""-inicio-{usuario_actual["codigo_usuario"]}-{nombre_saga.strip()}"""
    if nombre_saga.strip() == "" or descripcion_saga.strip() == "" or imagen_saga.filename == "":
        return jsonify({"mensaje": "Llena todos los datos", "tipo": "danger"})
    sagas_con_mismo_nombre=dato_en_db(None, {"nombre_saga": nombre_saga, "codigo_usuario": usuario_actual["codigo_usuario"]}, "saga")
    if sagas_con_mismo_nombre:
        return jsonify({"mensaje": "Ya existe una saga con ese nombre", "tipo": "danger"})
    mensaje, resultado = validar_imagen_completa(imagen_saga)
    if resultado:
        return jsonify({"mensaje": mensaje, "tipo": "danger"})
    if len(nombre_saga.split(" "))>6 or len(nombre_saga)>50:
        return jsonify({"mensaje": "El nombre de la saga es muy largo","tipo": "danger"})
    if len(descripcion_saga.split(" "))>60 or len(descripcion_saga)>500:
        return jsonify({"mensaje": "La descripcion de la saga es muy larga","tipo": "danger"})
    imagen_saga_nombre, imagen_saga_ruta=ruta_guardado(id_saga, "_saga", "Fotos/fotos_sagas")
    guardar_imagen(imagen_saga, imagen_saga_ruta)
    saga = {"id_saga": id_saga, "nombre_saga": nombre_saga, "descripcion_saga": descripcion_saga, "imagen_saga": imagen_saga_nombre, "codigo_usuario": usuario_actual["codigo_usuario"]}
    insertar_db("saga", saga)
    hashtag_db(descripcion_saga, id_saga, {"tabla": "hashtags_sagas", "campo": "id_saga"})
    return jsonify({"mensaje": "Saga creada", "tipo": "success", "saga": saga})

@sagas_bp.route("/api/sagas_creadas/<usuario>", methods=["POST"])
def sagas_creadas(usuario):
    usuario_sesion = obtener_usuario()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT s.nombre_saga, s.id_saga, s.imagen_saga, s.descripcion_saga, COUNT(h.id_saga) AS libros FROM "saga" s LEFT JOIN historias h ON s.id_saga = h.id_saga AND h.visibilidad_historia IN %s WHERE s.codigo_usuario = %s GROUP BY s.nombre_saga, s.id_saga ORDER BY s.fecha_actualizacion DESC""", ((True,not (usuario_sesion["codigo_usuario"] == usuario)), usuario))
            sagas= cursor.fetchall()
    return jsonify(sagas)
  
        
@sagas_bp.route("/api/saga_info/<id_saga>")
def saga(id_saga):
    usuario = obtener_usuario()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT id_historia FROM "historias" WHERE id_saga = %s AND codigo_usuario = %s""", (id_saga, usuario["codigo_usuario"]))
            historia_usuario=cursor.fetchall()
            cursor.execute("""SELECT s.nombre_saga, s.id_saga, s.imagen_saga, s.descripcion_saga, COUNT(h.id_saga) AS libros, u.nombre_usuario FROM "saga" s LEFT JOIN historias h ON s.id_saga = h.id_saga AND h.visibilidad_historia IN %s JOIN "USUARIOS" u ON s.codigo_usuario = u.codigo_usuario WHERE s.id_saga = %s GROUP BY s.nombre_saga, s.id_saga, u.nombre_usuario""", ((True, (not bool(historia_usuario))), id_saga))
            saga= cursor.fetchone()
    if not saga:
        return jsonify({"redirigir": "/inicio", "mensaje_redirigir": {"mensaje": "Saga no encontrada", "tipo": "danger"}})
    return saga

@sagas_bp.route("/api/sagas_historias/<id_saga>", methods=["POST"])
def sagas_historias(id_saga):
    usuario = obtener_usuario()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT id_historia FROM "historias" WHERE id_saga = %s AND codigo_usuario = %s""", (id_saga, usuario["codigo_usuario"]))
            historia_usuario=cursor.fetchall()
            cursor.execute("""SELECT h.nombre_historia, h.id_historia, h.visibilidad_historia ,TO_CHAR(h.fecha_actualizacion,'DD/MM/YYYY'), h.descripcion_historia, u.nombre_usuario, u.foto_perfil_usuario, u.codigo_usuario,  ROUND(COALESCE(AVG(ch.calificacion), 0)) AS calificacion_p, COUNT(ch.calificacion) AS personas FROM "historias" h LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia JOIN "USUARIOS" u ON h.codigo_usuario = u.codigo_usuario WHERE h.visibilidad_historia IN %s AND h.id_saga = %s GROUP BY h.nombre_historia, h.id_historia,  u.nombre_usuario, u.foto_perfil_usuario, u.codigo_usuario ORDER BY h.fecha_actualizacion DESC""", ((True,(not bool(historia_usuario))), id_saga))
            historias=cursor.fetchall()
    return jsonify(historias)