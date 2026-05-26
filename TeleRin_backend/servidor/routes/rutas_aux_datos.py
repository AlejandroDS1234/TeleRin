from flask import Blueprint, jsonify
from servidor.core.db import dato_en_db

aux_bp = Blueprint("aux", __name__)

@aux_bp.route("/api/paises", methods=["POST"])
def api_paises():
    paises=dato_en_db("1", "1", "paises")
    return jsonify(paises)

@aux_bp.route("/api/generos", methods=["POST"])
def api_generos():
    generos =dato_en_db("1", "1", "generos")
    return jsonify(generos)