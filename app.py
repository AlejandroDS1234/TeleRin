from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify
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
    if check_password_hash(ip["ip_usuario"], ip_local)==False:
        ip_local=generate_password_hash(ip_local)
        cursor.execute('UPDATE "USUARIOS" SET ip_usuario = %s WHERE correo_usuario = %s', (ip_local, correo))
        db.commit()
        db.close()
        cursor.close()
        codigo=correo_validacion(correo)
        if codigo:
            session["codigo_verificacion"]=str(codigo)
            session["correo_usuario"]=correo
            return redirect(url_for("mandar_codigo"))
        flash("No se pudo enviar el codigo, intente despues", "danger")
        return redirect(url_for("mandar_codigo"))
    session["correo_usuario"]=correo
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
        if usuario and check_password_hash(usuario["contraseña_usuario"], contraseña):
            return guardar_ip(correo)
        flash("Contraseña o correo incorrectos", "danger")
        return redirect(url_for("iniciar_sesion")) 
    return "error"

@app.route("/verificar_codigo", methods=["GET","POST"])
def verificar_codigo():
    if request.method=="POST":
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
            return redirect(url_for("inicio"))
        else:
            flash("Codigo incorrecto", "danger")
            return redirect(url_for("mandar_codigo"))
    return "error"


@app.route("/inicio")
def inicio():
    usuario = session.get("correo_usuario")
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute('SELECT foto_perfil_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (usuario,))
    usuario_ = cursor.fetchone()
    if usuario_["foto_perfil_usuario"] == None:
        ruta_guardado="static\perfil\predefinido.jpg"
        cursor.execute('UPDATE "USUARIOS" SET foto_perfil_usuario = %s WHERE correo_usuario = %s', (ruta_guardado, usuario))
    cursor.execute('SELECT nombre_usuario, correo_usuario, foto_perfil_usuario FROM "USUARIOS" WHERE correo_usuario = %s', (usuario,))
    usuario_ = cursor.fetchone()
    session['imagen_url']=usuario_["foto_perfil_usuario"]
    return render_template("inicio.html", usuario=usuario_, imagen_url=session.get("imagen_url"))

@app.route("/guardar_foto", methods=["POST"])
def guardar_foto():
    if request.method!="POST":
        flash("Metodo no permitido", "danger")
        return redirect(url_for("inicio"))
    
    direccion_proyecto=os.getcwd()
    usuario=session.get("correo_usuario")
    if 'imagen' not in request.files:
        flash("No se seleccionó ningún archivo", "danger")
        return redirect(url_for("inicio"))
    
    file = request.files['imagen']
    
    if file.filename == '':
        flash("No se seleccionó ningún archivo", "danger")
        return redirect(url_for("inicio"))
    
    if file:
        
        ruta_guardado = os.path.join('static', 'perfil', f"{usuario}_perfil.jpg")
        ruta_completa= os.path.join(direccion_proyecto, ruta_guardado)
        file.save(ruta_completa)
        flash("Foto de perfil actualizada", "success")
        db=conectar()
        cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute('UPDATE "USUARIOS" SET foto_perfil_usuario = %s WHERE correo_usuario = %s', (ruta_guardado, usuario))
        db.commit()
        cursor.close()
        db.close()
        return redirect(url_for("inicio"))
    
@app.route("/api/paises")
def paises():
    db=conectar()
    cursor=db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute('SELECT id_pais, nombre_pais FROM paises ORDER BY id_pais')
    paises=cursor.fetchall()

    usuario=session.get("correo_usuario")
    cursor.execute('SELECT id_pais FROM "USUARIOS" WHERE correo_usuario= %s', (usuario,))
    pais_usuario_id=cursor.fetchone()

    cursor.execute('SELECT id_pais, nombre_pais FROM paises WHERE id_pais = %s', (pais_usuario_id["id_pais"],))
    pais_usuario=cursor.fetchone()

    lista_paises_mandar={
        "pais_usuario": pais_usuario,
        "paises":paises
    }

    return jsonify(lista_paises_mandar)

@app.route("/guardar", methods=["POST"])
def guardar():
    contenido = request.form.get("historia")
    db=conectar()
    cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute()
    #falta finalizar la incersion de la historia a la columna contenido de la tabla usuarios

if __name__=="__main__":
    app.run(debug=True)