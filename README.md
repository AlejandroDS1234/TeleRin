# CONTEXTO COMPLETO DEL PROYECTO TELERIN (por ahora)

## 2. Estado actual revisado

Proyecto ubicado en:

`C:\Users\Usuario\Desktop\TeleRin`

Estado Git actual:

- Rama: `main`
- Working tree: limpio, sin cambios pendientes.
- Último commit: `475caf4 actualizacion`
- Fecha del último commit: 2026-06-22
- Últimos commits visibles:
  - `475caf4 actualizacion`
  - `f006bb5 terminado las cargas de elementos menos el princiopal al que e le debe poner a morris`
  - `279d96a animaciones de carga en las card de sagas y usuarios, animacion de carga en el boton de google al entrar`
  - `b9462f1 continuacion animaciones de carga, animacion de carga para card de historias lista`
  - `e673642 inicio de animaciones de carga, imagenes de partes de autenticacion con carga mas rapida`

El último commit fue pequeño. Tocó:

- `TeleRin_backend/db-init/TeleRin.sql`
- `TeleRin_frontend/TeleRinEND/src/assets/componentes/historias_cards.tsx`
- `TeleRin_frontend/TeleRinEND/src/assets/componentes/sagas_cards.tsx`

Cambios principales del último commit:

- Actualizó el dump SQL con fecha nueva.
- En `historias_cards.tsx` agregó `loading="lazy"` a imágenes de autor.
- En `sagas_cards.tsx` cambió una imagen horizontal de `size=card` a `size=reducida`.
- También agregó `loading="lazy"` a esa imagen.
- Conceptualmente, la última actualización va hacia optimización de carga visual: cargar imágenes de cards más livianas y diferidas.

## 3. Qué es TeleRin

TeleRin es una plataforma web social/literaria para crear, leer y organizar historias.

Conceptos principales:

- Usuarios: personas registradas que pueden iniciar sesión, editar perfil, seguir usuarios y crear contenido.
- Historias: textos largos creados con editor enriquecido.
- Sagas: agrupaciones de historias, como colecciones o series.
- Perfil: espacio del usuario con foto, descripción, historias y sagas.
- Seguidores/seguidos: sistema social para conectar usuarios.
- Historial: registro de historias vistas.
- Calificación: sistema simple de valoración de historias.
- Borradores: historias no publicadas o versiones guardadas temporalmente.
- Paletas: personalización visual del usuario.
- Idiomas: hay archivos JSON de idiomas y detección de idioma en backend.
- Morris: personaje/mascota visual usado en animaciones Rive y estados de carga.

La página no es solo CRUD. Tiene una identidad propia: una red social de lectura/escritura con estética artesanal, literaria y personalizable.

## 4. Stack tecnológico

Backend:

- Python
- Flask
- Blueprints Flask
- PostgreSQL
- psycopg2
- Flask-CORS
- APScheduler
- Pillow
- Google OAuth
- email-validator
- langdetect
- sentence-transformers, pandas, scikit-learn para recomendación

Frontend:

- React 19
- TypeScript
- Vite
- React Router 7
- TanStack React Query
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Heroicons
- Quill
- Rive
- Google OAuth
- React Hook Form
- Recharts

Infraestructura:

- Docker Compose
- Servicio backend `telerin`
- Servicio frontend `telerin_frontend`
- Servicio PostgreSQL `database`
- Puerto backend: `1240`
- Puerto frontend: `4210`
- PostgreSQL externo local: `5433:5432`

## 5. Estructura general

Backend:

`TeleRin_backend/app.py`

Es el punto de entrada Flask. Crea la app, configura CORS, registra blueprints y arranca un scheduler para borrar borradores viejos.

`TeleRin_backend/servidor/routes/`

Contiene rutas separadas por dominio:

- `rutas_autenticacion.py`: registro, login, Google login, cambio de contraseña, sesión.
- `rutas_perfil.py`: edición de perfil, foto de perfil, perfil de otro usuario.
- `rutas_historias.py`: crear, editar, leer, calificar, historial y borradores.
- `rutas_sagas.py`: crear sagas, listar sagas, ver saga y sus historias.
- `rutas_usuarios.py`: seguir, dejar de seguir, seguidores, seguidos.
- `rutas_archivos.py`: servir imágenes de perfil y sagas.
- `rutas_paleta.py`: paletas visuales.
- `rutas_aux_datos.py`: datos auxiliares como países/géneros.
- `rutas_listas_lectura.py`: existe pero está sin implementar.
- `rutas_pruebas.py`: pruebas.

`TeleRin_backend/servidor/services/`

Contiene lógica reutilizable:

- `servicios_sesion.py`: guardar sesión, obtener usuario actual, validar sesión.
- `servicios_autenticacion.py`: login, registro, Google auth, verificación de dispositivo/IP.
- `servicios_archivos.py`: validar imágenes, guardar versiones webp, miniaturas.
- `servicios_texto.py`: validaciones de contraseña, email, hashtags, color, idioma.
- `servicios_perfil.py`: validaciones de perfil.
- `servicios_historias.py`: validaciones de historias.
- `servicios_email.py`: envío de correos.
- `servicios_listas_lectura.py`: vacío o sin desarrollo real.

Frontend:

`TeleRin_frontend/TeleRinEND/src/`

Estructura principal:

- `App.tsx`: envuelve rutas con GoogleOAuthProvider y mensaje global.
- `main.tsx`: monta React, BrowserRouter y ScrollInicio.
- `rutas/`: rutas protegidas, rutas con sesión, rutas sin sesión.
- `pages/`: pantallas principales.
- `assets/componentes/`: cards, editor, modal, inputs, Morris, mensajes.
- `assets/botones_componentes/`: navbar, botones de login, registro, Google, seguir, cerrar sesión.
- `pages/api/`: funciones fetch por dominio.
- `pages/hook/`: hooks basados en React Query.
- `assets/idiomas/`: traducciones.
- `assets/imagenes/`, `assets/iconos/`, `assets/fonts/`, `assets/morris/`: recursos visuales.

## 6. Cómo funciona el backend

`app.py` crea Flask, usa `SECRET_KEY` desde entorno y configura CORS con:

`CORS_ALLOWED_ORIGINS`

Esto es bueno porque los secretos ya no están directamente quemados en `app.py`.

Registra todos los blueprints desde:

`servidor.routes.__init__.py`

Eso es una buena práctica porque centraliza el registro de rutas y evita tener `app.py` lleno de imports y `register_blueprint`.

También crea un scheduler:

`borrar_borradores_viejos()`

Esta función borra historias no publicadas con más de 3 días desde `fecha_actualizacion`.

Ventaja:

- Limpia borradores viejos automáticamente.

Desventaja:

- Corre dentro del mismo proceso Flask. En producción con varios workers o réplicas puede ejecutarse varias veces. Lo mejor a futuro sería moverlo a un worker o job separado.

## 7. Sesión y autenticación

La sesión actual mejoró frente a informes anteriores.

Ahora `guardar_sesion(correo)` consulta el `codigo_usuario` y guarda:

`session["codigo_usuario"]`

Eso es mejor que guardar el usuario completo.

Ventajas:

- La cookie de sesión queda más pequeña.
- Se evita tener datos desactualizados dentro de la sesión.
- `obtener_usuario()` consulta la DB y trae datos frescos.

Desventajas:

- Cada uso de `obtener_usuario()` abre conexión y consulta PostgreSQL.
- Sin pool de conexiones, esto puede pesar con muchos usuarios.

Autenticación clásica:

- Registro valida email y contraseña.
- Envía código de verificación por correo.
- Guarda datos temporales en sesión.
- Valida código.
- Crea usuario.

Autenticación Google:

- Verifica token con `google.oauth2.id_token`.
- Si el correo existe, inicia sesión.
- Si no existe, registra usuario con datos de Google.

Punto a revisar:

- En registro normal usa `uuid.uuid4()` para `codigo_usuario`.
- En registro Google todavía usa `random.randint(...) + parte del correo`.
- Mejor unificar ambos con UUID o NanoID.

## 8. Base de datos

Base principal:

PostgreSQL.

Archivo:

`TeleRin_backend/db-init/TeleRin.sql`

Tablas principales:

- `USUARIOS`
- `historias`
- `saga`
- `historial`
- `calificacion_historia`
- `usuarios_seguidos`
- `hashtags`
- `hashtags_historias`
- `hashtags_sagas`
- `listas_lectura`
- `lista_historia`
- `lista_usuario`
- `paises`
- `generos`
- `paletas`

Cosas buenas:

- Usa claves primarias.
- Tiene relaciones entre tablas.
- Tiene constraints únicos importantes.
- `usuarios_seguidos` evita duplicados entre seguido/seguidor.
- Hay triggers para actualizar `fecha_actualizacion`.
- El modelo ya separa usuarios, historias, sagas, historial, calificaciones y follows.

Riesgos actuales:

- El dump SQL contiene datos reales o sensibles: correos, hashes, google_id, contenido de prueba/real.
- Esto no conviene versionarlo así.
- Mejor separar:
  - `schema.sql`: estructura limpia.
  - `seed_dev.sql`: datos falsos.
  - backups reales: fuera de Git.

También hay varias FK `NOT VALID`, lo que significa que PostgreSQL tiene la constraint definida pero no validó todos los datos existentes. Puede ser útil al migrar, pero a largo plazo conviene validar o limpiar datos.

## 9. Acceso a DB

Archivo:

`servidor/core/db.py`

Funciones:

- `conectar()`
- `dato_en_db()`
- `insertar_db()`
- `actualizar_datos()`

`conectar()` abre una conexión nueva cada vez.

Ventaja:

- Simple de entender.
- Útil para desarrollo.

Desventaja:

- Para producción no escala bien.
- Cada endpoint puede abrir varias conexiones.
- Sin pool, PostgreSQL puede saturarse.

Mejor opción futura:

- `psycopg2.pool.ThreadedConnectionPool`
- O SQLAlchemy con pool.
- O una capa repository/service más explícita.

Los helpers `dato_en_db`, `insertar_db`, `actualizar_datos` construyen SQL con nombres de tabla/campo por string.

Ventaja:

- Reduce repetición.
- Permite avanzar rápido.

Desventaja:

- Riesgo si algún nombre de tabla/campo viene de entrada externa.
- Difícil de auditar.
- Menos claro que consultas explícitas.
- No parametriza identificadores SQL, solo valores.

Mejor opción:

- Usar listas blancas de tablas/campos.
- O reemplazar helpers genéricos en zonas sensibles por consultas explícitas.

## 10. Historias

Las historias son el contenido central.

Flujo:

- Se puede crear borrador.
- Se puede guardar borrador.
- Se puede publicar.
- Se puede editar.
- Se puede leer.
- Se puede calificar.
- Se guarda historial de lectura.

Contenido:

- El frontend usa Quill.
- El backend guarda contenido tipo JSON/Delta usando `psycopg2.extras.Json`.

Validaciones:

- Nombre no vacío.
- Nombre sin demasiados caracteres repetidos.
- Nombre no muy largo.
- Descripción no vacía.
- Historia con longitud mínima.
- Saga válida.
- ID válido y perteneciente al usuario al editar.

Punto delicado:

- Hay funciones que asumen que `obtener_usuario()` siempre devuelve usuario.
- Muchas rutas están protegidas con `@necesita("usuario", sesion_iniciada)`, pero algunas rutas públicas o semi públicas también llaman `usuario["codigo_usuario"]`.
- Si la sesión falta, puede romper con `NoneType`.

## 11. Sagas

Las sagas agrupan historias.

Crear saga:

- Requiere usuario.
- Recibe `nombre_saga`, `descripcion_saga`, imagen.
- Genera `id_saga` con formato:
  `-inicio-{codigo_usuario}-{nombre_saga}`
- Valida imagen.
- Guarda imagen original, card y reducida.
- Inserta saga en DB.
- Extrae hashtags de descripción.

Ventajas:

- Buen concepto para organizar historias.
- Tiene miniaturas optimizadas.
- Usa `loading="lazy"` en el frontend reciente.

Desventajas:

- El `id_saga` depende del nombre. Si el nombre cambia, el ID queda acoplado a texto humano.
- Puede haber problemas con caracteres raros, URLs largas o cambios de título.
- Mejor futuro: ID estable con UUID/slug separado.

## 12. Seguidores y usuarios

Archivo backend:

`rutas_usuarios.py`

Endpoints:

- `/api/seguidos/<codigo_usuario>`
- `/api/seguidores/<codigo_usuario>`
- `/api/siguiendo_usuario/<codigo_usuario>`
- `/api/seguir_usuario/<codigo_usuario>`
- `/api/dejar_seguir_usuario/<codigo_usuario>`

Funcionamiento:

- Consulta `usuarios_seguidos`.
- Devuelve usuarios y si el usuario actual ya los sigue.
- Permite seguir y dejar de seguir.

Riesgos:

- Estas rutas no tienen decorador `@necesita("usuario", sesion_iniciada)`.
- Pero internamente usan `obtener_usuario()` y luego `usuario["codigo_usuario"]`.
- Si no hay sesión, pueden romper.
- No se ve validación para evitar seguirse a sí mismo.
- No se ve validación clara de si el usuario objetivo existe.
- `seguir_usuario` usa `insertar_db`; si ya existe relación, puede saltar error por unique.

Mejor práctica:

- Proteger rutas con `@necesita`.
- Validar usuario objetivo.
- Evitar self-follow.
- Usar `INSERT ... ON CONFLICT DO NOTHING`.
- Devolver respuestas normalizadas.

## 13. Perfil

`rutas_perfil.py`

Permite:

- Actualizar nombre, descripción, país, género.
- Guardar foto de perfil.
- Ver perfil de otro usuario.

Cosas buenas:

- Hay validaciones específicas por campo.
- La foto se valida como imagen real.
- Se generan versiones `.webp` y reducidas.

Riesgos:

- `/api/perfil/<codigo_usuario>` usa `usuario_actual["codigo_usuario"]` sin comprobar si `usuario_actual` es `None`.
- En frontend la ruta está protegida, pero backend debería protegerse solo también.
- Hay `print()` de depuración.

Mejor práctica:

- Backend nunca debe depender solo de que frontend proteja.
- Agregar decorador o manejar `None`.

## 14. Archivos e imágenes

`servicios_archivos.py`:

- Valida que el archivo sea imagen real.
- Valida peso máximo.
- Valida dimensiones mínimas.
- Convierte a WebP.
- Genera versiones reducidas.

Para perfil:

- Original.
- `_reducida`.

Para saga:

- Original.
- `_card`.
- `_reducida`.

`rutas_archivos.py` sirve imágenes con `send_from_directory`.

Ventaja:

- Simple.
- Funciona en desarrollo.
- Ya hay optimización básica de tamaños.

Desventaja:

- En producción, Flask no debería servir mucha media.
- Cada imagen consume worker del backend.

Mejor futuro:

- Nginx para servir `/Fotos`.
- O almacenamiento externo tipo S3/Cloudflare R2.
- CDN para imágenes públicas.
- Cache-Control.

## 15. Frontend y rutas

`App.tsx`:

- Carga fondo global con textura de ruido.
- Envuelve rutas en GoogleOAuthProvider.
- Renderiza componente global de mensajes/redirección.

`main.tsx`:

- Usa `BrowserRouter`.
- Usa `ScrollInicio`.
- Monta `App`.

Rutas:

`rutasIngresar.tsx` define:

Rutas sin sesión:

- `/`
- `/registrarse`
- `/iniciar_sesion`
- `/olvide_mi_contrasena`
- `/codigo_verificacion`
- `/cambiar_contraseña`

Rutas con sesión:

- `/inicio`
- `/perfil`
- `/buscar`
- `/editor`
- `/historia/:id_historia`
- `/sagas/:id_saga`
- `/admin`
- `/consultas`
- `/editar_historia/:id_historia`
- `/perfil/:codigo_usuario`

`RutaProtegida` hace fetch a una URL de verificación, por ejemplo `/api/usuario`.

Ventaja:

- Centraliza protección de rutas.
- Evita duplicar verificación en cada página.

Desventaja:

- Muestra texto temporal: “Verificando acceso... poner a morris cargando”.
- El propio comentario indica que falta poner Morris como loader.
- El frontend protege, pero backend debe proteger también.

## 16. React Query

El proyecto usa TanStack React Query.

Esto aparece en hooks por dominio:

- Historias
- Sagas
- Usuario
- Países
- Géneros

Ventaja:

- Cachea datos.
- Maneja loading/error.
- Facilita invalidaciones.
- Evita repetir fetch manual.

Desventaja:

- Si las `queryKey` no son consistentes, se cachean datos incorrectos.
- Si se mezcla con fetch manual sin patrón, la app se vuelve difícil de mantener.

Recomendación:

- Seguir migrando llamadas API a hooks claros.
- Normalizar nombres:
  - `apiX.ts`
  - `hookX.ts`
  - `queryKey` estable.

## 17. Estilo visual y concepto de diseño

TeleRin tiene una identidad visual marcada:

- Colores cálidos y literarios.
- Texturas tipo papel/ruido.
- Cards de saga con aspecto de libro o cubierta.
- Historias con tarjetas cuadradas.
- Uso de bordes dobles, dotted, tonos crema/verde/marrón suave.
- Uso de Morris como personaje animado.
- Uso de Rive para animaciones.
- Botones y navegación con iconos.

Principio de la página:

TeleRin debe sentirse como una biblioteca social creativa, no como dashboard corporativo. La experiencia debe mezclar lectura, creación y perfil social.

Buen camino:

- Las cards tienen personalidad.
- La app ya usa skeletons/cargas.
- Se está optimizando carga de imágenes.
- El sistema de sagas refuerza identidad literaria.

Cuidado:

- No convertir todo en cards anidadas.
- Evitar que los efectos visuales tapen legibilidad.
- Priorizar lectura cómoda para historias largas.
- Mantener consistencia entre cards de historia, saga y usuario.

## 18. Cómo programa el dueño del proyecto

Patrones observados:

- Separa frontend y backend.
- Tiende a crear módulos por dominio.
- Usa nombres en español.
- Prefiere avanzar funcionalmente y luego optimizar.
- Usa componentes personalizados.
- Está incorporando React Query progresivamente.
- Usa validaciones backend propias.
- Usa Docker para entorno completo.
- Le importa mucho la experiencia visual y las animaciones.
- Le preocupa la escalabilidad futura.
- Está empezando a corregir problemas serios: por ejemplo la sesión ya no guarda usuario completo, ahora guarda `codigo_usuario`.

Fortalezas:

- Buena intuición de producto.
- Separación clara por dominios.
- Uso de tecnologías razonables.
- Hay estructura real de red social/literatura.
- Ya hay Docker y PostgreSQL.
- Está mejorando rendimiento visual.
- Hay intención de modularidad.

Debilidades actuales:

- Falta normalización de respuestas API.
- Falta protección uniforme en backend.
- Hay prints y logs temporales.
- Algunos helpers son demasiado genéricos.
- Falta pool DB.
- Falta test automatizado.
- El README raíz está desactualizado.
- Hay datos sensibles en dump SQL.
- Algunas rutas asumen sesión aunque no estén decoradas.

## 19. Estado de calidad actual

El proyecto está en fase de desarrollo avanzado, no producción.

Ya tiene:

- Backend modular.
- Frontend funcional y con rutas.
- Sistema de usuarios.
- Login tradicional y Google.
- Sesión mejorada.
- Historias.
- Sagas.
- Perfil.
- Seguidores.
- Borradores.
- Calificaciones.
- Historial.
- Imágenes optimizadas.
- Docker Compose.
- Base PostgreSQL.

Todavía necesita antes de producción:

- Pruebas.
- Limpieza de secretos/datos reales.
- Build y lint verdes.
- Pool DB.
- Servidor WSGI real.
- Nginx o CDN para imágenes.
- CSRF/cookies endurecidas.
- Respuestas API consistentes.
- Manejo de errores más sólido.

No se ejecutaron pruebas en esta revisión. Solo se leyó y analizó el código.

## 20. Seguridad

Cosas buenas:

- `SECRET_KEY`, DB y correo vienen desde variables de entorno en Docker.
- Contraseñas se hashean con Werkzeug.
- Google token se verifica con librería oficial.
- Ya no se guarda usuario completo en sesión.

Riesgos:

- Cookie de sesión Flask + `credentials: include` sin protección CSRF clara.
- Dump SQL con datos reales/sensibles.
- Google registration usa código basado en random + parte del correo.
- IP/dispositivo usa `socket.gethostbyname(socket.gethostname())`, que en Docker no representa IP real del cliente.
- Algunas rutas mutadoras no tienen decorador de sesión.
- HTML/Delta de editor debe tratarse con cuidado para evitar XSS si se renderiza HTML.

Mejoras recomendadas:

- CSRF token o validación fuerte de Origin/Referer.
- Cookies `HttpOnly`, `SameSite`, `Secure` en producción.
- Sacar datos reales del SQL versionado.
- Rate limiting en login/códigos/correo.
- Usar `secrets` o UUID para identificadores sensibles.
- Proteger rutas de seguidores.

## 21. Rendimiento

Mejoras ya visibles:

- Imágenes WebP.
- Versiones reducidas.
- `loading="lazy"`.
- Uso de React Query.
- Borradores viejos se limpian.

Cuellos de botella:

- Flask dev server en `app.run(debug=True)`.
- Sin pool de conexiones.
- Imágenes servidas por Flask.
- Consultas con agregaciones y joins sin paginación consistente.
- Sin Redis/cache.
- Recomendación con `sentence-transformers` puede ser pesada si se ejecuta en request.

Mejoras futuras:

- Gunicorn/uWSGI.
- Pool DB.
- Índices medidos con `EXPLAIN ANALYZE`.
- Redis para cache/sesiones/rate limit.
- Nginx/CDN para imágenes.
- Workers para tareas pesadas.
- Recomendaciones offline.

## 22. Recomendación ML

Existe carpeta:

`TeleRin_backend/recomendar/`

Usa herramientas como:

- pandas
- scikit-learn
- sentence-transformers

Concepto:

- Posible sistema de recomendación de historias/sagas usando embeddings/similitud.

Cuidado:

- Esto puede consumir mucha RAM/CPU.
- No conviene calcular embeddings grandes dentro de cada request.
- Mejor hacer recomendaciones offline y guardar resultados.

## 23. README y documentación

`README.md` raíz está desactualizado.

Describe estructura antigua con:

- `static`
- `templates`
- `react`

Pero el proyecto actual usa:

- `TeleRin_backend`
- `TeleRin_frontend/TeleRinEND`
- Blueprints Flask
- Vite React

Debe actualizarse para evitar confusión.

También existen documentos útiles:

- `arquitectura_telerin.txt`: visión extensa de escalabilidad.
- `revision_completa_telerin.txt`: auditoría vieja. Algunas partes ya no aplican.
- `cambios.txt`: revisión de seguridad anterior.

Importante:

`revision_completa_telerin.txt` decía que `config.py` tenía sintaxis inválida. En el código actual `config.py` está vacío, así que ese problema específico ya no aplica.

También decía que la sesión guardaba usuario completo. Actualmente ya guarda `codigo_usuario`, así que esa mejora ya fue hecha.

## 24. Prioridades actuales recomendadas

Prioridad 1: validar estado real de compilación

- Ejecutar `npm run build`.
- Ejecutar `npm run lint`.
- Ejecutar backend para confirmar arranque.
- No asumir que compila solo por lectura.

Prioridad 2: proteger backend

- Agregar `@necesita("usuario", sesion_iniciada)` a rutas de seguidores.
- Manejar `obtener_usuario() is None`.
- Evitar self-follow.
- Validar usuario objetivo.
- Usar `ON CONFLICT DO NOTHING`.

Prioridad 3: limpiar seguridad

- Separar SQL de schema y datos reales.
- Sacar datos sensibles del repo.
- Endurecer cookies.
- Añadir CSRF o protección equivalente.
- Rate limit en login y códigos.

Prioridad 4: normalizar API

Definir una forma común:

```json
{
  "ok": true,
  "data": {},
  "message": {
    "text": "Mensaje",
    "type": "success"
  },
  "redirect": null
}
Actualmente hay respuestas con formas mezcladas:
{mensaje, tipo}
{mensaje: {mensaje, tipo}}
{redirigir, mensaje_redirigir}
listas directas
strings directos
Prioridad 5: rendimiento base
Pool DB.
Gunicorn.
Nginx para imágenes.
Paginación real.
Índices en relaciones frecuentes.
Prioridad 6: documentación
Actualizar README.
Documentar endpoints.
Documentar variables .env.
Documentar flujo Docker.
25. Principio general para continuar el proyecto
No reescribir todo.
La mejor estrategia es:
Mantener Flask + React.
Ordenar contratos.
Proteger rutas.
Limpiar seguridad.
Mejorar rendimiento.
Agregar tests.
Luego seguir con funciones nuevas.
No conviene meter microservicios todavía.
No conviene cambiar de lenguaje todavía.
No conviene meter NoSQL solo por moda.
Sí conviene preparar arquitectura para crecer:
PostgreSQL como verdad principal.
Redis más adelante para cache/sesiones/rate limit.
Object storage/CDN para imágenes.
Workers para tareas pesadas.
Recomendaciones offline.
```
