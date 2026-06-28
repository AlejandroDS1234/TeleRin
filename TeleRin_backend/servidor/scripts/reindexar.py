from servidor.services.servicios_historias import obtener_info_todas_historias
from servidor.services.servicios_busqueda import indexar
from servidor.services.servicios_texto import delta_texto
from servidor.services.servicios_sagas import obtener_info_todas_sagas
from servidor.services.servicios_usuarios import obtener_todos_usuarios

def reindexar_historias():
    historias = obtener_info_todas_historias()
    print("indexando")
    for historia in historias:
        historia["contenido_historia"] = delta_texto(historia["contenido_historia"])
        indexar("historias", historia["id_historia"] ,historia)
        
def reindexar_sagas():
    sagas = obtener_info_todas_sagas()
    print("indexando sagas")
    for saga in sagas:
        indexar("sagas",saga["id_saga"], saga)

def reindexar_usuarios():
    usuarios = obtener_todos_usuarios()
    print("indexando usuarios")
    for usuario in usuarios:
        indexar("usuarios", usuario["codigo_usuario"], usuario)

if __name__ == "__main__":    
    reindexar_historias()
    reindexar_sagas()    
    reindexar_usuarios()