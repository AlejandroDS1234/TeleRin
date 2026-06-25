from servidor.services.servicios_historias import obtener_info_todas_historias
from servidor.services.servicios_busqueda import indexar_historia, indexar_saga
from servidor.services.servicios_texto import delta_texto
from servidor.services.servicios_sagas import obtener_info_todas_sagas

def reindexar_historias():
    historias = obtener_info_todas_historias()
    print("indexando")
    for historia in historias:
        historia["contenido_historia"] = delta_texto(historia["contenido_historia"])
        indexar_historia(historia)
        
def reindexar_sagas():
    sagas = obtener_info_todas_sagas()
    print("indexando sagas")
    for saga in sagas:
        indexar_saga(saga)
        
        
if __name__ == "__main__":    
    reindexar_historias()
    reindexar_sagas()