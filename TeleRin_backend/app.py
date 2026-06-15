from flask import Flask
from flask_cors import CORS
import os
from apscheduler.schedulers.background import BackgroundScheduler
from servidor.core.db import conectar

# Importamos la lista centralizada desde el paquete de rutas
from servidor.routes import all_blueprints



app=Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
CORS(app, supports_credentials=True, origins=os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")) 

def borrar_borradores_viejos():
    print("Borrando borradores viejos...")
    try:
        with conectar() as db:
            with db.cursor() as cursor:
                query = """
                    DELETE FROM historias 
                    WHERE fecha_actualizacion < NOW() - INTERVAL '3 days' 
                    AND publicada = false;
                    """
                cursor.execute(query)
                db.commit()
        
    except Exception as e:
        print(f"Error al borrar borradores viejos: {e}")

scheduler = BackgroundScheduler()
scheduler.add_job(borrar_borradores_viejos, 'interval', hours=12, id='borrar_borradores_viejos', replace_existing=True)
scheduler.start()

# Registramos todos los blueprints en un solo ciclo
for bp in all_blueprints:
    app.register_blueprint(bp)

if __name__=="__main__":
    app.run(debug=True, port=1240, host="0.0.0.0") 