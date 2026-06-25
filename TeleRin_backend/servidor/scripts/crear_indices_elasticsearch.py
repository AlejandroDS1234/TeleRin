from servidor.core.busqueda import obtener_elastic

elastic = obtener_elastic()

def crear_indices_historias():

    indice = "historias"

    if elastic.indices.exists(index=indice):
        elastic.indices.delete(index=indice)
        print("Índice historias ya existe")
        

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
                },
                
                "id_saga": {
                    "type": "keyword"
                },
                
                "nombre_saga": {
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
    
def crear_indices_sagas():
    indice = "sagas"
    
    if elastic.indices.exists(index=indice):
        elastic.indices.delete(index=indice)
        print("indice saga existe")
    
    
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

                "id_saga": {
                    "type": "keyword"
                },

                "nombre_saga": {
                    "type": "text",
                    "analyzer": "autocomplete",
                    "search_analyzer": "standard"
                },

                "descripcion_saga": {
                    "type": "text",
                    "analyzer": "autocomplete",
                    "search_analyzer": "standard"
                },

                "hashtags": {
                    "type": "text",
                    "analyzer": "autocomplete",
                    "search_analyzer": "standard"
                },
                
                "imagen_saga": {
                    "type": "keyword"
                },
                
                "codigo_usuario": {
                    "type": "keyword"  
                },

                "nombre_usuario": {
                    "type": "text",
                    "analyzer": "autocomplete",
                    "search_analyzer": "standard"
                },
                
                "vistas": {
                    "type": "integer"
                },

                "calificacion": {
                    "type": "integer"
                },
                
                "cantidad_historias": {
                    "type": "integer"
                }
            }
        } 
    }

    elastic.indices.create(
        index=indice,
        body=mapping
    )
    
    print("indice de sagas creado")
    
def crear_indices_usuarios():
    indice = "usuarios"
    
    if elastic.indices.exists(index=indice):
        elastic.indices.delete(index=indice)
        print("indice usuarios existe")
    
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

                "codigo_usuario": {
                    "type": "keyword"
                },

                "nombre_usuario": {
                    "type": "text",
                    "analyzer": "autocomplete",
                    "search_analyzer": "standard"
                },

                "descripcion_personal": {
                    "type": "text",
                    "analyzer": "autocomplete",
                    "search_analyzer": "standard"
                },
  
                "foto_perfil_usuario": {
                    "type": "keyword"
                },
     
                "seguidores": {
                    "type": "integer"
                },
                
                "cantidad_historias": {
                    "type": "integer"
                }
            }
        } 
    }

if __name__ == "__main__":
    crear_indices_historias()
    crear_indices_sagas()
    