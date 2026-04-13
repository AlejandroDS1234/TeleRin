from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify, abort, send_from_directory
from werkzeug.exceptions import HTTPException
import psycopg2 as ps
from email_validator import validate_email, EmailNotValidError
from itsdangerous import URLSafeTimedSerializer
import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart 
import psycopg2.extras
from psycopg2.extras import Json
from werkzeug.security import generate_password_hash, check_password_hash
import os
import socket
from PIL import Image
from functools import wraps
import datetime 
import re
from flask_cors import CORS
from langdetect import detect

app=Flask(__name__)
app.secret_key = "GcWqCD7N4gueHr6LakfWrNNkKIQUYKYy"
CORS(app, supports_credentials=True, origins=[
        r"http://localhost:4210",
        r"http://127\.0\.0\.1:4210",
        r"http://192\.168\.\d{1,3}\.\d{1,3}:4210",
        r"http://10\.\d{1,3}\.\d{1,3}\.\d{1,3}:4210",
        r"http://172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}:4210"
]) 

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

#decoradores
funciones={}
def registrar_funcion(nombre):
    def decorador(func):
        funciones[nombre]=func
        return func
    return decorador

def necesita(nombre, validacion, redireccion: str = "/"):
    def decorador(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not validacion():    
                return jsonify({"redirigir": redireccion, "mensaje_redirigir": {"mensaje": f"Necesitas {nombre} para acceder", "tipo": "warning"} })
            return func(*args, **kwargs)
        return wrapper
    return decorador

#funciones reutilizables
def conectar():
    try:
        db = ps.connect(
            host="db",
            port="5432",
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            database=os.getenv("POSTGRES_DB")
        )
        if db is None:
            flash("Error interno, vuelva mas tarde", "danger")
            return redirect(url_for("index"))
        return db
    except:
        print("Error al conectar")

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
    
def guardar_temporalmente_datos(datos: dict):
    session["datos_temporales"]=datos
            
def guardar_funcion_proveniente(nombre_funcion: str):
    session["funcion_proveniente"]=nombre_funcion
    
def ruta_guardado(nombre_archivo, archivo_de_que, direccion, extension=".jpg"):
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
 
def paleta_en_base(paleta: dict, codigo_usuario: str):
    paleta = dato_en_db(None, {"color1": paleta["color1"], "color2": paleta["color2"], "color3": paleta["color3"], "codigo_usuario": codigo_usuario}, "paletas")
    if not paleta:
        return False
    return paleta[0]["id_paleta"]

#funciones del sistema
def actualizar_sesion(correo: str):
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT * FROM public."USUARIOS" WHERE correo_usuario = %s', (correo,))
            usuario=cursor.fetchone()
            datos_indefinidos(usuario)
            cursor.execute('SELECT * FROM public."USUARIOS" WHERE correo_usuario = %s', (correo,))
            usuario=cursor.fetchone()
            session["usuario"]=usuario

@app.route("/api/sesion", methods=["POST"])
def sesion():
    datos_indefinidos(session["usuario"])
    return jsonify({"usuario": session.get("usuario")})

def guardar_ip(correo: str):
    dispositivo=obtener_ip()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT ip_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
            ip=cursor.fetchone()
            if ip["ip_usuario"] == None or check_password_hash(ip["ip_usuario"], dispositivo)==False:
                dispositivo=encriptar(dispositivo)
                actualizar_datos("USUARIOS", {"ip_usuario": dispositivo}, {"correo_usuario": correo})
    return actualizar_sesion(correo)

def datos_indefinidos(usuario: dict):
    if usuario["foto_perfil_usuario"] == None:
        ruta_guardado="predefinido.jpg"
        actualizar_datos("USUARIOS", {"foto_perfil_usuario": ruta_guardado}, {"correo_usuario": usuario["correo_usuario"]})
    generos=dato_en_db(1, "1", "generos")
    id_genero=[genero["id_genero"] for genero in generos]
    if usuario["id_genero"] == None or usuario["id_genero"] not in id_genero:
        id_genero=0
        actualizar_datos("USUARIOS", {"id_genero": id_genero}, {"correo_usuario": usuario["correo_usuario"]})
    paises=dato_en_db(1, "1", "paises")
    id_pais=[pais["id_pais"] for pais in paises]
    if usuario["id_pais"] == None or usuario["id_pais"] not in id_pais:
        id_pais=0
        actualizar_datos("USUARIOS", {"id_pais": id_pais}, {"correo_usuario": usuario["correo_usuario"]})
    if usuario["id_paleta"] == None:
        actualizar_datos("USUARIOS", {"id_paleta": "1"}, {"correo_usuario": usuario["correo_usuario"]})
    if usuario["idioma_usuario"] == None:
        idioma = request.accept_languages.best_match(idiomas_soportados.keys())
        idioma_usuario = idiomas_soportados.get(idioma, "es")
        actualizar_datos("USUARIOS", {"idioma_usuario": idioma_usuario}, {"correo_usuario": usuario["correo_usuario"]})
   
def enviar_correo_validacion(correo):
    emisor="telerincontac@gmail.com"
    verficacion="emej vpkm srqe rkzn"
    server="smtp.gmail.com"
    port=587
    codigo=random.randint(100000,999999)
    codigodb=f"{correo}{codigo}"
    mensaje=MIMEMultipart()
    mensaje["From"]=emisor
    mensaje["To"]=correo
    mensaje["Subject"]=f"Codigo de verificacion TeleRin: {codigo}"
    cuerpo=f""" <!DOCTYPE html>
                <html lang="en">
                <body>
                <h1>Codigo De Verificacion</h1>
                <p>Tu codigo de verificacion es: {codigo}</p>
                </body>
                </html> """
    mensaje.attach(MIMEText(cuerpo, "html"))
    try:
        with smtplib.SMTP(server, port) as smtp:
            smtp.starttls()
            smtp.login(emisor, verficacion)
            smtp.send_message(mensaje)
            return codigodb
    except Exception as e:
        return False
   
def enviar_correo(correo):
    codigo= enviar_correo_validacion(correo)
    if codigo==False:
        return jsonify({"mensaje":"Error al enviar el correo de validacion", "tipo":"danger"})
    session["codigo_validacion"]=encriptar(codigo)
    return jsonify({"redirigir": "/codigo_verificacion", "mensaje_redirigir": {"mensaje": "Codigo enviado", "tipo": "success"}})

def dato_en_db(dato: str | None, nombre_dato: str | dict, tabla: str = "USUARIOS") -> dict | None:
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            comando=f"""SELECT * FROM "{tabla}" WHERE """
            datos=[]
            if isinstance(nombre_dato, dict):
                condicion=""
                for clave in nombre_dato.keys():
                    condicion+=f"{clave} = %s AND "
                    datos.append(nombre_dato[clave])
                condicion=condicion[:-5]
                comando+=condicion
            else:
                comando+=f"{nombre_dato} = %s"
                datos.append(dato)
            cursor.execute(comando, tuple(datos))
            resultado=cursor.fetchall()
            return resultado

def insertar_db(tabla: str, datos: dict):
    with conectar() as db:
        with db.cursor() as cursor:
            comando=f"""INSERT INTO "{tabla}" ("""
            datos_insertar=[]
            datos_str=""
            valores=""") VALUES ("""
            for clave in datos.keys():
                datos_str+=f"{clave}, "
                datos_insertar.append(datos[clave])
                valores+="%s, "
            datos_str=datos_str[0:-2]
            valores=valores[0:-2]
            valores+=")"
            comando+=datos_str
            comando+=valores
            cursor.execute(comando, tuple(datos_insertar))
            db.commit()

def actualizar_datos(tabla: str, datos: dict, condicion: dict):
    with conectar() as db:
        with db.cursor() as cursor:
            comando=f"""UPDATE "{tabla}" SET """
            datos_actualizar=[]
            datos_str=""
            for clave in datos.keys():
                datos_str+=f"{clave} = %s, "
                datos_actualizar.append(datos[clave])
            datos_str=datos_str[0:-2]
            comando+=datos_str
            comando+=" WHERE "
            datos_str=""
            for clave in condicion.keys():
                datos_str+=f"{clave} = %s AND "
                datos_actualizar.append(condicion[clave])
            datos_str=datos_str[:-5]
            comando+=datos_str
            cursor.execute(comando, tuple(datos_actualizar))
            db.commit()

def obtener_ip():
    ip_local = socket.gethostbyname(socket.gethostname())
    user_agent = request.headers.get("User-Agent", "")
    lenguaje=request.headers.get("Accept-Lenguage", "")
    encoding=request.headers.get("Accept-Encoding", "")
    dispositivo=f"{ip_local}--{user_agent}--{lenguaje}--{encoding}"
    return dispositivo

def verificar_ip(correo: str):
    dispositivo=obtener_ip()
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT ip_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
            ip=cursor.fetchone()
            if check_password_hash(ip["ip_usuario"], dispositivo):
                return True
    return False

def guardar_historial(id_historia: str):
    codigo_usuario=session["usuario"]["codigo_usuario"]
    tiempo=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    if dato_en_db(None, {"codigo_usuario": codigo_usuario, "id_historia": id_historia}, "historial"):
        actualizar_datos("historial", {"tiempo_vista": tiempo}, {"codigo_usuario": codigo_usuario, "id_historia": id_historia})
        return
    insertar_db("historial", {"codigo_usuario": codigo_usuario, "tiempo_vista": tiempo, "id_historia": id_historia})

@app.route("/historial_usuario", methods=["POST"])
def historial_usuario():
    codigo_usuario=session["usuario"]["codigo_usuario"]
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT h.nombre_historia, h.id_historia, h.fecha_actualizacion, h.descripcion_historia FROM "historias" h JOIN "historial" hl ON h.id_historia = hl.id_historia WHERE hl.codigo_usuario = %s ORDER BY hl.tiempo_vista DESC""", (codigo_usuario,))
            historias=cursor.fetchall()
    return jsonify(historias)

def hashtag_db(texto: str, id: str, tabla_campo: str):
    hashtags=obtener_hashtags(texto)
    if len(hashtags)<1:
        return False
    for hashtag in hashtags:
        if not dato_en_db(hashtag, "nombre_hashtag", "hashtags"):
            insertar_db("hashtags", {"nombre_hashtag": hashtag})
        index_hashtag=dato_en_db(hashtag, "nombre_hashtag", "hashtags")[0]["id_hashtag"]
        insertar_db(tabla_campo["tabla"], {tabla_campo["campo"]: id, "id_hashtag": index_hashtag})
    return True

#funciones en el diccionario
@registrar_funcion("registro")
def registro(form: dict):
    nombre_us=form["nombre_usuario"]
    correo_us=form["correo_usuario"]
    contraseña_us=form["contraseña_usuario"]
    codigo_us_numero=random.randint(100000,999999)
    codigo_us=f"{codigo_us_numero}{correo_us[0:5]}"
    contraseña_encriptada=encriptar(f"{correo_us}{contraseña_us}")
    insertar_db("USUARIOS",{"nombre_usuario": nombre_us, "correo_usuario": correo_us, "contraseña_usuario": contraseña_encriptada, "codigo_usuario": codigo_us})
    guardar_ip(correo_us)
    actualizar_sesion(correo_us)
    return jsonify({"redirigir": "/inicio", "mensaje_redirigir": {"mensaje": "Registrado exitosamente", "tipo": "success"}})
        
@registrar_funcion("iniciar_sesion_dispositivo_nuevo")
def iniciar_sesion_dispositivo_nuevo(dato: dict | str):
    correo = dato["correo_usuario"] if isinstance(dato, dict) else dato
    guardar_ip(correo)
    actualizar_sesion(correo)
    return jsonify({"redirigir": "/inicio", "mensaje_redirigir": {"mensaje": "Inicio de sesión exitoso", "tipo": "success"}})

@registrar_funcion("cambiar_contraseña_comprobador")
def cambiar_contraseña_comprobador(_=None):
    session["cambiar_contraseña_usuario"]=True
    return jsonify({"redirigir": "/cambiar_contraseña", "mensaje_redirigir": {"mensaje": "Cambia tu contraseña", "tipo": "success"}})

#rutas
@app.route("/api/registrarse", methods=["POST", "GET"])
def registrarse():
    if request.method=="POST":
        form = request.get_json()
        nombre_us=form["nombre_usuario"]
        correo_us=form["correo_usuario"]
        contraseña_us=form["contraseña_usuario"]
        email=validar_email(correo_us)
        if not email:
            return jsonify({"mensaje":"Correo no valido", "tipo":"danger"})
        if dato_en_db(email, 'correo_usuario'):
            return jsonify({"mensaje":"Correo ya registrado", "tipo":"warning"})
        if dato_en_db(nombre_us, 'nombre_usuario'):
            return jsonify({"mensaje":"Nombre de usuario ya registrado", "tipo":"warning"})
        if not comprobar_contraseña(contraseña_us):
            return jsonify({"mensaje":"Ponga una contraseña mas segura (8 caracteres, 3 mayusculas, 3 minusculas, 2 numeros)", "tipo":"danger"})
        guardar_temporalmente_datos(form)
        guardar_funcion_proveniente("registro")
        return enviar_correo(correo_us)
    return "MMMMMMMMMMM sospechoso"

@app.route("/api/ingresar_codigo_validacion", methods=["GET"])
@necesita("codigo de validacion", lambda: session.get("codigo_validacion")!=None)
def ingresar_codigo_validacion():
    return jsonify({"status": True}) 

@app.route("/api/validar_codigo", methods=["POST"])
@necesita("codigo", lambda: session.get("codigo_validacion")!=None)
def validar_codigo():
    if request.method!="POST":
        abort(405)  
    codigo=request.get_json().get("codigo")
    if check_password_hash(session["codigo_validacion"], f"{session['datos_temporales']['correo_usuario']}{codigo}"):
        session.pop("codigo_validacion")
        return funciones[session["funcion_proveniente"]](session["datos_temporales"])
    return jsonify({"mensaje":"Codigo de validacion incorrecto", "tipo":"danger"})

@app.route("/cerrar_sesion", methods=["GET", "POST"])
def cerrar_sesion():
    session.clear()
    return redirect(url_for("index"))

@app.route("/inicio")
@necesita("usuario", lambda: session.get("usuario")!=None)
def  inicio():
    actualizar_sesion(session["usuario"]["correo_usuario"])
    return jsonify({"mensaje": "Bienvenido al inicio", "tipo": "success"})
   
@app.route("/api/Fotos/perfil/<filename>")
def perfil_img(filename):
    if "usuario" not in session:
        abort(403)
    return send_from_directory("Fotos/perfil", filename)

@app.route("/api/Fotos/fotos_sagas/<filename>")
def fotos_saga(filename):
    if "usuario" not in session:
        abort(403)
    return send_from_directory("Fotos/fotos_sagas", filename)

@app.route("/api/iniciar_sesion", methods=["GET", "POST"])
def iniciar_sesion():
    if request.method=="POST":
        form = request.get_json()
        correo=form["correo_usuario"]
        contraseña=form["contraseña_usuario"]
        contraseña_encriptada=f"{correo}{contraseña}"
        with conectar() as db:
            with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
                usuario=dato_en_db(correo, "correo_usuario")
                if not usuario:
                    return jsonify({"mensaje":"Correo no registrado", "tipo":"warning"})
                if not check_password_hash(usuario[0]["contraseña_usuario"], contraseña_encriptada):
                    return jsonify({"mensaje":"Contraseña incorrecta", "tipo":"danger"})
                if not verificar_ip(correo):
                    guardar_temporalmente_datos({"correo_usuario": correo})
                    guardar_funcion_proveniente("iniciar_sesion_dispositivo_nuevo")
                    return enviar_correo(correo)
                return iniciar_sesion_dispositivo_nuevo(correo)
    return "Que intentas? 😏"

@app.route("/api/codigo_verificacion_cambiar_contrasena", methods=["GET", "POST"])
def codigo_verificacion_cambiar_contraseña():
    if request.method=="POST":
        form = request.get_json()
        correo=form["correo_para_codigo_usuario"]
        email=validar_email(correo)
        if not email:
            return jsonify({"mensaje":"Correo no valido", "tipo":"danger"})
        usuario=dato_en_db(email, "correo_usuario")
        if not usuario:
            return jsonify({"mensaje":"Correo no registrado", "tipo":"warning"})
        guardar_temporalmente_datos({"correo_usuario": correo})
        guardar_funcion_proveniente("cambiar_contraseña_comprobador")
        return enviar_correo(correo)
    return "No se que poner 😝"

@app.route("/api/cambiar_contraseña", methods=["GET", "POST"])
@necesita("verificar tu usuario", lambda: session.get("cambiar_contraseña_usuario"))
def cambiar_contraseña():
    if request.method=="POST":
        form = request.get_json()
        correo=session["datos_temporales"]["correo_usuario"]
        contraseña_nueva=form["contraseña_usuario_nueva"]
        contraseña_nueva_confirmacion=form["contraseña_usuario_nueva_confirmacion"]
        if contraseña_nueva != contraseña_nueva_confirmacion:
            return jsonify({"mensaje":"Las contraseñas nuevas no coinciden", "tipo":"danger"})
        if not comprobar_contraseña(contraseña_nueva):
            return jsonify({"mensaje":"Ponga una contraseña mas segura (8 caracteres, 3 mayusculas, 3 minusculas, 2 numeros)", "tipo":"danger"})
        contraseña_nueva_encriptada=encriptar(f"{correo}{contraseña_nueva}")
        actualizar_datos("USUARIOS", {"contraseña_usuario": contraseña_nueva_encriptada}, {"correo_usuario": correo})
        session.pop("cambiar_contraseña_usuario")
        return jsonify({"redirigir": "/iniciar_sesion", "mensaje_redirigir": {"mensaje": "Contraseña cambiada exitosamente, inicia sesión de nuevo", "tipo": "success"}})
    return jsonify({"mmm": "No te creo 😑"})

@app.route("/api/paises", methods=["POST"])
def api_paises():
    datos_indefinidos(session["usuario"])
    actualizar_sesion(session["usuario"]["correo_usuario"])
    paises=dato_en_db("1", "1", "paises")
    return jsonify(paises)

@app.route("/api/generos", methods=["POST"])
def api_generos():
    datos_indefinidos(session["usuario"])
    actualizar_sesion(session["usuario"]["correo_usuario"])
    generos =dato_en_db("1", "1", "generos")
    return jsonify(generos)
    
    

@app.route("/api/perfil", methods=["POST", "GET"])
def perfil():
    if request.method=="POST":
        form = request.get_json()
        if form.get("nombre_usuario", False) and dato_en_db(form["nombre_usuario"], 'nombre_usuario') and form.get("nombre_usuario", False) != session["usuario"]["nombre_usuario"]:
            return jsonify({"mensaje":"Nombre de usuario ya registrado", "tipo":"warning"})
        if form.get("id_pais", False) and not dato_en_db(form["id_pais"], "id_pais", "paises"):
            return jsonify({"mensaje":"Pais no registrado", "tipo":"warning"})
        if form.get("id_genero", False) and not dato_en_db(form["id_genero"], "id_genero", "generos"):
            return jsonify({"mensaje":"Genero no registrado", "tipo":"warning"})
        datos_indefinidos(session["usuario"])
        actualizar_datos("USUARIOS", form, {"codigo_usuario": session["usuario"]["codigo_usuario"]})
        actualizar_sesion(session["usuario"]["correo_usuario"])
        return jsonify({"mensaje":f"{list(form.keys())[0][:-8].replace('_', '')} actualizado", "tipo":"success"})
    return jsonify({"mm": "Investigando? :)"})
        
@app.route("/api/guardar_foto_perfil", methods=["POST"])
@necesita("usuario", lambda: session.get("usuario")!=None)
def guardar_foto_perfil():
    if request.method=="POST":
        print(request.files)
        imagen=request.files['imagen']
        mensaje, resultado = validar_imagen_completa(imagen)
        if resultado:
            return jsonify({"mensaje": mensaje, "tipo": "danger"})
        nombre_archivo, ruta=ruta_guardado(session["usuario"]["codigo_usuario"], "_perfil", "Fotos/perfil")
        imagen.save(ruta)
        actualizar_datos("USUARIOS", {"foto_perfil_usuario": nombre_archivo}, {"correo_usuario": session["usuario"]["correo_usuario"]})
        return jsonify({"mensaje": "Foto de perfil actualizada", "tipo": "success", "foto_perfil_usuario": nombre_archivo})

@app.route("/crear_historia", methods=["GET","POST"])
@necesita("usuario", lambda: session.get("usuario")!=None)
def crear_historia():
    if request.method=="POST":
        form = request.get_json()
        nombre_historia=form["nombre_historia"].strip()
        descripcion_historia=form["descripcion_historia"].strip()
        saga_historia=form["saga_historia"]
        historia=Json(form["historia"])
        texto_historia=form["texto_historia"]
        visivilidad_historia=form["visibilidad_historia"] 
        fecha_actualizacion=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        id_historia=f"""-historia-{session["usuario"]["codigo_usuario"]}-{saga_historia}-{nombre_historia.strip()}"""
        id_usuario_saga=dato_en_db(None, {"codigo_usuario": session["usuario"]["codigo_usuario"], "id_saga": saga_historia}, "saga")
        if not id_usuario_saga and not saga_historia.strip() == "":
            return jsonify({"mensaje":"No tienes acceso a esta saga","tipo": "warning"})
        if nombre_historia.strip() == "" or descripcion_historia.strip() == "":
            return jsonify({"mensaje":"Llena todos los datos","tipo": "warning"})
        if dato_en_db(None,{"nombre_historia": nombre_historia, "id_saga": saga_historia} , "historias"):
            return jsonify({"mensaje":"Ya existe una historia con ese nombre","tipo": "warning"})
        if len(texto_historia.replace(" ", ""))<1000:
            return jsonify({"mensaje": "El texto de la historia es muy corto","tipo": "warning"})
        if len(descripcion_historia)>100:
            return jsonify({"mensaje": "La descripcion de la historia es muy larga","tipo": "warning"})
        idioma = detectar_idioma(texto_historia)
        insertar_db("historias", {"nombre_historia": nombre_historia, "descripcion_historia": descripcion_historia, "visibilidad_historia": visivilidad_historia,"id_saga": saga_historia, "fecha_actualizacion": fecha_actualizacion, "id_historia": id_historia,"contenido_historia": historia,"codigo_usuario": session["usuario"]["codigo_usuario"], "idioma": idioma})
        hashtag_db(descripcion_historia, id_historia, {"tabla": "hashtags_historias", "campo": "id_historia"})
        flash("Historia creada", "success")
        return redirect(url_for("inicio"))
    return render_template("pagina/crear_historias.html")

@app.route("/crear_saga", methods=["POST"])
@necesita("usuario", lambda: session.get("usuario")!=None)
def crear_saga():
    nombre_saga=request.form["nombre_saga"].strip()
    descripcion_saga=request.form["descripcion_saga"].strip()
    imagen_saga=request.files.get("foto_saga", None)
    id_saga=f"""-inicio-{session["usuario"]["codigo_usuario"]}-{nombre_saga.strip()}"""
    if nombre_saga.strip() == "" or descripcion_saga.strip() == "" or imagen_saga.filename == "":
        return jsonify({"mensaje": "Llena todos los datos", "tipo": "danger"})
    sagas_con_mismo_nombre=dato_en_db(None, {"nombre_saga": nombre_saga, "codigo_usuario": session["usuario"]["codigo_usuario"]}, "saga")
    if sagas_con_mismo_nombre:
        return jsonify({"mensaje": "Ya existe una saga con ese nombre", "tipo": "danger"})
    mensaje, resultado = validar_imagen_completa(imagen_saga)
    if resultado:
        return jsonify({"mensaje": mensaje, "tipo": "danger"})
    if len(descripcion_saga.split(" "))>60:
        return jsonify({"mensaje": "La descripcion de la saga es muy larga","tipo": "danger"})
    imagen_saga_nombre, imagen_saga_ruta=ruta_guardado(id_saga, "_saga", "Fotos/fotos_sagas")
    imagen_saga.save(imagen_saga_ruta)
    insertar_db("saga", {"id_saga": id_saga, "nombre_saga": nombre_saga, "descripcion_saga": descripcion_saga, "imagen_saga": imagen_saga_nombre, "codigo_usuario": session["usuario"]["codigo_usuario"]})
    hashtag_db(descripcion_saga, id_saga, {"tabla": "hashtags_sagas", "campo": "id_saga"})
    return jsonify({"mensaje": "Saga creada", "tipo": "success"})

@app.route("/sagas_creadas/<usuario>", methods=["POST"])
def sagas_creadas(usuario):
    if request.method=="POST":
        sagas_usuario=dato_en_db(usuario, "codigo_usuario", "saga")
        return jsonify(sagas_usuario)
    
@app.route("/api/calificar_historia/<id_historia>", methods=["POST"])
@necesita("usuario", lambda: session.get("usuario")!=None)
def calificar_historia(id_historia):
    form = request.get_json()
    calificacion = form.get("calificacion")
    id_usuario = session["usuario"]["codigo_usuario"]
    historia = dato_en_db(id_historia, "id_historia", "historias")
    if not historia:
        return jsonify({"mensaje": "Historia no encontrada", "tipo": "danger"})
    if calificacion == 0:
        if dato_en_db(None, {"id_historia": id_historia, "codigo_usuario": id_usuario}, "calificacion_historia"):
            with conectar() as db:
                with db.cursor() as cursor:
                    cursor.execute('DELETE FROM "calificacion_historia" WHERE id_historia = %s AND codigo_usuario = %s',(id_historia, id_usuario))
                    db.commit()
        return jsonify({"fin": "Calificacion quitada", "tipo": "danger"})
    if calificacion not in [1, 2, 3]:
        return jsonify({"fin": "Calificación no válida", "tipo": "danger"})
    if dato_en_db(None, {"id_historia": id_historia, "codigo_usuario": id_usuario}, "calificacion_historia"):
        actualizar_datos("calificacion_historia", {"calificacion": calificacion}, {"id_historia": id_historia, "codigo_usuario": id_usuario})
        return jsonify({"fin": "calificacion cambiada", "tipo": "success"})
    insertar_db("calificacion_historia", {"id_historia": id_historia, "calificacion": calificacion, "codigo_usuario": id_usuario})
    print("------------------", calificacion)
    return jsonify({"fin": "calificacion cambiada", "tipo": "success"})

@app.route("/api/historia/<id_historia>", methods=["POST"])
def historia(id_historia):
    historia=dato_en_db(id_historia, "id_historia", "historias")
    if not historia:
        return jsonify({"redirigir": "/inicio", "mensaje_redirigir":{"mensaje": "Historia no disponible", "tipo": "danger"}})
    if historia[0]["visibilidad_historia"] == 0:
        return jsonify({"redirigir": "/inicio", "mensaje_redirigir":{"mensaje": "Historia no disponible", "tipo": "danger"}})
    historia[0]["fecha_actualizacion"]=historia[0]["fecha_actualizacion"].strftime("%d/%m/%Y")
    guardar_historial(id_historia)
    calificacion = dato_en_db(None, {"id_historia": id_historia, "codigo_usuario": session["usuario"]["codigo_usuario"]}, "calificacion_historia")
    return jsonify({"historia": historia[0]})

@app.route("/api/calificacion_historia/<id_historia>", methods=["POST"])
def calificacion_historia(id_historia):
    calificacion = dato_en_db(None, {"id_historia": id_historia, "codigo_usuario": session["usuario"]["codigo_usuario"]}, "calificacion_historia")
    return jsonify(calificacion[0]["calificacion"] if calificacion else 0)

         
@app.route("/saga/<id_saga>")
@necesita("usuario", lambda: session.get("usuario")!=None)
def saga(id_saga):
    saga=dato_en_db(id_saga, "id_saga", "saga")
    if not saga:
        abort(404) 
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT h.nombre_historia, h.id_historia, h.fecha_actualizacion, ROUND(COALESCE(AVG(ch.calificacion), 0)) AS calificacion_p, COUNT(ch.calificacion) AS personas FROM "historias" h LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia WHERE h.id_saga = %s AND h.visibilidad_historia = %s GROUP BY h.nombre_historia, h.id_historia, h.fecha_actualizacion ORDER BY h.fecha_actualizacion DESC""", (id_saga, True))
            historias=cursor.fetchall()
    autor = dato_en_db(saga[0]["codigo_usuario"], "codigo_usuario", "USUARIOS")
    return render_template("pagina/saga.html", saga=saga[0], historias=historias, autor=autor[0])

@app.route("/guardar_paleta_personalizada", methods=["POST"])
def guardar_paleta_personalizada():
    form = request.get_json()
    color1 = form["color1original"]["value"]
    color2 = form["color2original"]["value"]
    color3 = form["color3original"]["value"]
    color_texto = "#000000"
    color_texto_fondo = "#000000"
    if not validar_hex(color1) or not validar_hex(color2) or not validar_hex(color3):
        return jsonify({"mensaje": "Paleta no valida", "tipo": "danger"})
    if not es_color_claro(color1):
        color_texto = "#FFFFFF"
    if not es_color_claro(color2):
        color_texto_fondo = "#FFFFFF"
    id_paleta = paleta_en_base({"color1": color1, "color2": color2, "color3": color3}, session["usuario"]["codigo_usuario"])
    if not id_paleta:
        id_paleta = random.randint(100000,999999)
        insertar_db("paletas", {"color1": color1, "color2": color2, "color3": color3, "color_letra": color_texto, "color_letra_fondo": color_texto_fondo,"id_paleta": id_paleta, "codigo_usuario": session["usuario"]["codigo_usuario"]})
    actualizar_datos("USUARIOS", {"id_paleta": id_paleta}, {"codigo_usuario": session["usuario"]["codigo_usuario"]})
    actualizar_sesion(session["usuario"]["correo_usuario"])
    return redirect(request.referrer)
    
@app.route("/guardar_paleta", methods=["POST"])
def guardar_paleta():
    form = request.get_json()
    id_paleta = form["id_paleta"]
    id_paletas = dato_en_db(id_paleta, "id_paleta", "paletas")
    if not id_paletas:
        return jsonify({"mensaje": "Paleta no valida", "tipo": "danger"})
    actualizar_datos("USUARIOS", {"id_paleta": id_paleta}, {"codigo_usuario": session["usuario"]["codigo_usuario"]})
    actualizar_sesion(session["usuario"]["correo_usuario"])
    return redirect(request.referrer)

@app.route("/paletas", methods=["POST"])
def paletas():
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT * FROM paletas WHERE codigo_usuario = %s OR codigo_usuario IS NULL', (session["usuario"]["codigo_usuario"],))
            paletas=cursor.fetchall()
    return jsonify(paletas)

@app.route("/paleta_usuario", methods=["POST"])
def paleta_usuario():
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT p.color1, p.color2, p.color3, p.color_letra, p.color_letra_fondo FROM paletas p WHERE p.id_paleta = %s', (session["usuario"]["id_paleta"],))
            paleta=cursor.fetchone()
    return jsonify(paleta)


def detectar_idioma(texto):
    idioma = detect(texto)
    return idiomas_soportados.get(idioma, 'spanish')




@app.route("/api/simulacion_recomendar_libros", methods=["POST"])
def simulacion_recomendar():
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT h.nombre_historia, h.id_historia, h.descripcion_historia ,ROUND(COALESCE(AVG(ch.calificacion), 0)) AS calificacion_p, COUNT(ch.calificacion) AS personas FROM "historias" h LEFT JOIN "calificacion_historia" ch ON h.id_historia = ch.id_historia WHERE h.visibilidad_historia = %s AND id_saga = '' GROUP BY h.nombre_historia, h.id_historia, h.fecha_actualizacion ORDER BY calificacion_p DESC LIMIT 20""", (True,))
            historias=cursor.fetchall()
    return jsonify(historias)

@app.route("/api/simulacion_recomenda_sagas", methods=["POST"])
def simulacion_recomendar_sagas():
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""SELECT s.nombre_saga, s.id_saga, s.imagen_saga, s.descripcion_saga, COUNT(h.id_saga) AS libros FROM "saga" s JOIN historias h ON s.id_saga =  h.id_saga AND h.visibilidad_historia = %s GROUP BY s.nombre_saga, s.id_saga LIMIT 20""", (True,))
            sagas= cursor.fetchall()
    return jsonify(sagas)

@app.route("/buscar", methods=["POST"])
@necesita("usuario", lambda: session.get("usuario")!=None )
def buscar():
    if request.method == "POST":
        print("buscando")
    return({"mm": "queso y plomo 🗿"})

@app.route("/api/necesita_usuario")
@necesita("usuario", lambda: session.get("usuario")!=None)
def necesita_usuario():
    return jsonify({"mm": "okey"})



if __name__=="__main__":
    app.run(debug=True, port=1240, host="0.0.0.0") 
