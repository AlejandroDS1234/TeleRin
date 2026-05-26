from functools import wraps
from flask import jsonify

funciones={}
def registrar_funcion(nombre):
    def decorador(func):
        funciones[nombre]=func
        return func
    return decorador

def necesita(nombre: str, validacion: bool, redireccion: str = "/"):
    def decorador(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not validacion():    
                return jsonify({"redirigir": redireccion, "mensaje_redirigir": {"mensaje": f"Necesitas {nombre} para acceder", "tipo": "warning"} })
            return func(*args, **kwargs)
        return wrapper
    return decorador