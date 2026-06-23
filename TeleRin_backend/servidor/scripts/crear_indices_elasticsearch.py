from servidor.core.busqueda import obtener_elastic

elastic = obtener_elastic()

def crear_indices_historias():

    indice = "historias"

    if elastic.indices.exists(index=indice):
        elastic.indices.delete(index=indice)
        print("Índice ya existe")
        

    mapping = {
        "settings": {
            "analysis": {
                "filter": {
                    "autocomplete_filter": {
                        "type": "edge_ngram",
                        "min_gram": 1,
                        "max_gram": 20
                    }
                },
                "analyzer": {
                    "autocomplete": {
                        "type": "custom",
                        "tokenizer": "standard",
                        "filter": [
                            "lowercase",
                            "autocomplete_filter"
                        ]
                    }
                }
            }
        },
        "mappings": {
            "properties": {

                "id_historia": {
                    "type": "keyword"
                },

                "nombre_historia": {
                    "type": "text",
                    "analyzer": "autocomplete",
                    "search_analyzer": "standard"
                },

                "descripcion_historia": {
                    "type": "text",
                    "analyzer": "autocomplete",
                    "search_analyzer": "standard"
                },

                "hashtags": {
                    "type": "text",
                    "analyzer": "autocomplete",
                    "search_analyzer": "standard"
                },

                "nombre_usuario": {
                    "type": "text",
                    "analyzer": "autocomplete",
                    "search_analyzer": "standard"
                },
                
                "codigo_usuario": {
                    "type": "keyword"  
                },
                
                "foto_perfil_usuario": {
                    "type": "keyword"
                },

                "vistas": {
                    "type": "integer"
                },

                "calificacion": {
                    "type": "integer"
                },
                
                "visibilidad_historia": {
                    "type": "boolean"
                },
                
                "contenido_historia": {
                    "type": "text"
                }
            }
        }
    }

    elastic.indices.create(
        index=indice,
        body=mapping
    )

    print("Índice creado correctamente")

if __name__ == "__main__":
    crear_indices_historias()
    