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

app=Flask(__name__)
app.secret_key = "GcWqCD7N4gueHr6LakfWrNNkKIQUYKYy"

@app.route("/")
def index():
    return render_template("index.html")

def guardar_ip(correo):
    ip_local = socket.gethostbyname(socket.gethostname())
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute('SELECT ip_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
    ip=cursor.fetchone()

    if ip["ip_usuario"] == None or check_password_hash(ip["ip_usuario"], ip_local)==False:
        ip_local=generate_password_hash(ip_local)
        cursor.execute('UPDATE "USUARIOS" SET ip_usuario = %s WHERE correo_usuario = %s', (ip_local, correo))
        db.commit()
        db.close()
        cursor.close()
        return redirect(url_for("enviar_codigo", correo=correo))
    session["correo_usuario"]=correo
    return redirect(url_for("inicio"))

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
        nombre_us=request.form["nombre_usuario"]#
        correo_us=request.form["correo_usuario"]
        contraseña_us=request.form["contraseña_usuario"]
        db=conectar()
        cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        try:
            validacion=validate_email(correo_us)
            correo_usuario=validacion.email
            cursor.execute('SELECT correo_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (correo_usuario,))
            if cursor.fetchone():
                cursor.close()
                db.close()
                flash("Correo ya registrado", "warning")
                return redirect(url_for("registrar_usuario"))
            else:
                if len(contraseña_us) < 8:
                    cursor.close()
                    db.close()
                    flash("La contraseña debe tener al menos 8 caracteres", "danger")
                    return redirect(url_for("registrar_usuario"))
                contraseña_us=generate_password_hash(contraseña_us)
                valores=(nombre_us, correo_usuario, contraseña_us)
                sql='INSERT INTO "USUARIOS" (nombre_usuario, correo_usuario, contraseña_usuario) VALUES (%s, %s, %s)'
                cursor.execute(sql,valores)
                db.commit()
                codigo=correo_validacion(correo_usuario)
                if codigo:
                    session["codigo_verificacion"]=str(codigo)
                    session["correo_usuario"]=correo_usuario
                    return redirect(url_for("mandar_codigo"))
                flash("No se pudo enviar el codigo, intente despues", "danger")
                return redirect(url_for("mandar_codigo"))
        except EmailNotValidError:
            flash("Email no valido", "danger")
            return redirect(url_for("registrar_usuario"))
    return "error"

@app.route("/registrar_usuario")
def registrar_usuario():
    return render_template("registrarse/registrarse.html")

@app.route("/iniciar_sesion")
def iniciar_sesion():
    return render_template("iniciar_sesion/iniciar_sesion.html")

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
    
@app.route("/mandar_codigo")
def mandar_codigo():
    return render_template("iniciar_sesion/codigo_verificacion.html")
            
            


@app.route("/inicio_usuario", methods=["GET", "POST"])
def inicio_usuario():
    if request.method=="POST":
        correo=request.form["correo_usuario"]
        contraseña=request.form.get('contrasena_usuario')
        db=conectar()
        cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute('SELECT contraseña_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
        usuario = cursor.fetchone()
        cursor.close()
        db.close()
        if usuario and check_password_hash(usuario["contraseña_usuario"], contraseña):
            return guardar_ip(correo)
        session["correo_usuario"]=correo
        flash("Contraseña o correo incorrectos", "danger")
        return redirect(url_for("iniciar_sesion")) 
    return "error"

@app.route("/cantida_errores")
def cantida_errores():
    try:
        session["intentos_fallidos"]+=1
        print(session["intentos_fallidos"])
        return jsonify({"errores": session["intentos_fallidos"]})
    except:
        session["intentos_fallidos"]=0
        return jsonify({"errores": session["intentos_fallidos"]})


    

@app.route("/cambiar_contraseña")
def cambiar_contraseña():
    if not session.get("correo_usuario"):
        flash("No puedes acceder a esta pagina", "danger")
        return redirect(url_for("index"))
    return render_template("iniciar_sesion/cambiar_contraseña.html")


@app.route("/verificar_codigo", methods=["GET","POST"])
def verificar_codigo():
    if request.method!="POST":
        flash("Metodo no permitido", "danger")
        return redirect(url_for("index"))
    codigo_us=request.form["codigo_usuario"]
    codigo=session.get("codigo_verificacion")
    correo_us=session.get("correo_usuario")
    if codigo_us==codigo:
        db=conectar()
        cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute('SELECT nombre_usuario, correo_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (correo_us,))
        usuario=cursor.fetchone()
        cursor.close()
        db.close()
        session.pop("codigo_verificacion", None)
        return redirect(url_for(session.get("direccion")))
    else:
        flash("Codigo incorrecto", "danger")
        return redirect(url_for("mandar_codigo"))
    


@app.route("/inicio")
def inicio():
    no_sesion()
    usuario = session.get("correo_usuario")
    guardar_ip(usuario)
    actualizar_sesion(usuario)
    session.pop("intentos_fallidos", None)
    session.pop("direccion", None)
    return render_template("pagina/inicio.html")

@app.route("/guardar_foto", methods=["POST"])
def guardar_foto():
    if request.method!="POST":
        flash("Metodo no permitido", "danger")
        return redirect(request.referrer)
    usuario=session["usuario"]["correo_usuario"]
    foto=request.files['imagen']
    comprobar_imagen = validar_imagen_completa(foto, max_w=1000, max_h=1000)
    if comprobar_imagen[1]:
        flash(f"{comprobar_imagen[0]}", "danger cambiar_foto")
        return redirect(request.referrer)
    ruta_guardado=guardar_fotos(foto, "perfil", usuario)
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


def validar_imagen_completa(file, max_mb=5, min_w=300, min_h=300, max_w=350, max_h=350):
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
    if w > max_w or h > max_h:
        return [f"La imagen debe ser maximo {max_w}x{max_h} px", True]
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
    if usuario_["foto_perfil_usuario"] == None:
        ruta_guardado="predefinido.jpg"
        cursor.execute('UPDATE "USUARIOS" SET foto_perfil_usuario = %s WHERE correo_usuario = %s', (ruta_guardado, correo))
        db.commit()
    cursor.execute('SELECT * FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
    usuario_ = cursor.fetchone()
    session['usuario']=usuario_
    db.close()
    cursor.close()

@app.route('/prueba')
def prueba():
    no_sesion()
    return render_template('pagina/crear.html')

def no_sesion():
    if session.get('usuario') != None:
        return
    if session.get('correo_usuario') != None:
        return
    flash("Debes iniciar sesion para acceder a esta pagina", "warning")
    raise HTTPException(response=redirect(url_for("index")))
    
@app.route('/historias_creadas')
def historias_creadas():
    no_sesion()
    sagas_creadas()
    return render_template('pagina/paginas_creadas.html')

@app.route("/crear_saga", methods=["POST"])
def crear_saga():
    if request.method != "POST":
        return "ruta no valida >:("
    id_saga=random.randint(100000,999999)
    nombre_saga=request.form['nombre_saga']
    descripcion_saga=request.form["descripcion_saga"]
    correo_usuario=session["usuario"]["correo_usuario"]
    imagen=request.files["foto_saga"]
    if nombre_saga.strip() == "" or descripcion_saga.strip() == "" or imagen.filename == "":
        return jsonify({"mensaje": "Llena todos los datos", "tipo": "danger"})
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("SELECT nombre_saga FROM saga WHERE correo_usuario = %s AND nombre_saga = %s",(correo_usuario,nombre_saga))
    nombre=cursor.fetchone()
    if nombre:
        return jsonify({"mensaje": "ya existe una saga con ese nombre", "tipo": "danger"})
    comprobar_img = validar_imagen_completa(imagen)
    if comprobar_img[1]:
        return jsonify({"mensaje": f"{comprobar_img[0]}", "tipo": "danger"})
    imagen_saga=guardar_fotos(imagen, "fotos_sagas", id_saga)
    cursor.execute("INSERT INTO saga (id_saga, nombre_saga, descripcion_saga, correo_usuario, imagen_saga) VALUES (%s,%s,%s,%s,%s)",(id_saga, nombre_saga, descripcion_saga, correo_usuario, imagen_saga))
    db.commit()
    db.close()
    cursor.close()
    sagas_creadas()
    return jsonify({"mensaje": "Saga Creada", "tipo":"success"})

@app.route("/sagas_creadas", methods=["POST", "GET"])
def sagas_creadas():
    if request.method != "POST":
        return "error"
    usuario=session["usuario"]["correo_usuario"]
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("SELECT * FROM saga WHERE correo_usuario = %s", (usuario,))
    sagas=cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(sagas)

@app.route("/perfil/<filename>")
def perfil_img(filename):
    if "usuario" not in session:
        abort(403)
    return send_from_directory("perfil", filename)
@app.route("/fotos_sagas/<filename>")
def fotos_saga(filename):
    if "usuario" not in session:
        abort(403)
    return send_from_directory("fotos_sagas", filename)

@app.route("/cambiarContrasena", methods=["GET","POST"])
def cambiarContrasena():
    if not session.get("correo_usuario"):
        flash("No puedes acceder a esta pagina", "danger")
        return redirect(url_for("index"))
    if request.method!="POST":
        return "ruta no valida >:("
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    nueva_contraseña=request.form["contraseña_usuario"]
    if len(nueva_contraseña) < 8:
        flash("La contraseña debe tener al menos 8 caracteres", "danger")
        return redirect(url_for("cambiarContraseña"))
    nueva_contraseña=generate_password_hash(nueva_contraseña)
    correo=session.get("correo_usuario")
    cursor.execute('UPDATE "USUARIOS" SET contraseña_usuario = %s WHERE correo_usuario = %s', (nueva_contraseña, correo))
    db.commit()
    cursor.close()
    db.close()
    session.pop("intentos_fallidos", None)
    flash("Contraseña cambiada con exito", "success")
    return redirect(url_for("iniciar_sesion"))


if __name__=="__main__":
    app.run(debug=True)