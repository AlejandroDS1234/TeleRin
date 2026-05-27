from flask import Flask
from flask_cors import CORS
import os
# Importamos la lista centralizada desde el paquete de rutas
from servidor.routes import all_blueprints

app=Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
CORS(app, supports_credentials=True, origins=os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")) 

# Registramos todos los blueprints en un solo ciclo
for bp in all_blueprints:
    app.register_blueprint(bp)

if __name__=="__main__":
    app.run(debug=True, port=1240, host="0.0.0.0") 