import random
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import jsonify, session
from servidor.services.servicios_texto import encriptar
import os

def enviar_correo_validacion(correo):
    emisor= os.getenv("MAIL_USER")
    verficacion= os.getenv("MAIL_PASSWORD")
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
