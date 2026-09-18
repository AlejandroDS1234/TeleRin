from flask import Blueprint, jsonify, request
from servidor.core.db import conectar, dato_en_db, insertar_db
from servidor.services.servicios_sesion import obtener_usuario
import psycopg2.extras

listas_lectura_bp = Blueprint("listas_lectura", __name__)


@listas_lectura_bp.route("/api/crear_lista_lectura", methods=["POST"])
def crear_lista_lectura():
    pass


@listas_lectura_bp.route(
    "/api/listas_lectura/<codigo_usuario>",
    methods=["GET"],
)
def listas_lectura(codigo_usuario):
    usuario = obtener_usuario()
    with conectar() as db:
        with db.cursor(
            cursor_factory=psycopg2.extras.RealDictCursor,
        ) as cursor:
            cursor.execute(
                """
            with conteo_libros AS (
                SELECT id_lista, COUNT(*) AS total_libros
                FROM lista_lectura_historias
                GROUP BY id_lista
            )
            SELECT l.id_lista, l.nombre_lista, l.visibilidad,
            COALESCE(c.total_libros, 0) AS cantidad_elementos,
            json_build_object(
                'nombre_usuario',u.nombre_usuario,
                'foto_perfil_usuario',u.foto_perfil_usuario,
                'codigo_usuario', u.codigo_usuario
            ) AS autor
            FROM listas_lectura l
            JOIN "USUARIOS" u ON l.codigo_usuario = u.codigo_usuario
            LEFT JOIN conteo_libros c  ON c.id_lista = l.id_lista
            WHERE l.codigo_usuario = %s AND l.visibilidad IN %s
            """,
                (
                    codigo_usuario,
                    (
                        True,
                        not bool(usuario["codigo_usuario"] == codigo_usuario),
                    ),
                ),
            )
            datos = cursor.fetchall()
            print(datos)
    return jsonify(datos)


@listas_lectura_bp.route("/api/guardar_historia_lista", methods=["POST"])
def guardar_historia_lista():
    usuario = obtener_usuario()
    datos = request.get_json()
    id_lista = datos.get("id_lista")
    id_historia = datos.get("id_historia")
    if dato_en_db(
        None,
        {"id_lista": id_lista, "codigo_usuario": usuario["codigo_usuario"]},
        "listas_lectura",
    ):
        return jsonify({"fin": "Esta no es su lista", "tipo": "danger"}), 400
    if dato_en_db(
        None,
        {"id_lista": id_lista, "id_historia": id_historia},
        "lista_lectura_historias",
    ):
        return (
            jsonify(
                {
                    "fin": "Esta historia ya está en la lista",
                    "tipo": "danger",
                }
            ),
            400,
        )
    insertar_db(
        "lista_lectura_historias",
        {
            "id_lista": id_lista,
            "id_historia": id_historia,
        },
    )
    return (
        jsonify(
            {
                "fin": "Historia agregada a la lista",
                "tipo": "success",
            }
        ),
        200,
    )


def eliminar_historia_lista():
    usuario = obtener_usuario()
    datos = request.get_json()
    id_lista = datos.get("id_lista")
    id_historia = datos.get("id_historia")
    if not dato_en_db(
        None,
        {"id_lista": id_lista, "codigo_usuario": usuario["codigo_usuario"]},
        "listas_lectura",
    ):
        return jsonify({"fin": "Esta no es su lista", "tipo": "danger"}), 400
    if not dato_en_db(
        None,
        {"id_lista": id_lista, "id_historia": id_historia},
        "lista_lectura_historias",
    ):
        return (
            jsonify(
                {
                    "fin": "Esta historia no está en la lista",
                    "tipo": "danger",
                }
            ),
            400,
        )
    with conectar() as db:
        with db.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM lista_lectura_historias
                WHERE id_lista = %s AND id_historia = %s
                """,
                (id_lista, id_historia),
            )
            db.commit()
    return (
        jsonify(
            {
                "fin": "Historia eliminada de la lista",
                "tipo": "success",
            }
        ),
        200,
    )
