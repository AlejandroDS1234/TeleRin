from flask import Blueprint

listas_lectura_bp = Blueprint("listas_lectura", __name__)

@listas_lectura_bp.route("/api/crear_lista_lectura", methods=["POST"])
def crear_lista_lectura():
    pass