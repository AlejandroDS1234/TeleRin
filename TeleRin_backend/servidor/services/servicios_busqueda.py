from servidor.core.busqueda import obtener_elastic

es = obtener_elastic()

def indexar_historia(historia):
    es.index(
        index="historias",
        id = historia["id_historia"],
        document = historia
    )
    
def actualizar_documento_historia(id_historia, cambios):
    es.update(
        index="historias",
        id=id_historia,
        doc=cambios
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
                            "nombre_historia^4",
                            "descripcion_historia^2",
                            "nombre_usuario^3",
                            "hashtags^5",
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
