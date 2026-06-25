from flask import Blueprint, request, jsonify
import datetime
import psycopg2.extras
from psycopg2.extras import Json
import uuid
from servidor.core.db import conectar, dato_en_db, insertar_db, actualizar_datos
from servidor.core.decoradores import necesita
from servidor.services.servicios_sesion import obtener_usuario, sesion_iniciada
from servidor.services.servicios_texto import detectar_idioma, obtener_hashtags, delta_texto
from servidor.services.servicios_historias import verificar_nommbre_historia, verificar_descripcion_historia, verificar_saga, verificar_historia, verificar_id, obtener_info_historia
from servidor.services.servicios_busqueda import indexar, actualizar_documento
from servidor.services.servicios_sagas import obtener_info_saga
   
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
@necesita("usuario", sesion_iniciada)
def guardar_historial(id_historia: str):
    usuario_actual = obtener_usuario()
    codigo_usuario=usuario_actual["codigo_usuario"]
    tiempo=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with conectar() as db:
        with db.cursor() as cursor:
            cursor.execute('INSERT INTO "historial" (codigo_usuario, id_historia, tiempo_vista) VALUES (%s, %s, %s) ON CONFLICT (codigo_usuario, id_historia) DO UPDATE SET tiempo_vista = EXCLUDED.tiempo_vista', (codigo_usuario, id_historia, tiempo))
    info = obtener_info_historia(id_historia)
    del info["contenido_historia"]
    actualizar_documento("historias", id_historia, info)
    if info["id_saga"]:
        info_saga = obtener_info_saga(info["id_saga"])
        actualizar_documento("sagas", info["id_saga"], info_saga)
    return jsonify(["guardado #no se usa"])

@historias_bp.route("/api/crear_historia", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def crear_historia():
    form = request.get_json()
    nombre_historia=form["nombre_historia"]
    descripcion_historia=form["descripcion_historia"]
    saga_historia=form["saga_historia"]
    historia=Json(form["historia"])
    texto_historia=form["texto_historia"]
    visivilidad_historia=form["visibilidad_historia"] 
    idioma = detectar_idioma(texto_historia)
    id_historia=form.get("id_historia")
    mensajes = [
        verificar_nommbre_historia(nombre_historia, saga_historia, id_historia),
        verificar_descripcion_historia(descripcion_historia),
        verificar_saga(saga_historia),
        verificar_historia(texto_historia),
        verificar_id(id_historia)
    ]
    for mensaje in mensajes:
        if mensaje:
            return jsonify(mensaje)
    
    redirigir = f"/historia/{id_historia}"
    if not visivilidad_historia:
        redirigir = "/perfil"
    with conectar() as db:
        with db.cursor() as cursor:
            cursor.execute("""SELECT publicada FROM "historias" WHERE id_historia = %s""", (id_historia,))
            publicada=cursor.fetchone()
    mensaje = "Historia actualizada" if publicada else "Historia creada"
    actualizar_datos("historias", {"nombre_historia": nombre_historia, "descripcion_historia": descripcion_historia, "id_saga": saga_historia, "contenido_historia": historia, "idioma": idioma, "visibilidad_historia": visivilidad_historia, "publicada": True, "borrador_historia": None}, {"id_historia": id_historia})
    hashtag_db(descripcion_historia, id_historia, {"tabla": "hashtags_historias", "campo": "id_historia"})
    info_h = obtener_info_historia(id_historia)
    info_h["contenido_historia"] = delta_texto(info_h["contenido_historia"])
    print(publicada)
    if publicada[0] is False or publicada is None:
        indexar("historias", id_historia, info_h)
    else:    
        actualizar_documento("historias", id_historia, info_h)
    if saga_historia:
        info_s=obtener_info_saga(saga_historia)
        actualizar_documento("sagas", saga_historia, info_s)
    return jsonify({"redirigir": redirigir, "mensaje_redirigir": {"mensaje": mensaje, "tipo": "success"}, "id_historia": id_historia})

@historias_bp.route("/api/borrador_historia", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def crear_borrador_historia():
    usuario_actual = obtener_usuario()
    form = request.get_json()
    print(form)
    historia=Json(form["historia"])
    texto_historia=form["texto_historia"]
    id_historia=form.get("id_historia")
    if not id_historia:
        id_historia=f"{usuario_actual['codigo_usuario']}-{uuid.uuid4()}"
    if len(texto_historia)<10:
        return jsonify("")
    insertar_db("historias", {"id_historia": id_historia, "publicada": False, "borrador_historia": historia, "codigo_usuario": usuario_actual["codigo_usuario"]})
    return jsonify(id_historia)

@historias_bp.route("/api/editar_historia/<id_historia>", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def editar_historia(id_historia):
    usuario = obtener_usuario()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT id_historia FROM "historias" WHERE id_historia = %s AND codigo_usuario = %s""", (id_historia, usuario["codigo_usuario"]))
            historia_usuario=cursor.fetchall()
            print(historia_usuario)
            if not historia_usuario:
                return jsonify({"redirigir": "/inicio", "mensaje_redirigir": {"mensaje": "Historia no disponible", "tipo": "danger"}})
            cursor.execute("""SELECT h.nombre_historia, h.id_saga ,h.visibilidad_historia ,h.id_historia, h.descripcion_historia, h.contenido_historia, h.borrador_historia, h.publicada ,TO_CHAR(h.fecha_actualizacion, 'DD/MM/YYYY') as fecha_actualizacion FROM "historias" h LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia JOIN "USUARIOS" u ON h.codigo_usuario = u.codigo_usuario WHERE h.id_historia = %s GROUP BY h.nombre_historia, h.id_historia, h.visibilidad_historia, h.fecha_actualizacion, h.publicada""", (id_historia,))
            historia=cursor.fetchone()
    if not historia:
        return jsonify({"redirigir": "/inicio", "mensaje_redirigir":{"mensaje": "Historia no disponible", "tipo": "danger"}})
    if not historia["borrador_historia"]:
        historia["borrador_historia"] = historia["contenido_historia"]
    return jsonify(historia)
    
@historias_bp.route("/api/guardar_borrador_historia", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def guardar_borrador_historia():
    usuario_actual = obtener_usuario()
    form=request.get_json()
    id_historia = form["id_historia"]
    borrador_historia = Json(form["borrador_historia"])
    with conectar() as db:
        with db.cursor() as cursor:
            cursor.execute("SELECT id_historia FROM historias WHERE id_historia = %s AND codigo_usuario = %s", (id_historia, usuario_actual["codigo_usuario"]))
            historia_usuario=cursor.fetchall()
            if not historia_usuario:
                return jsonify({"redirigir": "/inicio", "mensaje_redirigir":{"mensaje": "Historia no disponible", "tipo": "danger"}})
    actualizar_datos("historias", {"borrador_historia": borrador_historia}, {"id_historia": id_historia})
    return jsonify({"mensaje": "Borrador guardado", "tipo": "success"})


@historias_bp.route("/api/historia/<id_historia>", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def historia(id_historia):
    usuario = obtener_usuario()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT id_historia FROM "historias" WHERE id_historia = %s AND codigo_usuario = %s""", (id_historia, usuario["codigo_usuario"]))
            historia_usuario=cursor.fetchall()
            cursor.execute("""SELECT h.nombre_historia, h.id_historia, h.visibilidad_historia ,h.id_historia, h.descripcion_historia, h.contenido_historia ,TO_CHAR(h.fecha_actualizacion, 'DD/MM/YYYY') as fecha_actualizacion, u.nombre_usuario, u.foto_perfil_usuario, u.codigo_usuario,ROUND(COALESCE(AVG(ch.calificacion), 0)) AS calificacion_p, COUNT(ch.calificacion) AS personas FROM "historias" h LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia JOIN "USUARIOS" u ON h.codigo_usuario = u.codigo_usuario WHERE h.visibilidad_historia IN %s AND h.id_historia = %s AND h.publicada = TRUE GROUP BY h.nombre_historia, h.id_historia, h.visibilidad_historia, h.fecha_actualizacion, u.nombre_usuario, u.foto_perfil_usuario, u.codigo_usuario ORDER BY calificacion_p DESC LIMIT 20""", ((True,(not bool(historia_usuario))), id_historia))
            historia=cursor.fetchone()
    if not historia:
        return jsonify({"redirigir": "/inicio", "mensaje_redirigir":{"mensaje": "Historia no disponible", "tipo": "danger"}})
    return jsonify(historia)

@historias_bp.route("/api/calificar_historia/<id_historia>", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def calificar_historia(id_historia):
    usuario_actual = obtener_usuario()
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
    info = obtener_info_historia(id_historia)
    del info["contenido_historia"]
    actualizar_documento("historias", id_historia, info)
    if info["id_saga"]:
        info_saga= obtener_info_saga(info["id_saga"])
        actualizar_documento("sagas", info["id_saga"], info_saga)
    return jsonify({"fin": "calificacion cambiada", "tipo": "success"})
  
@historias_bp.route("/api/calificacion_historia/<id_historia>", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def calificacion_historia(id_historia):
    usuario_actual = obtener_usuario()
    calificacion = dato_en_db(None, {"id_historia": id_historia, "codigo_usuario": usuario_actual["codigo_usuario"]}, "calificacion_historia")
    return jsonify(calificacion[0]["calificacion"] if calificacion else 0)
  
@historias_bp.route("/api/historial_usuario", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def historial_usuario():
    usuario_actual = obtener_usuario()
    codigo_usuario=usuario_actual["codigo_usuario"]
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT h.nombre_historia, h.id_historia, TO_CHAR(h.fecha_actualizacion, 'DD/MM/YYYY') as fecha_actualizacion, h.descripcion_historia, u.nombre_usuario, u.foto_perfil_usuario, u.codigo_usuario , ROUND(COALESCE(AVG(ch.calificacion), 0)) AS calificacion_p FROM "historias" h JOIN "historial" hl ON h.id_historia = hl.id_historia LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia JOIN "USUARIOS" u ON h.codigo_usuario = u.codigo_usuario WHERE hl.codigo_usuario = %s GROUP BY h.nombre_historia, h.id_historia, h.fecha_actualizacion, h.descripcion_historia, u.nombre_usuario, hl.tiempo_vista, u.foto_perfil_usuario, u.codigo_usuario ORDER BY hl.tiempo_vista DESC""", (codigo_usuario,))
            historias=cursor.fetchall() 
    return jsonify(historias)

@historias_bp.route("/api/historias_creadas/<codigo_usuario>", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def historias_creadas(codigo_usuario):
    usuario = obtener_usuario()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT h.nombre_historia, h.id_historia, h.visibilidad_historia ,TO_CHAR(h.fecha_actualizacion,'DD/MM/YYYY') as fecha_actualizacion, h.descripcion_historia, u.nombre_usuario, u.foto_perfil_usuario, u.codigo_usuario, ROUND(COALESCE(AVG(ch.calificacion), 0)) AS calificacion_p, COUNT(ch.calificacion) AS personas FROM "historias" h LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia JOIN "USUARIOS" u ON h.codigo_usuario = u.codigo_usuario WHERE h.codigo_usuario = %s AND h.id_saga = '' AND h.visibilidad_historia IN %s AND h.publicada = TRUE GROUP BY h.nombre_historia, h.id_historia, h.fecha_actualizacion, u.nombre_usuario, u.foto_perfil_usuario, u.codigo_usuario ORDER BY h.fecha_actualizacion DESC""", (codigo_usuario,(True, (not bool(usuario["codigo_usuario"]==codigo_usuario)))))
            historias=cursor.fetchall()
    return jsonify(historias)

@historias_bp.route("/api/continuar_historia", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def continuar_historia():
    usuario_actual = obtener_usuario()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT borrador_historia, id_historia FROM "historias" WHERE codigo_usuario = %s AND publicada = FALSE""", (usuario_actual["codigo_usuario"],))
            historia=cursor.fetchall()
            print(historia)
    return jsonify(historia)
    
@historias_bp.route("/api/eliminar_borrador/<id_historia>", methods=["POST"])
@necesita("usuario", sesion_iniciada)
def eliminar_borrador(id_historia):
    usuario_actual = obtener_usuario()
    with conectar() as db:
        with db.cursor() as cursor:
            cursor.execute("""SELECT publicada FROM "historias" WHERE id_historia = %s AND codigo_usuario = %s""", (id_historia, usuario_actual["codigo_usuario"]))
            publicada=cursor.fetchone()
            if (publicada is None):
                return jsonify({"redirigir": "/inicio", "mensaje_redirigir":{"mensaje": "Historia no disponible", "tipo": "danger"}})
            if publicada[0]:
                cursor.execute("""UPDATE historias SET borrador_historia = NULL WHERE id_historia = %s AND codigo_usuario = %s""", (id_historia, usuario_actual["codigo_usuario"]))
                db.commit()
                return jsonify({"redirigir": "/perfil", "mensaje_redirigir": {"mensaje": "Borrador eliminado", "tipo": "success"}})
            else:
                cursor.execute("""DELETE FROM historias WHERE id_historia = %s AND codigo_usuario = %s""", (id_historia, usuario_actual["codigo_usuario"]))
    return jsonify({"mensaje": "Borrador eliminado", "tipo": "success"})
                


   