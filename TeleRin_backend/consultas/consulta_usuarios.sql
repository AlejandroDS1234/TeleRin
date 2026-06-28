WITH seguidores AS (
	SELECT us.codigo_usuario_seguido,
	COUNT(*) AS seguidores
	FROM usuarios_seguidos us
	GROUP BY us.codigo_usuario_seguido
),

cantidad_historias AS (
	SELECT h.codigo_usuario,
	COUNT(*) AS cantidad_historias
	FROM historias h
	WHERE h.visibilidad_historia = TRUE
	GROUP BY h.codigo_usuario
)

SELECT u.codigo_usuario, u.nombre_usuario, 
u.descripcion_personal, u.foto_perfil_usuario,
COALESCE(se.seguidores, 0) AS seguidores,
COALESCE(ch.cantidad_historias, 0) AS cantidad_historias
FROM "USUARIOS" u
LEFT JOIN seguidores se
ON u.codigo_usuario = se.codigo_usuario_seguido
LEFT JOIN cantidad_historias ch
ON u.codigo_usuario = ch.codigo_usuario






