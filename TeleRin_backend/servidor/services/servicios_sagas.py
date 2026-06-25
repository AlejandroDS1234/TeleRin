from servidor.core.db import conectar
import psycopg2.extras

def obtener_info_todas_sagas():
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""
            
                -- 1. Contamos los libros por saga de forma limpia
                WITH total_libros_saga AS (
                    SELECT 
                        id_saga,
                        COUNT(*) AS total_libros
                    FROM historias
                    WHERE visibilidad_historia = TRUE
                    GROUP BY id_saga
                ),

                -- 2. Contamos las vistas totales uniendo el historial con las historias para saber a qué saga pertenecen
                vistas_saga AS (
                    SELECT 
                        h.id_saga,
                        COUNT(hl.id_historia) AS total_vistas -- Cuenta cada registro/fila en el historial
                    FROM historias h
                    JOIN historial hl ON h.id_historia = hl.id_historia
                    WHERE h.visibilidad_historia = TRUE
                    GROUP BY h.id_saga
                ),

                -- 1. PASO UNO: Sacamos el promedio real de cada historia individual
                promedio_por_historia AS (
                    SELECT 
                        h.id_saga, -- Llevamos el id_saga para el siguiente paso
                        ch.id_historia,
                        AVG(ch.calificacion) AS promedio_historia
                    FROM "calificacion_historia" ch
                    JOIN "historias" h ON ch.id_historia = h.id_historia
                    WHERE h.visibilidad_historia = TRUE
                    GROUP BY h.id_saga, ch.id_historia
                ),

                -- 2. PASO DOS: Tomamos los promedios anteriores y sacamos el promedio de la saga
                calificacion_final_saga AS (
                    SELECT 
                        id_saga,
                        ROUND(COALESCE(AVG(promedio_historia), 0)) AS calificacion_saga
                    FROM promedio_por_historia -- ¡Aquí usamos el CTE de arriba!
                    GROUP BY id_saga
                ),


                -- 3. Agrupamos los hashtags por saga
                lista_hashtags AS (
                    SELECT 
                        hss.id_saga,
                        COALESCE(array_agg(hs.nombre_hashtag), '{}') AS hashtags
                    FROM hashtags_sagas hss
                    JOIN hashtags hs ON hss.id_hashtag = hs.id_hashtag
                    GROUP BY hss.id_saga
                )

                --4. Consulta principal: Unimos todo limpiamente
                SELECT 
                    s.id_saga, 
                    s.nombre_saga, 
                    s.descripcion_saga, 
                    COALESCE(lh.hashtags, '{}') AS hashtags, 
                    s.imagen_saga, 
                    s.codigo_usuario, 
                    u.nombre_usuario, 
                    COALESCE(cl.total_libros, 0) AS cantidad_historias,
                    COALESCE(vs.total_vistas, 0) AS vistas,
                    COALESCE(cfs.calificacion_saga, 0) AS calificacion 
                FROM saga s 
                JOIN "USUARIOS" u ON s.codigo_usuario = u.codigo_usuario
                LEFT JOIN total_libros_saga cl ON s.id_saga = cl.id_saga
                LEFT JOIN vistas_saga vs ON s.id_saga = vs.id_saga
                LEFT JOIN lista_hashtags lh ON s.id_saga = lh.id_saga
                LEFT JOIN calificacion_final_saga cfs ON s.id_saga = cfs.id_saga

                           
            """)
            sagas= cursor.fetchall()
            return sagas
            
def obtener_info_saga(id_saga):
    with conectar() as db:
        with db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute("""
            
                -- 1. Contamos los libros por saga de forma limpia
                WITH total_libros_saga AS (
                    SELECT 
                        id_saga,
                        COUNT(*) AS total_libros
                    FROM historias
                    WHERE visibilidad_historia = TRUE
                    GROUP BY id_saga
                ),

                -- 2. Contamos las vistas totales uniendo el historial con las historias para saber a qué saga pertenecen
                vistas_saga AS (
                    SELECT 
                        h.id_saga,
                        COUNT(hl.id_historia) AS total_vistas -- Cuenta cada registro/fila en el historial
                    FROM historias h
                    JOIN historial hl ON h.id_historia = hl.id_historia
                    WHERE h.visibilidad_historia = TRUE
                    GROUP BY h.id_saga
                ),

                -- 1. PASO UNO: Sacamos el promedio real de cada historia individual
                promedio_por_historia AS (
                    SELECT 
                        h.id_saga, -- Llevamos el id_saga para el siguiente paso
                        ch.id_historia,
                        AVG(ch.calificacion) AS promedio_historia
                    FROM "calificacion_historia" ch
                    JOIN "historias" h ON ch.id_historia = h.id_historia
                    WHERE h.visibilidad_historia = TRUE
                    GROUP BY h.id_saga, ch.id_historia
                ),

                -- 2. PASO DOS: Tomamos los promedios anteriores y sacamos el promedio de la saga
                calificacion_final_saga AS (
                    SELECT 
                        id_saga,
                        ROUND(COALESCE(AVG(promedio_historia), 0)) AS calificacion_saga
                    FROM promedio_por_historia -- ¡Aquí usamos el CTE de arriba!
                    GROUP BY id_saga
                ),


                -- 3. Agrupamos los hashtags por saga
                lista_hashtags AS (
                    SELECT 
                        hss.id_saga,
                        COALESCE(array_agg(hs.nombre_hashtag), '{}') AS hashtags
                    FROM hashtags_sagas hss
                    JOIN hashtags hs ON hss.id_hashtag = hs.id_hashtag
                    GROUP BY hss.id_saga
                )

                --4. Consulta principal: Unimos todo limpiamente
                SELECT 
                    s.id_saga, 
                    s.nombre_saga, 
                    s.descripcion_saga, 
                    COALESCE(lh.hashtags, '{}') AS hashtags, 
                    s.imagen_saga, 
                    s.codigo_usuario, 
                    u.nombre_usuario, 
                    COALESCE(cl.total_libros, 0) AS cantidad_historias,
                    COALESCE(vs.total_vistas, 0) AS vistas,
                    COALESCE(cfs.calificacion_saga, 0) AS calificacion 
                FROM saga s 
                JOIN "USUARIOS" u ON s.codigo_usuario = u.codigo_usuario
                LEFT JOIN total_libros_saga cl ON s.id_saga = cl.id_saga
                LEFT JOIN vistas_saga vs ON s.id_saga = vs.id_saga
                LEFT JOIN lista_hashtags lh ON s.id_saga = lh.id_saga
                LEFT JOIN calificacion_final_saga cfs ON s.id_saga = cfs.id_saga
                WHERE s.id_saga = %s
            """, (id_saga,))
            saga = cursor.fetchone()
            return saga
            