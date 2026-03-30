import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
from nltk.corpus import stopwords
from sklearn.metrics.pairwise import cosine_similarity

def palabras_español():
    nltk.download("stopwords")
    español=stopwords.words("spanish")
    return español

español=palabras_español()


def crear_matriz_historias(historias: list):
    df = pd.DataFrame(historias, columns=["id_historia", "nombre_historia", "descripcion_historia", "codigo_usuario", "nombre_saga", "hashtags"])
    df["contenido"] = (df["nombre_historia"] + " " + 
                    df["descripcion_historia"] + " " + 
                    df["nombre_saga"].fillna("") + " " + 
                    df["hashtags"].fillna(""))
    vectorizar = TfidfVectorizer(stop_words=español)
    matriz = vectorizar.fit_transform(df["contenido"])
    similitud = cosine_similarity(matriz)
    return similitud