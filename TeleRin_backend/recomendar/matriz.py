import nltk
from nltk.corpus import stopwords
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import obtener_datos as obtener_datos
from sentence_transformers import SentenceTransformer

nltk.download("stopwords")

def matriz_historias():
    df = pd.DataFrame(obtener_datos.obtener_historias(),
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