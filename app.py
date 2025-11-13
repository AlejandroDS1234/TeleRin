from flask import Flask, render_template, request, flash, redirect, url_for
import psycopg2 as ps
from email_validator import validate_email, EmailNotValidError
from itsdangerous import URLSafeTimedSerializer
import smtplib
from email.mime.text import MIMEText

app=Flask(__name__)
app.secret_key = "GcWqCD7N4gueHr6LakfWrNNkKIQUYKYy"

@app.route("/")
def index():
    return render_template("index.html")

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
        nombre_us=request.form["nombre_usuario"]
        correo_us=request.form["correo_usuario"]
        contraseña_us=request.form["contraseña_usuario"]
        db=conectar()
        cursor=db.cursor()
        try:
            validacion=validate_email(correo_us)
            correo_usuario=validacion.email
            cursor.execute('SELECT * FROM "USUARIOS" WHERE correo_usuario = %s', (correo_usuario,))
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
                valores=(nombre_us, correo_usuario, contraseña_us)
                sql='INSERT INTO "USUARIOS" (nombre_usuario, correo_usuario, contraseña_usuario) VALUES (%s, %s, %s)'
                cursor.execute(sql,valores)
                db.commit()
                cursor.execute('SELECT * FROM "USUARIOS" WHERE correo_usuario = %s', (correo_usuario,))
                usuario=cursor.fetchone()
                return render_template("inicio.html", usuario=usuario)
        except EmailNotValidError:
            flash("Email no valido", "danger")
            return redirect(url_for("registrar_usuario"))
    return "error"

@app.route("/registrar_usuario")
def registrar_usuario():
    return render_template("registrarse.html")

@app.route("/iniciar_sesion")
def iniciar_sesion():
    return render_template("iniciar_sesion.html")

@app.route("/inicio_usuario", methods=["GET", "POST"])
def inicio_usuario():
    if request.method=="POST":
        correo=request.form["correo_usuario"]
        contraseña=request.form.get('contrasena_usuario')
        db=conectar()
        cursor=db.cursor()
        cursor.execute('SELECT * FROM "USUARIOS" WHERE correo_usuario = %s', (correo,))
        usuario = cursor.fetchone()
        if usuario:
            if usuario[3]==contraseña:
                return render_template("inicio.html", usuario=usuario) 
            flash("Contraseña incorrecta", "danger")
            return redirect(url_for("iniciar_sesion"))
        flash("Coreo no encontrado", "danger")
        return redirect(url_for("iniciar_sesion"))
    return "error"


if __name__=="__main__":
    app.run(debug=True)