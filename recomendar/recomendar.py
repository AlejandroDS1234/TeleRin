import psycopg2
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
from nltk.corpus import stopwords
from sklearn.metrics.pairwise import cosine_similarity



def conectar():
    try:
        conexion = psycopg2.connect(
            host="db",
            port=5432,
            user="postgres",
            password="123456",
            database="TeleRin"
        )
    except psycopg2.Error as e:
        print("Error al conectar a la base de datos:", e)
        return None
    return conexion


def obtener_historias():
    comando_obtener_todas_historias = """SELECT h.id_historia, h.nombre_historia, h.descripcion_historia, h.codigo_usuario, s.nombre_saga , STRING_AGG(ht.nombre_hashtag, ' ') AS hashtags
    FROM historias h
    LEFT JOIN hashtags_historias hh
    ON hh.id_historia = h.id_historia
    LEFT JOIN saga s
    ON s.id_saga = h.id_saga
    LEFT JOIN hashtags ht
    ON ht.id_hashtag = hh.id_hashtag
    GROUP BY h.id_historia,h.nombre_historia,h.descripcion_historia,h.codigo_usuario,s.nombre_saga"""
    with conectar() as db:
        with db.cursor() as cursor:
            cursor.execute(comando_obtener_todas_historias)
            historias = cursor.fetchall()
    return historias


def palabras_español():
    nltk.download("stopwords")
    español=stopwords.words("spanish")
    return español

df = pd.DataFrame(obtener_historias(), columns=["id_historia", "nombre_historia", "descripcion_historia", "codigo_usuario", "nombre_saga", "hashtags"])
df["contenido"] = (df["nombre_historia"] + " " + 
                   df["descripcion_historia"] + " " + 
                   df["nombre_saga"].fillna("") + " " + 
                   df["hashtags"].fillna(""))

vectorizar = TfidfVectorizer(stop_words=palabras_español())
matriz = vectorizar.fit_transform(df["contenido"])

similitud = cosine_similarity(matriz)

def recomendar(id_historia, n=5):
    idx = df[df["id_historia"] == id_historia].index[0]
    scores = list(enumerate(similitud[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)
    scores = scores[1:n+1]
    indices = [i[0] for i in scores]
    return df.iloc[indices]

print(recomendar("-historia-994474ducua-1", 3))




