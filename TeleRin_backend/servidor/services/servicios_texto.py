import itertools
import re
from werkzeug.security import generate_password_hash
from email_validator import validate_email, EmailNotValidError
from langdetect import detect

def hay_caracteres_repetidos(texto: str, maximo: int = 5) -> bool:
    for caracter, grupo in itertools.groupby(texto):
        if sum(1 for _ in grupo) > maximo:
            return True
    return False

def encriptar(dato: str | int) -> str:
    return generate_password_hash(str(dato))

def validar_email(correo: str) -> str | bool:
    try:
        validacion=validate_email(correo)
        return validacion.email
    except EmailNotValidError:
        return False
    
def comprobar_contraseña(contraseña: str) -> bool:
    if len(contraseña) < 8:
        return False
    cantidad_Numeros = filter(str.isdigit, contraseña)
    if len(list(cantidad_Numeros)) < 2:
        return False
    cantidad_Mayusculas = filter(str.isupper, contraseña)
    if len(list(cantidad_Mayusculas)) < 3:
        return False
    cantidad_Minusculas = filter(str.islower, contraseña)
    if len(list(cantidad_Minusculas)) < 3:
        return False
    return True  

def obtener_hashtags(texto: str):
    texto = texto.lower()
    hashtags = re.findall(r"#\w+", texto)
    hashtagsLista = []
    for hashtag in hashtags:
        hash = hashtag[1:]
        if hash not in hashtagsLista:
            hashtagsLista.append(hash)
    return hashtagsLista

def validar_hex(color: str):
    return bool(re.fullmatch(r"#([0-9a-fA-F]{6})", color))

def hex_a_rgb(color: str):
    color = color.lstrip("#")
    return tuple(int(color[i:i+2], 16) for i in (0, 2, 4))

def es_color_claro(color: str):
    r, g, b = hex_a_rgb(color)
    luminancia = (0.299*r + 0.587*g + 0.114*b)
    return luminancia > 186  # claro

idiomas_soportados = {
        'ar': 'arabic',
        'az': 'azerbaijani',
        'eu': 'basque',
        'bn': 'bengali',
        'ca': 'catalan',
        'zh': 'chinese',
        'da': 'danish',
        'nl': 'dutch',
        'en': 'english',
        'fi': 'finnish',
        'fr': 'french',
        'de': 'german',
        'el': 'greek',
        'he': 'hebrew',
        'hi': 'hindi',
        'hu': 'hungarian',
        'id': 'indonesian',
        'it': 'italian',
        'kk': 'kazakh',
        'ne': 'nepali',
        'no': 'norwegian',
        'pt': 'portuguese',
        'ro': 'romanian',
        'ru': 'russian',
        'sl': 'slovene',
        'es': 'spanish',
        'sv': 'swedish',
        'tg': 'tajik',
        'tr': 'turkish'
    }

def detectar_idioma(texto):
    try:
        idioma = detect(texto)
    except:
        idioma = "es"
    return idiomas_soportados.get(idioma, 'spanish')

def delta_texto(delta):
    texto_final = []
    # Iterar sobre cada operación en el diccionario 'ops'
    for operacion in delta.get("ops", []):
        # Asegurarse de que la operación sea de inserción y contenga texto
        if "insert" in operacion and isinstance(operacion["insert"], str):
            texto_final.append(operacion["insert"])
            
    # Unir todos los fragmentos de texto en una sola cadena
    return "".join(texto_final)