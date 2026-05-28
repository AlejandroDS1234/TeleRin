import os
from PIL import Image
from io import BytesIO
import requests

def ruta_guardado(nombre_archivo, archivo_de_que, direccion, extension=".webp"):
    direccion_proyecto=os.getcwd()
    nombre_archivo=os.path.join(f"{nombre_archivo}{archivo_de_que}{extension}")
    ruta_completa=os.path.join(direccion_proyecto, direccion, nombre_archivo)
    return nombre_archivo, ruta_completa

def validar_imagen_completa(file, max_mb=5, min_w=300, min_h=300):
    # 1. Validar que sea imagen real
    try:
        img = Image.open(file)
        img.verify()
    except:
        return "El archivo no es una imagen válida", True
    file.seek(0)  # reset
    # 2. Validar peso
    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    if size > max_mb * 1024 * 1024:
        return f"La imagen pesa más de {max_mb} MB", True
    # 3. Validar dimensiones
    img = Image.open(file)
    w, h = img.size
    file.seek(0)
    if w < min_w or h < min_h:
        return f"La imagen debe ser mínimo {min_w}x{min_h} px", True
    return None, False   

def generar_imagen_reducida(imagen_file, ancho=150, alto=150):
    """Genera una versión pequeña y comprimida de la imagen"""
    img = Image.open(imagen_file)
    # Redimensiona manteniendo proporción
    img.thumbnail((ancho, alto), Image.Resampling.LANCZOS)
    # Convertir a RGB si es necesario (para guardar como JPEG)
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    return img

def guardar_imagen(imagen, ruta):
    # Abrimos la imagen
    img_pil = Image.open(imagen)
    img_pil.save(ruta, "WEBP", quality=85)
    imagen.seek(0) # Reiniciamos el stream original para generar la reducida
    reducida = generar_imagen_reducida(imagen, 150, 150)
    reducida.save(ruta.replace(".webp", "_reducida.webp"), "WEBP", quality=40)
    
def tratar_img_google(imagen, codigo_usuario):
    foto = requests.get(imagen)
    imagen = BytesIO(foto.content)
    mensaje, resultado = validar_imagen_completa(imagen)
    print(mensaje)
    if resultado:
        return False
    nombre_archivo, ruta=ruta_guardado(codigo_usuario, "_perfil", "Fotos/perfil")
    guardar_imagen(imagen, ruta)
    return nombre_archivo
    


    