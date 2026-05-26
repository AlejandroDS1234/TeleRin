from .rutas_autenticacion import auth_bp
from .rutas_perfil import perfil_bp
from .rutas_historias import historias_bp
from .rutas_sagas import sagas_bp
from .rutas_paleta import paleta_bp
from .rutas_aux_datos import aux_bp
from .rutas_archivos import archivos_bp
from .rutas_pruebas import pruebas_bp

# Lista de todos los blueprints para facilitar el registro masivo
all_blueprints = [
    auth_bp,
    perfil_bp,
    historias_bp,
    sagas_bp,
    paleta_bp,
    aux_bp,
    archivos_bp,
    pruebas_bp
]