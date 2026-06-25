from servidor.core.db import dato_en_db
from servidor.services.servicios_sesion import obtener_usuario
from servidor.services.servicios_texto import hay_caracteres_repetidos
from servidor.services.servicios_busqueda import actualizar_autor_indices

def verficar_nombre_usuario(data):
    if not data:
        return {"mensaje": "El nombre no puede estar vacio", "tipo": "warning"}
    usuario_actual = obtener_usuario()
    if not usuario_actual:
        return {"mensaje": "Necesitas usuario para acceder", "tipo": "warning"}
    if hay_caracteres_repetidos(data):
        return {"mensaje": "Nombre no valido", "tipo": "warning"}
    if len(data)>30 or len(data.split(" "))>4:
        return {"mensaje": "Nombre muy largo", "tipo": "warning"}
    actualizar_autor_indices(usuario_actual["codigo_usuario"], { "nombre_usuario": data }, "historias")
    actualizar_autor_indices(usuario_actual["codigo_usuario"], { "nombre_usuario": data }, "sagas")
    return {"mensaje": "Nombre actualizado", "tipo": "success"}

def verificar_descripcion_usuario(data):
    if not data:
        return {"mensaje": "La descripcion no puede estar vacia", "tipo": "warning"}
    if hay_caracteres_repetidos(data):
        return {"mensaje": "Descripcion no valida", "tipo": "warning"}
    if len(data)>500 or len(data.split(" "))>200:
        return {"mensaje": "Descripcion muy larga", "tipo": "warning"}
    return {"mensaje": "Descripcion actualizada", "tipo": "success"}

def verificar_pais_usuario(data):
    if not data:
        return {"mensaje": "El pais no puede estar vacio", "tipo": "warning"}
    en_db = dato_en_db(data, "id_pais", "paises")
    if not en_db:
        return {"mensaje": "Pais no registrado", "tipo": "warning"}
    return {"mensaje": "Pais actualizado", "tipo": "success"}

def verificar_genero_usuario(data):
    if not data:
        return {"mensaje": "El genero no puede estar vacio", "tipo": "warning"}
    en_db = dato_en_db(data, "id_genero", "generos")
    if not en_db:
        return {"mensaje": "Genero no registrado", "tipo": "warning"}
    return {"mensaje": "Genero actualizado", "tipo": "success"}