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
from werkzeug.security import generate_password_hash, check_password_hash
import os
import socket
from PIL import Image
from functools import wraps

app=Flask(__name__)
app.secret_key = "GcWqCD7N4gueHr6LakfWrNNkKIQUYKYy"

#funciones para renderizar 

def necesita_sesion(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if session.get('usuario') == None:    
            flash("Debes iniciar sesion para acceder a esta pagina", "warning")
            return redirect(url_for("index"))
        return func(*args, **kwargs)
    return wrapper

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/registrar_usuario")
def registrar_usuario():
    return render_template("registrarse/registrarse.html")

@app.route("/inicio")
@necesita_sesion
def inicio():
    print("inicio")
    actualizar_sesion(session["usuario"]["correo_usuario"])
    guardar_ip(session["usuario"]["correo_usuario"])
    session.pop("cambio_contrasena", None)
    session.pop("intentos_fallidos", None)
    session.pop("direccion", None)
    return render_template("pagina/inicio.html")

@app.route('/prueba')
@necesita_sesion
def prueba():
    return render_template('pagina/crear.html')

@app.route('/historias_creadas')
@necesita_sesion
def historias_creadas():
    sagas_creadas()
    return render_template('pagina/paginas_creadas.html')






# proceso cambiar contraseña 

@app.route("/iniciar_sesion")
def iniciar_sesion():
    return render_template("iniciar_sesion/iniciar_sesion.html")

@app.route("/enviar_codigo/<correo>/<direccion>",)
def enviar_codigo(correo, direccion="inicio"):
    codigo=correo_validacion(correo)
    if codigo:
        session["codigo_verificacion"]=str(codigo)
        session["correo_usuario"]=correo
        session["direccion"]=direccion
        return redirect(url_for("mandar_codigo"))
    flash("No se pudo enviar el codigo, intente despues", "danger")
    return redirect(url_for("mandar_codigo")) 

@app.route("/mandar_codigo")
def mandar_codigo():
    return render_template("iniciar_sesion/codigo_verificacion.html")

@app.route("/verificar_codigo/<codigo>", methods=["GET","POST"])
def verificar_codigo(codigo):
    if request.method!="POST":
        flash("Metodo no permitido", "danger")
        return redirect(url_for("index"))
    codigoS=session.get("codigo_verificacion")
    if str(codigo)==str(codigoS):
        session.pop("codigo_verificacion", None)
        if str(session.get("direccion"))=='cambiar_contrasena':
            session["cambio_contrasena"]=True
            print
        else:
            actualizar_sesion(session["correo_usuario"])
        return redirect(url_for(session.get("direccion")))
    else:
        return jsonify({"mensaje":"Codigo incorrecto", "tipo":"danger"})

@app.route("/cambiar_contrasena")
def cambiar_contrasena():
    if not session.get("cambio_contrasena"):
        flash("No puedes acceder a esta pagina", "danger")
        return redirect(url_for("index"))
    return render_template("iniciar_sesion/cambiar_contraseña.html")

@app.route("/cambiarContrasena", methods=["GET","POST"])
def cambiarContrasena():
    if not session.get("cambio_contrasena"):
        flash("No puedes acceder a esta pagina", "danger")
        return redirect(url_for("index"))
    if request.method!="POST":
        return "ruta no valida >:("
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    nueva_contraseña=request.form["contraseña_usuario"]
    if len(nueva_contraseña) < 8:
        flash("La contraseña debe tener al menos 8 caracteres", "danger")
        return redirect(url_for("cambiar_contrasena"))
    nueva_contraseña=generate_password_hash(nueva_contraseña)
    correo=session.get("correo_usuario")
    cursor.execute('UPDATE "USUARIOS" SET contraseña_usuario = %s WHERE correo_usuario = %s', (nueva_contraseña, correo))
    db.commit()
    cursor.close()
    db.close()
    session.pop("intentos_fallidos", None)
    flash("Contraseña cambiada con exito", "success")
    return redirect(url_for("iniciar_sesion"))









def guardar_ip(correo):
    ip_local = socket.gethostbyname(socket.gethostname())
    user_agent = request.headers.get("User-Agent", "")
    lenguaje=request.headers.get("Accept-Lenguage", "")
    encoding=request.headers.get("Accept-Encoding", "")
    dispositivo=f"{ip_local}--{user_agent}--{lenguaje}--{encoding}"
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute('SELECT ip_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
    ip=cursor.fetchone()

    if ip["ip_usuario"] == None or check_password_hash(ip["ip_usuario"], dispositivo)==False:
        dispositivo=generate_password_hash(dispositivo)
        cursor.execute('UPDATE "USUARIOS" SET ip_usuario = %s WHERE correo_usuario = %s', (dispositivo, correo))
        db.commit()
        db.close()
        cursor.close()
        return redirect(url_for("enviar_codigo", correo=correo, direccion="inicio"))
    actualizar_sesion(correo)
    return redirect(url_for("inicio"))



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

@app.route("/registrarse", methods=["GET", "POST"])
def registrarse():
    if request.method == "POST":
        form=request.get_json()
        nombre_us=form["nombre_usuario"]
        correo_us=form["correo_usuario"]
        contraseña_us=form["contraseña_usuario"]
        db=conectar()
        cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        try:
            validacion=validate_email(correo_us)
            correo_usuario=validacion.email
            cursor.execute('SELECT correo_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (correo_usuario,))
            if cursor.fetchone():
                cursor.close()
                db.close()
                return jsonify({"mensaje":"Correo ya registrado", "tipo":"warning"})
            else:
                if len(contraseña_us) < 8:
                    cursor.close()
                    db.close()
                    return jsonify({"mensaje":"La contraseña debe tener al menos 8 caracteres", "tipo": "danger"})
                contraseña_us=generate_password_hash(contraseña_us)
                valores=(nombre_us, correo_usuario, contraseña_us)
                sql='INSERT INTO "USUARIOS" (nombre_usuario, correo_usuario, contraseña_usuario) VALUES (%s, %s, %s)'
                cursor.execute(sql,valores)
                db.commit()
                codigo=correo_validacion(correo_usuario)
                if codigo:
                    session["codigo_verificacion"]=str(codigo)
                    session["correo_usuario"]=correo_usuario
                    session["direccion"]="inicio"
                    return redirect(url_for("mandar_codigo"))
                return jsonify({"mensaje": "No se pudo enviar el codigo, intente despues", "tipo": "danger"})
        except EmailNotValidError:
            return jsonify({"mensaje": "Email no valido", "tipo":"danger"})
    return redirect(url_for("index"))



def correo_validacion(correo):
    emisor="telerincontac@gmail.com"
    verficacion="emej vpkm srqe rkzn"
    server="smtp.gmail.com"
    port=587
    receptor=correo
    codigo=random.randint(100000,999999)
    mensaje=MIMEMultipart()
    mensaje["From"]=emisor
    mensaje["To"]=receptor
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
            return codigo
    except Exception as e:
        return False
    

            
            


@app.route("/inicio_usuario", methods=["GET", "POST"])
def inicio_usuario():
    if request.method=="POST":
        form = request.get_json()
        correo=form["correo_usuario"]
        contraseña=form['contrasena_usuario']
        db=conectar()
        cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute('SELECT contraseña_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
        usuario = cursor.fetchone()
        cursor.close()
        db.close()
        if usuario and check_password_hash(usuario["contraseña_usuario"], contraseña):
            return guardar_ip(correo)
        session["correo_usuario"]=correo
        return jsonify({"mensaje":"Contraseña o correo incorrectos", "tipo":"danger"}) 
    return redirect(url_for("index"))

@app.route("/cantida_errores")
def cantida_errores():
    if not "intentos_fallidos" in session:
        session["intentos_fallidos"]=0
        return jsonify({"errores": session["intentos_fallidos"]})
    else:
        session["intentos_fallidos"]+=1
        return jsonify({"errores": session["intentos_fallidos"]})



@app.route("/guardar_foto", methods=["POST"])
def guardar_foto():
    if request.method!="POST":
        return redirect(url_for("index"))
    usuario=session["usuario"]["correo_usuario"]
    foto=request.files['imagen']
    comprobar_imagen = validar_imagen_completa(foto)
    if comprobar_imagen[1]:
        flash(f"{comprobar_imagen[0]}", "danger cambiar_foto")
        return redirect(request.referrer)
    ruta_guardado=guardar_fotos(foto, "Fotos/perfil", usuario)
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute('UPDATE "USUARIOS" SET foto_perfil_usuario = %s WHERE correo_usuario = %s', (ruta_guardado, usuario))
    db.commit()
    cursor.close()
    db.close()
    flash("Foto de perfil actualizada", "success cambiar_foto")
    return redirect(request.referrer)


def guardar_fotos(foto, direccion, nombre):
    direccion_proyecto=os.getcwd()
    if foto:
        ruta_guardado = os.path.join(f"{nombre}_perfil.jpg")
        ruta_completa = os.path.join(direccion_proyecto, direccion,ruta_guardado)
        foto.save(ruta_completa)
        return ruta_guardado


def validar_imagen_completa(file, max_mb=5, min_w=300, min_h=300):
    # 1. Validar que sea imagen real
    try:
        img = Image.open(file)
        img.verify()
    except:
        return ["El archivo no es una imagen válida", True]
    file.seek(0)  # reset
    # 2. Validar peso
    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    if size > max_mb * 1024 * 1024:
        return [f"La imagen pesa más de {max_mb} MB", True]
    # 3. Validar dimensiones
    img = Image.open(file)
    w, h = img.size
    file.seek(0)
    if w < min_w or h < min_h:
        return [f"La imagen debe ser mínimo {min_w}x{min_h} px", True]
    return [None, False]
    
@app.route("/api/paises_generos")
def paises():
    #paises
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute('SELECT id_pais, nombre_pais FROM paises ORDER BY id_pais')
    paises=cursor.fetchall()
    usuario=session["usuario"]["correo_usuario"]
    cursor.execute('SELECT id_pais FROM "USUARIOS" WHERE correo_usuario= %s', (usuario,))
    pais_usuario_id=cursor.fetchone()
    if pais_usuario_id["id_pais"]==None:
        pais_usuario_id["id_pais"]=0
    cursor.execute('SELECT id_pais, nombre_pais FROM paises WHERE id_pais = %s', (pais_usuario_id["id_pais"],))
    pais_usuario=cursor.fetchone()

    #genero
    cursor.execute('SELECT id_genero, nombre_genero FROM generos ORDER BY id_genero')
    generos=cursor.fetchall()

    usuario=session["usuario"]["correo_usuario"]
    cursor.execute('SELECT id_genero FROM "USUARIOS" WHERE correo_usuario= %s', (usuario,))
    genero_usuario_id=cursor.fetchone()
    if genero_usuario_id["id_genero"]==None:
        genero_usuario_id["id_genero"]=0

    cursor.execute('SELECT id_genero, nombre_genero FROM generos WHERE id_genero = %s', (genero_usuario_id["id_genero"],))
    genero_usuario=cursor.fetchone()

    lista_mandar={
        "genero_usuario": genero_usuario,
        "generos": generos,
        "pais_usuario": pais_usuario,
        "paises":paises
    }
    return jsonify(lista_mandar)


@app.route("/actulizar_info", methods=["GET","POST"])
def actualizar_info():
    if request.method=="POST":
        db=conectar()
        cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        usuario=session["usuario"]["correo_usuario"]
        nombre_usuario=request.form["nombre_usuario"]
        pais_usuario=request.form.get("pais")
        genero_usuario=request.form.get("genero")
        descripcion_usuario=request.form["descripcion"]
        cursor.execute('UPDATE "USUARIOS" SET nombre_usuario = %s, id_pais = %s, id_genero = %s, descripcion_personal = %s WHERE correo_usuario = %s', (nombre_usuario,pais_usuario,genero_usuario,descripcion_usuario, usuario))
        db.commit()
        db.close()
        cursor.close()
        actualizar_sesion(usuario)
        flash("Cambios guardados", "success cambiar_datos")
        return redirect(request.referrer)
    return "error"
        

def actualizar_sesion(correo):
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute('SELECT * FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
    usuario_ = cursor.fetchone()
    usuario_ = foto_indefinida_genero_pais(usuario_)
    session.pop("correo_usuario", None)
    session['usuario']=usuario_
    db.close()
    cursor.close()

def foto_indefinida_genero_pais(usuario):
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if usuario["foto_perfil_usuario"] == None:
        ruta_guardado="predefinido.jpg"
        cursor.execute('UPDATE "USUARIOS" SET foto_perfil_usuario = %s WHERE correo_usuario = %s', (ruta_guardado, usuario["correo_usuario"]))
    if usuario["id_genero"] == None:
        id_genero=0
        cursor.execute('UPDATE "USUARIOS" SET id_genero = %s WHERE correo_usuario = %s', (id_genero, usuario["correo_usuario"]))
    if usuario["id_pais"] == None:
        id_pais=0
        cursor.execute('UPDATE "USUARIOS" SET id_pais = %s WHERE correo_usuario = %s', (id_pais, usuario["correo_usuario"]))
    db.commit()
    cursor.execute('SELECT * FROM "USUARIOS" WHERE correo_usuario = %s', (usuario["correo_usuario"],))
    usuario_ = cursor.fetchone()
    cursor.close()
    db.close()
    return usuario_


@app.route("/crear_saga", methods=["POST"])
def crear_saga():
    if request.method != "POST":
        return "ruta no valida >:("
    nombre_saga=request.form['nombre_saga']
    descripcion_saga=request.form["descripcion_saga"]
    correo_usuario=session["usuario"]["correo_usuario"]
    imagen=request.files["foto_saga"]
    id_saga=f"{correo_usuario}--{nombre_saga.replace(" ", "")}"
    if nombre_saga.strip() == "" or descripcion_saga.strip() == "" or imagen.filename == "":
        return jsonify({"mensaje": "Llena todos los datos", "tipo": "danger"})
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("SELECT nombre_saga FROM saga WHERE correo_usuario = %s ",(correo_usuario,))
    nombre=cursor.fetchall()
    for nom in nombre:
        if nom["nombre_saga"].replace(" ", "") == nombre_saga.replace("", " "):
            return jsonify({"mensaje": "ya existe una saga con ese nombre", "tipo": "danger"})
    comprobar_img = validar_imagen_completa(imagen)
    if comprobar_img[1]:
        return jsonify({"mensaje": f"{comprobar_img[0]}", "tipo": "danger"})
    imagen_saga=guardar_fotos(imagen, "Fotos/fotos_sagas", id_saga)
    cursor.execute("INSERT INTO saga (id_saga, nombre_saga, descripcion_saga, correo_usuario, imagen_saga) VALUES (%s,%s,%s,%s,%s)",(id_saga, nombre_saga, descripcion_saga, correo_usuario, imagen_saga))
    db.commit()
    db.close()
    cursor.close()
    sagas_creadas()
    return jsonify({"mensaje": "Saga Creada", "tipo":"success"})

@app.route("/sagas_creadas/<usuario>", methods=["POST", "GET"])
def sagas_creadas(usuario):
    if request.method != "POST":
        return "error"
    usuario=session["usuario"]["correo_usuario"]
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("SELECT * FROM saga WHERE correo_usuario = %s ", (usuario,))
    sagas=cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(sagas)

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



@app.route("/crear_historias", methods=["POST"])
def crear_historias():
    if request.method != "POST":
        return "Ruta no valida >: ("
    info = request.get_json()
    usuario=session["usuario"]["correo_usuario"]
    nombre_historia=info["nombre_historia"]
    descripcion_historia=info["descripcion_historia"]
    saga_historia=info["saga_historia"]
    visibilidad_historia = info["visibilidad_historia"]
    html_historia=info["html_historia"]
    id_historia = f"{saga_historia}--{nombre_historia}"
    ruta_guardar = guardar_escritos(html_historia, f"historias/{usuario}/{saga_historia}", nombre_historia)
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("INSERT INTO historias (id_historia, nombre_historia, descripcion_historia, visibilidad_historia, contenido_historia, id_saga) VALUES (%s,%s,%s,%s,%s,%s)", (id_historia, nombre_historia, descripcion_historia, visibilidad_historia, ruta_guardar, saga_historia))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"menajse":"algo"})
    

@app.route("/historias_creadas_bd", methods=["POST"])
def historias_creadas_bd():
    if request.method != "POST":
        return "Ruta no valida >: ("
    info = request.get_json()
    nombre_historia=info["nombre_historia"]
    saga=info["saga_historia"]
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("SELECT nombre_historia FROM historias WHERE id_saga = %s", (saga,))
    historia=cursor.fetchall()
    for his in historia:
        if his["nombre_historia"].replace(" ", "") == nombre_historia.replace(" ", ""):
            return jsonify({"historia_repetida": True})
    return jsonify({"historia_repetida": False})


def guardar_escritos(escrito, ruta, nombre):
    ruta_guardar=os.path.join(ruta, f"{nombre}.txt")
    os.makedirs(ruta, exist_ok=True)
    with open(ruta_guardar, "w", encoding="utf-8") as f:
        f.write(f"{escrito}")
    return ruta_guardar
    


def genero_pais(usuario):
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute('SELECT nombre_genero FROM generos WHERE id_genero = %s', (usuario["id_genero"],))
    genero=cursor.fetchone()
    cursor.execute('SELECT nombre_pais FROM paises WHERE id_pais = %s', (usuario["id_pais"],))
    pais=cursor.fetchone()
    cursor.close()
    db.close()
    return genero["nombre_genero"], pais["nombre_pais"]


@app.route("/inicio/<usuario_correo>")
@necesita_sesion
def usuario(usuario_correo):
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute('SELECT * FROM "USUARIOS" WHERE correo_usuario = %s', (usuario_correo,))
    usuario=cursor.fetchone()
    if usuario == None:
        return abort(404)
    usuario=foto_indefinida_genero_pais(usuario)
    genero, pais = genero_pais(usuario)
    return render_template("pagina/usuario.html", usuario=usuario, genero=genero, pais=pais)






if __name__=="__main__":
    app.run(debug=True)