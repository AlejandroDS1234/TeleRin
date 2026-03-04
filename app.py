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


app=Flask(__name__)
app.secret_key = "GcWqCD7N4gueHr6LakfWrNNkKIQUYKYy"


#decoradores
funciones={}
def registrar_funcion(nombre):
    def decorador(func):
        funciones[nombre]=func
        return func
    return decorador

def necesita(nombre, validacion):
    def decorador(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not validacion():    
                print(request.referrer)
                flash(f"Necesitas {nombre} para acceder", "warning")
                return redirect(request.referrer or "/")
            return func(*args, **kwargs)
        return wrapper
    return decorador

#funciones reutilizables
def conectar():
    try:
        db = ps.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="123456",
            database="TeleRin"
        )
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

#funciones del sistema
def actualizar_sesion(correo: str):
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT * FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
            usuario=cursor.fetchone()
            datos_indefinidos(usuario)
            session["usuario"]=usuario
           
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
        print("Error to send email")
        return jsonify({"mensaje":"Error al enviar el correo de validacion", "tipo":"danger"})
        
    session["codigo_validacion"]=encriptar(codigo)
    return redirect(url_for("ingresar_codigo_validacion"))

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
    return redirect(url_for("inicio"))
        
@registrar_funcion("iniciar_sesion_dispositivo_nuevo")
def iniciar_sesion_dispositivo_nuevo(dato: dict | str):
    correo = dato["correo_usuario"] if isinstance(dato, dict) else dato
    guardar_ip(correo)
    actualizar_sesion(correo)
    return redirect(url_for("inicio"))

@registrar_funcion("cambiar_contraseña_comprobador")
def cambiar_contraseña_comprobador(_=None):
    session["cambiar_contraseña_usuario"]=True
    return redirect(url_for("cambiar_contraseña"))
   
#rutas
@app.route("/")
def index():
    return render_template("index.html")
   
@app.route("/registrarse", methods=["GET", "POST"])
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
    elif request.method=="GET":
        return render_template("llenar_datos/registrarse.html")
   
@app.route("/ingresar_codigo_validacion", methods=["GET"])
def ingresar_codigo_validacion():
    if request.method=="GET":
        return render_template("llenar_datos/codigo_verificacion.html")
   
@app.route("/validar_codigo", methods=["POST"])
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
    return render_template("pagina/inicio.html")
   
@app.route("/Fotos/perfil/<filename>")
def perfil_img(filename):
    if "usuario" not in session:
        abort(403)
    return send_from_directory("Fotos/perfil", filename)

@app.route("/Fotos/fotos_sagas/<filename>")
def fotos_saga(filename):
    if "usuario" not in session:
        abort(403)
    return send_from_directory("Fotos/fotos_sagas", filename)

@app.route("/iniciar_sesion", methods=["GET", "POST"])
def iniciar_sesion():
    if request.method=="POST":
        print("Intentando iniciar sesion")
        form = request.get_json()
        correo=form["correo_usuario"]
        contraseña=form["contraseña_usuario"]
        contraseña_encriptada=f"{correo}{contraseña}"
        print("Datos recibidos, verificando en la base de datos")
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
                    print("Dispositivo nuevo, enviando correo de validacion")
                    return enviar_correo(correo)
                return iniciar_sesion_dispositivo_nuevo(correo)
    return render_template("llenar_datos/iniciar_sesion.html")

@app.route("/codigo_verificacion_cambiar_contrasena", methods=["GET", "POST"])
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
    return render_template("llenar_datos/codigo_verificacion_cambiar_contraseña.html")

@app.route("/cambiar_contraseña", methods=["GET", "POST"])
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
        flash("Contraseña cambiada exitosamente", "success")
        return redirect(url_for("iniciar_sesion"))
    return render_template("llenar_datos/cambiar_contraseña.html")

@app.route("/api/paises_generos")
@necesita("usuario", lambda: session.get("usuario")!=None)
def paises_generos():
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute('SELECT id_pais, nombre_pais FROM paises ORDER BY id_pais')
            paises=cursor.fetchall()
            cursor.execute('SELECT id_genero, nombre_genero FROM generos ORDER BY id_genero')
            generos=cursor.fetchall()
            usuario=session["usuario"]
            datos_indefinidos(usuario)
            actualizar_sesion(usuario["correo_usuario"])
            pais_usuario=dato_en_db(usuario["id_pais"], "id_pais", "paises")
            genero_usuario=dato_en_db(usuario["id_genero"], "id_genero", "generos")
            lista_mandar={
                "genero_usuario": genero_usuario[0],
                "generos": generos,
                "pais_usuario": pais_usuario[0],
                "paises":paises
            }
            return jsonify(lista_mandar)
        
@app.route("/perfil", methods=["POST", "GET"])
@necesita("usuario", lambda: session.get("usuario")!=None)
def perfil():
    if request.method=="POST":
        form = request.get_json()
        nombre_usuario=form["nombre_usuario"]
        pais_usuario=form["pais"]
        genero_usuario=form["genero"]
        print(nombre_usuario, pais_usuario, genero_usuario)
        descripcion_usuario=form["descripcion"]
        if dato_en_db(nombre_usuario, 'nombre_usuario') and nombre_usuario != session["usuario"]["nombre_usuario"]:
            return jsonify({"mensaje":"Nombre de usuario ya registrado", "tipo":"warning"})
        datos_indefinidos(session["usuario"])
        actualizar_datos("USUARIOS", {"nombre_usuario": nombre_usuario, "id_pais": pais_usuario, "id_genero": genero_usuario, "descripcion_personal": descripcion_usuario}, {"correo_usuario": session["usuario"]["correo_usuario"]})
        actualizar_sesion(session["usuario"]["correo_usuario"])
        flash("Datos actualizados", "success")
        return redirect(request.referrer)
    return render_template("pagina/perfil.html")
        
@app.route("/guardar_foto_perfil", methods=["POST"])
def guardar_foto_perfil():
    if request.method=="POST":
        imagen=request.files['imagen']
        mensaje, resultado = validar_imagen_completa(imagen)
        if resultado:
            print("aqui")
            return jsonify({"mensaje": mensaje, "tipo": "danger"})
        nombre_archivo, ruta=ruta_guardado(session["usuario"]["codigo_usuario"], "_perfil", "Fotos/perfil")
        imagen.save(ruta)
        actualizar_datos("USUARIOS", {"foto_perfil_usuario": nombre_archivo}, {"correo_usuario": session["usuario"]["correo_usuario"]})
        return redirect(request.referrer)

@app.route("/crear_historia", methods=["GET","POST"])
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
            return jsonify({"mensaje":"No tienes acceso a esta saga","tipo": "danger"})
        if nombre_historia.strip() == "" or descripcion_historia.strip() == "":
            return jsonify({"mensaje":"Llena todos los datos","tipo": "danger"})
        if dato_en_db(None,{"nombre_historia": nombre_historia, "id_saga": saga_historia} , "historias"):
            return jsonify({"mensaje":"Ya existe una historia con ese nombre","tipo": "danger"})
        if len(texto_historia.replace(" ", ""))<1000:
            return jsonify({"mensaje": "El texto de la historia es muy corto","tipo": "danger"})
        if len(descripcion_historia)>1000:
            return jsonify({"mensaje": "La descripcion de la historia es muy larga","tipo": "danger"})
        insertar_db("historias", {"nombre_historia": nombre_historia, "descripcion_historia": descripcion_historia, "visibilidad_historia": visivilidad_historia,"id_saga": saga_historia, "fecha_actualizacion": fecha_actualizacion, "id_historia": id_historia,"contenido_historia": historia,"codigo_usuario": session["usuario"]["codigo_usuario"]})
        flash("Historia creada", "success")
        return redirect(url_for("inicio"))
    return render_template("pagina/crear_historias.html")

@app.route("/crear_saga", methods=["POST"])
def crear_saga():
    nombre_saga=request.form["nombre_saga"].strip()
    descripcion_saga=request.form["descripcion_saga"].strip()
    imagen_saga=request.files["foto_saga"]
    id_saga=f"""-inicio-{session["usuario"]["codigo_usuario"]}-{nombre_saga.strip()}"""
    if nombre_saga.strip() == "" or descripcion_saga.strip() == "" or imagen_saga.filename == "":
        return jsonify({"mensaje": "Llena todos los datos", "tipo": "danger"})
    sagas_con_mismo_nombre=dato_en_db(None, {"nombre_saga": nombre_saga, "codigo_usuario": session["usuario"]["codigo_usuario"]}, "saga")
    if sagas_con_mismo_nombre:
        return jsonify({"mensaje": "Ya existe una saga con ese nombre", "tipo": "danger"})
    mensaje, resultado = validar_imagen_completa(imagen_saga)
    if resultado:
        return jsonify({"mensaje": mensaje, "tipo": "danger"})
    imagen_saga_nombre, imagen_saga_ruta=ruta_guardado(id_saga, "_saga", "Fotos/fotos_sagas")
    imagen_saga.save(imagen_saga_ruta)
    insertar_db("saga", {"id_saga": id_saga, "nombre_saga": nombre_saga, "descripcion_saga": descripcion_saga, "imagen_saga": imagen_saga_nombre, "codigo_usuario": session["usuario"]["codigo_usuario"]})
    return jsonify({"mensaje": "Saga creada", "tipo": "success"})

@app.route("/sagas_creadas/<usuario>", methods=["POST"])
def sagas_creadas(usuario):
    if request.method=="POST":
        sagas_usuario=dato_en_db(usuario, "codigo_usuario", "saga")
        return jsonify(sagas_usuario)
    
@app.route("/calificar_historia", methods=["POST"])
def calificar_historia():
    form = request.get_json()
    id_historia = form.get("id_historia")
    calificacion = form.get("calificacion")
    id_usuario = session["usuario"]["codigo_usuario"]
    historia = dato_en_db(id_historia, "id_historia", "historias")
    if not historia:
        return jsonify({"mensaje": "Historia no encontrada", "tipo": "danger"})
    if calificacion not in ["1", "2", "3"]:
        return jsonify({"mensaje": "Calificación no válida", "tipo": "danger"})
    if dato_en_db(None, {"id_historia": id_historia, "codigo_usuario": id_usuario}, "calificacion_historia"):
        actualizar_datos("calificacion_historia", {"calificacion": calificacion}, {"id_historia": id_historia, "codigo_usuario": id_usuario})
        return jsonify({"mensaje": "Gracias :)", "tipo": "success"})
    insertar_db("calificacion_historia", {"id_historia": id_historia, "calificacion": calificacion, "codigo_usuario": id_usuario})
    return jsonify({"mensaje": "Gracias :)", "tipo": "success"})

@app.route("/historia/<id_historia>")
def historia(id_historia):
    historia=dato_en_db(id_historia, "id_historia", "historias")
    if not historia:
        abort(404)
    if historia[0]["visibilidad_historia"] == 0:
        abort(403)
    return render_template("pagina/historia.html", historia=historia[0])
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
@app.route("/saga/<id_saga>")
def saga(id_saga):
    saga=dato_en_db(id_saga, "id_saga", "saga")
    if not saga:
        abort(404)
    historias=dato_en_db(None, {"id_saga": id_saga, "visibilidad_historia": 1}, "historias")
    return render_template("pagina/saga.html", saga=saga[0], historias=historias)
         
         
         
         
         
         
         
         
         
         
         
         
         
            
if __name__=="__main__":
    app.run(debug=True) 