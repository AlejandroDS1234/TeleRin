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
    cuerpo=f""" 
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3efe6; font-family: 'Times New Roman', Times, serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f3efe6; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <!-- Contenedor Estilo Periódico Antiguo -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #fbf9f4; border: 3px double #1a1a1a; padding: 20px;">
                        
                        <!-- Encabezado / Logo TeleRin -->
                        <tr>
                            <td align="center" style="padding-bottom: 20px; border-bottom: 2px solid #1a1a1a;">
                                <h1 style="color: #1a1a1a; margin: 0; font-size: 38px; font-weight: bold; font-family: 'Courier New', Courier, monospace; letter-spacing: 2px;">TeleRin</h1>
                                <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: #555555; font-family: sans-serif;">Boletín de Validación Oficial</p>
                            </td>
                        </tr>
                        
                        <!-- Contenido Principal -->
                        <tr>
                            <td style="padding: 35px 15px; text-align: center;">
                                <h2 style="color: #8b4513; margin: 0 0 20px 0; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                                    — SE BUSCA VERIFICAR —
                                </h2>
                                
                                <p style="color: #222222; font-size: 16px; line-height: 24px; margin: 0 auto 30px auto; max-width: 420px; font-family: 'Times New Roman', Times, serif;">
                                    Se solicita al <strong>Lector Serial</strong> propietario de esta dirección de correo electrónico que introduzca el siguiente código de seguridad para validar sus credenciales en la plataforma.
                                </p>
                                
                                <!-- Bloque del Código (Estilo Caja de Clasificados) -->
                                <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                                    <tr>
                                        <td align="center" style="background-color: #fbf9f4; border: 2px dashed #8b4513; padding: 15px 40px;">
                                            <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: bold; color: #1a1a1a; letter-spacing: 5px;">
                                                {codigo}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color: #666666; font-size: 13px; font-style: italic; margin-top: 35px; margin-bottom: 0;">
                                    Si usted no ha iniciado esta operación, ignore este boletín. Alguien podría haber digitado su dirección por error.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Pie de página -->
                        <tr>
                            <td align="center" style="padding-top: 15px; border-top: 1px solid #1a1a1a;">
                                <p style="color: #777777; font-size: 11px; margin: 0; font-family: sans-serif; letter-spacing: 1px;">
                                    TeleRin
                                </p>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
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
