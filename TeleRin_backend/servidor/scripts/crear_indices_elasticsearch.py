from servidor.core.busqueda import obtener_elastic

elastic = obtener_elastic()

CONFIG_AUTOCOMPLETE = {
    "index": {
        "max_ngram_diff": 7
    },
    "analysis": {
        "filter": {
            "autocomplete_filter": {
                "type": "edge_ngram",
                "min_gram": 1,
                "max_gram": 20
            },

            "contains_filter": {
                "type": "ngram",
                "min_gram": 3,
                "max_gram": 10
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
            },

            "contains": {
                "type": "custom",
                "tokenizer": "standard",
                "filter": [
                    "lowercase",
                    "contains_filter"
                ]
            }
        }
    }
}

def crear_indices_historias():

    indice = "historias"

    if elastic.indices.exists(index=indice):
        elastic.indices.delete(index=indice)
        print("Índice historias ya existe")
        

    mapping = {
        "settings": CONFIG_AUTOCOMPLETE,
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
                    "type": "text",
                    "analyzer": "autocomplete",
                    "search_analyzer": "standard"
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
        "settings": CONFIG_AUTOCOMPLETE,
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
                    "type": "text"
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
        "settings": CONFIG_AUTOCOMPLETE,
        "mappings": {
            "properties": {

                "codigo_usuario": {
                    "type": "keyword"
                },

                "nombre_usuario": {
                    "type": "text",
                    "analyzer": "contains",
                    "search_analyzer": "standard"
                },

                "descripcion_personal": {
                    "type": "text",
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
    
    elastic.indices.create(
        index=indice,
        body=mapping
    )
    
    print("indice de usuarios creado")
    
    
    
if __name__ == "__main__":
    crear_indices_historias()
    crear_indices_sagas()
    crear_indices_usuarios()
    