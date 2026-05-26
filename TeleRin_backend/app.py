from flask import Flask
from flask_cors import CORS
# Importamos la lista centralizada desde el paquete de rutas
from servidor.routes import all_blueprints

app=Flask(__name__)
app.secret_key = "GcWqCD7N4gueHr6LakfWrNNkKIQUYKYy"
CORS(app, supports_credentials=True, origins=[
        r"http://localhost:4210",
        r"http://127\.0\.0\.1:4210",
        r"http://192\.168\.\d{1,3}\.\d{1,3}:4210",
        r"http://10\.\d{1,3}\.\d{1,3}\.\d{1,3}:4210",
        r"http://172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}:4210"
]) 

# Registramos todos los blueprints en un solo ciclo
for bp in all_blueprints:
    app.register_blueprint(bp)

if __name__=="__main__":
    app.run(debug=True, port=1240, host="0.0.0.0") 