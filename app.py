from flask import Flask, render_template, request, flash, redirect, url_for
import psycopg2 as ps
from email_validator import validate_email, EmailNotValidError

app=Flask(__name__)
app.secret_key = "GcWqCD7N4gueHr6LakfWrNNkKIQUYKYy"

@app.route("/")
def index():
    return render_template("index.html")

def conectar():
    try:
        db= ps.connect(
            host="localhost",
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
            cursor.execute('SELECT * FROM usuarios WHERE correo_usuario = %s', (correo_usuario,))
            if cursor.fetchone():
                db.close()
                flash("Correo ya registrado", "warning")

                return redirect(url_for("registrar_usuario"))
            else:
                valores=(nombre_us, correo_usuario, contraseña_us)
                sql='INSERT INTO usuarios (nombre_usuario, correo_usuario, contrasena_usuario) VALUES (%s, %s, %s)'
                cursor.execute(sql,valores)
                db.commit()
                db.close()
                flash("Registro Correcto", "success")
                return redirect(url_for("registrar_usuario"))
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

if __name__=="__main__":
    app.run(debug=True)