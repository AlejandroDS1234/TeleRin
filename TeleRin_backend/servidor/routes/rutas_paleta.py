from flask import Blueprint, request, jsonify, redirect
import random
import psycopg2.extras
from servidor.core.db import conectar, dato_en_db, insertar_db, actualizar_datos
from servidor.services.servicios_sesion import obtener_usuario
from servidor.services.servicios_texto import validar_hex, es_color_claro

paleta_bp = Blueprint("paleta", __name__)

def paleta_en_base(paleta: dict, codigo_usuario: str):
    paleta = dato_en_db(None, {"color1": paleta["color1"], "color2": paleta["color2"], "color3": paleta["color3"], "codigo_usuario": codigo_usuario}, "paletas")
    if not paleta:
        return False
    return paleta[0]["id_paleta"]

@paleta_bp.route("/guardar_paleta_personalizada", methods=["POST"])
def guardar_paleta_personalizada():
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
    form = request.get_json()
    color1 = form["color1original"]["value"]
    color2 = form["color2original"]["value"]
    color3 = form["color3original"]["value"]
    color_texto = "#000000"
    color_texto_fondo = "#000000"
    if not validar_hex(color1) or not validar_hex(color2) or not validar_hex(color3):
        return jsonify({"mensaje": "Paleta no valida", "tipo": "danger"})
    if not es_color_claro(color1):
        color_texto = "#FFFFFF"
    if not es_color_claro(color2):
        color_texto_fondo = "#FFFFFF"
    id_paleta = paleta_en_base({"color1": color1, "color2": color2, "color3": color3}, usuario_actual["codigo_usuario"])
    if not id_paleta:
        id_paleta = random.randint(100000,999999)
        insertar_db("paletas", {"color1": color1, "color2": color2, "color3": color3, "color_letra": color_texto, "color_letra_fondo": color_texto_fondo,"id_paleta": id_paleta, "codigo_usuario": usuario_actual["codigo_usuario"]})
    actualizar_datos("USUARIOS", {"id_paleta": id_paleta}, {"codigo_usuario": usuario_actual["codigo_usuario"]})
    return redirect(request.referrer)
    
@paleta_bp.route("/guardar_paleta", methods=["POST"])
def guardar_paleta():
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
    form = request.get_json()
    id_paleta = form["id_paleta"]
    id_paletas = dato_en_db(id_paleta, "id_paleta", "paletas")
    if not id_paletas:
        return jsonify({"mensaje": "Paleta no valida", "tipo": "danger"})
    actualizar_datos("USUARIOS", {"id_paleta": id_paleta}, {"codigo_usuario": usuario_actual["codigo_usuario"]})
    return redirect(request.referrer)

@paleta_bp.route("/paletas", methods=["POST"])
def paletas():
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT * FROM paletas WHERE codigo_usuario = %s OR codigo_usuario IS NULL', (usuario_actual["codigo_usuario"],))
            paletas=cursor.fetchall()
    return jsonify(paletas)

@paleta_bp.route("/paleta_usuario", methods=["POST"])
def paleta_usuario():
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return jsonify({"mensaje": "Necesitas usuario para acceder", "tipo": "warning"})
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT p.color1, p.color2, p.color3, p.color_letra, p.color_letra_fondo FROM paletas p WHERE p.id_paleta = %s', (usuario_actual["id_paleta"],))
            paleta=cursor.fetchone()
    return jsonify(paleta)