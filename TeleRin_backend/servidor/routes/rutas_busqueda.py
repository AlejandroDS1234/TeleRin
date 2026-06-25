from flask import Blueprint, request, jsonify
from servidor.services.servicios_busqueda import buscar_historias, busqueda_global

buscar_bp = Blueprint("buscar", __name__)

@buscar_bp.route("/api/buscar", methods=["POST"])
def buscar():
    form = request.get_json()
    palabra = form["busqueda"]
    resultados = busqueda_global(palabra)
    return jsonify(resultados)
    