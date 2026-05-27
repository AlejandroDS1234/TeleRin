from flask import Blueprint, request, send_from_directory, abort
from servidor.services.servicios_sesion import sesion_iniciada

archivos_bp = Blueprint("archivos", __name__)

@archivos_bp.route("/api/Fotos/perfil/<filename>")
def perfil_img(filename):
    if not sesion_iniciada():
        abort(403)
    # Obtener el parámetro "size" del URL
    size = request.args.get('size', 'full')  # default: 'full'
    
    if size == 'reducida':
        filename = filename.replace('.webp', '_reducida.webp')
    
    return send_from_directory("Fotos/perfil", filename)

@archivos_bp.route("/api/Fotos/fotos_sagas/<filename>")
def fotos_saga(filename):
    if not sesion_iniciada():
        abort(403)
    # Obtener el parámetro "size" del URL
    size = request.args.get('size', 'full')  # default: 'full'
    if size == 'reducida':
        filename = filename.replace('.webp', '_reducida.webp')
    return send_from_directory("Fotos/fotos_sagas", filename)