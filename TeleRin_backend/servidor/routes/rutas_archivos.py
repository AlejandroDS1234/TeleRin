from flask import Blueprint, request, send_from_directory, abort
import os

archivos_bp = Blueprint("archivos", __name__)

@archivos_bp.route("/api/Fotos/perfil/<filename>")
def perfil_img(filename):
    size = request.args.get('size', 'full')  # default: 'full'
    if size == 'reducida':
        filename = filename.replace('.webp', '_reducida.webp')
    return send_from_directory("Fotos/perfil", filename)

@archivos_bp.route("/api/Fotos/fotos_sagas/<filename>")
def fotos_saga(filename):
    tamaños = {'full': '', 'reducida': '_reducida', 'card': '_card'}
    size = request.args.get('size', 'full')  # default: 'full'
    if size in tamaños:
        filename = filename.replace('.webp', tamaños[size] + '.webp')
    return send_from_directory("Fotos/fotos_sagas", filename)