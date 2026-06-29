from servidor.core.busqueda import obtener_elastic
from servidor.services.servicios_usuarios import siguiendo_usuario

es = obtener_elastic()

def indexar(indice, id, datos):
    es.index(
        index=indice,
        id=id,
        document=datos
    )

def actualizar_documento(indice, id, cambios):
    es.update(
        index=indice,
        id=id,
        doc=cambios
    )
    
def actualizar_autor_indices(codigo_usuario, cambios, indice):
    es.update_by_query(
        index=indice,
        query={
            "term": {
                "codigo_usuario": codigo_usuario
            }
        },
        script={
            "source": """
                for (entry in params.campos.entrySet()) {
                    ctx._source[entry.getKey()] = entry.getValue();
                }
            """,
            "params": {
                "campos": cambios
            }
        }
    )
      
def _buscar(indice, consulta, limite=20):
    return es.search(
        index=indice,
        query=consulta,
        size=limite
    )

def buscar_historias(texto, visiblilidad = True):
    consulta = {
        "bool": {
            "should": [
                {
                    "multi_match": {
                        "query": texto,
                        "type": "bool_prefix",
                        "fields": [
                            "nombre_historia^10",
                            "hashtags^8",
                            "nombre_usuario^6",
                            "nombre_saga^5",
                            "descripcion_historia^3",
                            "contenido_historia"
                        ]
                    }
                }
            ],
            "minimum_should_match": 1,
            "filter": [
                {
                    "term": {
                        "visibilidad_historia": visiblilidad
                    }
                }
            ]
        }
    }

    respuesta = _buscar("historias", consulta)
    return [hit["_source"] for hit in respuesta["hits"]["hits"]]

def buscar_sagas(texto):
    consulta = {
        "multi_match": {
            "query": texto,
            "type": "bool_prefix",
            "fields": [
                "nombre_saga^4",
                "descripcion_saga^2",
                "nombre_usuario^3",
                "hashtags^5",
            ]
        }
    }
    
    respuesta = _buscar("sagas", consulta)
    return [hit["_source"] for hit in respuesta["hits"]["hits"]]

def buscar_usuarios(texto):
    consulta = {
        "multi_match": {
            "query": texto,
            "type": "bool_prefix",
            "fields": [
                "nombre_usuario^4",
                "descripcion_personal^2"
            ]
        }
    }
    respuesta = _buscar("usuarios", consulta)
    usuarios = [hit["_source"] for hit in respuesta["hits"]["hits"]]
    for usuario in usuarios:
        usuario["siguiendo"] = siguiendo_usuario(usuario["codigo_usuario"])["siguiendo"]    
    return usuarios

def busqueda_global(texto):
    return {
        "historias": buscar_historias(texto),
        "sagas": buscar_sagas(texto),
        "usuarios": buscar_usuarios(texto)
    }


