import psycopg2
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer


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
    comando_obtener_todas_historias = """SELECT h.id_historia, h.nombre_historia, h.descripcion_historia, h.codigo_usuario, h.idioma, s.nombre_saga , STRING_AGG(ht.nombre_hashtag, ' ') AS hashtags
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

modelo = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')


df = pd.DataFrame(obtener_historias(),
                      columns=["id_historia",
                               "nombre_historia",
                               "descripcion_historia",
                               "codigo_usuario",
                               "idioma",
                               "nombre_saga",
                               "hashtags"])

df["contenido"] = (df["nombre_historia"] + " " + 
                df["descripcion_historia"] + " " + 
                df["nombre_saga"].fillna("") + " " +
                df["idioma"] + " " +
                df["hashtags"].fillna(""))

matriz = modelo.encode(df["contenido"].tolist())
print(matriz)

similitud = cosine_similarity(matriz)
print(similitud)

def recomendar(id_historia, n=5):
    idx = df[df["id_historia"] == id_historia].index[0]
    scores = list(enumerate(similitud[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)
    scores = scores[1:n+1]
    indices = [i[0] for i in scores]
    return df.iloc[indices]


print(recomendar("-historia-994474ducua-1", 10))




