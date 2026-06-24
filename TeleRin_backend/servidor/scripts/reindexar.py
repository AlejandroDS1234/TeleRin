from servidor.services.servicios_historias import obtener_info_todas_historias
from servidor.services.servicios_busqueda import indexar_historia
from servidor.services.servicios_texto import delta_texto

def reindexar_historias():
    historias = obtener_info_todas_historias()
    print("indexando")
    for historia in historias:
        historia["contenido_historia"] = delta_texto(historia["contenido_historia"])
        indexar_historia(historia)
        
        
if __name__ == "__main__":    
    reindexar_historias()