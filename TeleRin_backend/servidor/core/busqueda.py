from elasticsearch import Elasticsearch
import os

url = os.environ.get("ELASTICSEARCH_URL", "http://elasticsearch:9200")

es = Elasticsearch([url])

def obtener_elastic():
    return es