-- 1. Contamos las vistas de forma aislada
WITH vistas_historias AS (
    SELECT 
        id_historia, 
        COUNT(*) AS total_vistas -- Aquí contamos cuántas veces aparece cada historia en el historial
    FROM historial
    GROUP BY id_historia
),

-- 2. Calculamos el promedio de calificaciones de forma aislada
promedio_calificaciones AS (
    SELECT 
        id_historia, 
        ROUND(COALESCE(AVG(calificacion), 0)) AS promedio_calificacion
    FROM calificacion_historia
    GROUP BY id_historia
),

-- 3. Agrupamos los hashtags de forma aislada
hashtags_historias_cte AS (
    SELECT 
        hh.id_historia,
        COALESCE(array_agg(hs.nombre_hashtag), '{}') AS lista_hashtags
    FROM hashtags_historias hh
    JOIN hashtags hs ON hh.id_hashtag = hs.id_hashtag
    GROUP BY hh.id_historia
)

-- 4. CONSULTA PRINCIPAL (El plato fuerte: limpio y sin Group By gigante)
SELECT 
    h.id_historia, 
    h.nombre_historia, 
    h.descripcion_historia, 
    u.nombre_usuario,
    u.codigo_usuario, 
    u.foto_perfil_usuario,
    COALESCE(v.total_vistas, 0) AS vistas,
    COALESCE(c.promedio_calificacion, 0) AS calificacion, 
    h.visibilidad_historia,
    COALESCE(ht.lista_hashtags, '{}') AS hashtags,
    h.contenido_historia, 
    h.id_saga, 
    s.nombre_saga 
FROM "historias" h 
JOIN "USUARIOS" u ON h.codigo_usuario = u.codigo_usuario 
LEFT JOIN saga s ON h.id_saga = s.id_saga 
-- Unimos nuestros ingredientes usando su "llave" (id_historia)
LEFT JOIN vistas_historias v ON h.id_historia = v.id_historia
LEFT JOIN promedio_calificaciones c ON h.id_historia = c.id_historia
LEFT JOIN hashtags_historias_cte ht ON h.id_historia = ht.id_historia
WHERE h.publicada = TRUE
