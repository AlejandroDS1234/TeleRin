--
-- PostgreSQL database dump
--

\restrict WNbnNsM7QdXLCt8GVUDnQpEHQMKKhboTraubZc14LS9I8dlggpYsy0naPhKhOz4

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg13+1)
-- Dumped by pg_dump version 18.1

-- Started on 2026-06-18 00:04:00

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 236 (class 1255 OID 41263)
-- Name: actualizar_fecha_actualizacion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizar_fecha_actualizacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	NEW.fecha_actualizacion = NOW();
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.actualizar_fecha_actualizacion() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16385)
-- Name: USUARIOS; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."USUARIOS" (
    nombre_usuario character varying(100) CONSTRAINT usuarios_nombre_not_null NOT NULL,
    correo_usuario character varying(100) CONSTRAINT usuarios_correo_not_null NOT NULL,
    "contraseña_usuario" character varying(255),
    id_pais integer DEFAULT 0 NOT NULL,
    id_genero integer DEFAULT 0 NOT NULL,
    descripcion_personal text,
    foto_perfil_usuario character varying(225) DEFAULT 'predefinido.webp'::character varying NOT NULL,
    codigo_usuario character varying(225) NOT NULL,
    id_paleta integer DEFAULT 1 NOT NULL,
    idioma_usuario text DEFAULT 'spanish'::text NOT NULL,
    ip_usuario character varying(225)[],
    google_id character varying,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."USUARIOS" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16395)
-- Name: calificacion_historia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calificacion_historia (
    codigo_usuario character varying(100) CONSTRAINT calificacion_historia_correo_usuario_not_null NOT NULL,
    id_historia character varying NOT NULL,
    calificacion integer NOT NULL
);


ALTER TABLE public.calificacion_historia OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16403)
-- Name: generos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.generos (
    id_genero integer NOT NULL,
    nombre_genero text NOT NULL
);


ALTER TABLE public.generos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16410)
-- Name: hashtags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hashtags (
    nombre_hashtag character varying NOT NULL,
    id_hashtag integer NOT NULL
);


ALTER TABLE public.hashtags OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16417)
-- Name: hashtags_historias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hashtags_historias (
    id_historia character varying NOT NULL,
    id_hashtag integer NOT NULL
);


ALTER TABLE public.hashtags_historias OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16424)
-- Name: hashtags_id_hashtag_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hashtags_id_hashtag_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hashtags_id_hashtag_seq OWNER TO postgres;

--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 224
-- Name: hashtags_id_hashtag_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hashtags_id_hashtag_seq OWNED BY public.hashtags.id_hashtag;


--
-- TOC entry 225 (class 1259 OID 16425)
-- Name: hashtags_sagas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hashtags_sagas (
    id_saga character varying NOT NULL,
    id_hashtag integer NOT NULL
);


ALTER TABLE public.hashtags_sagas OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16432)
-- Name: historial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial (
    id_historia character varying NOT NULL,
    tiempo_vista timestamp without time zone NOT NULL,
    codigo_usuario character varying NOT NULL
);


ALTER TABLE public.historial OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16440)
-- Name: historias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historias (
    nombre_historia character varying(100),
    descripcion_historia text,
    visibilidad_historia boolean DEFAULT false,
    id_saga text,
    id_historia text NOT NULL,
    contenido_historia jsonb,
    codigo_usuario character varying NOT NULL,
    idioma text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    publicada boolean DEFAULT false NOT NULL,
    borrador_historia jsonb
);


ALTER TABLE public.historias OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 33024)
-- Name: lista_historia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lista_historia (
    id_lista character varying NOT NULL,
    id_historia character varying NOT NULL
);


ALTER TABLE public.lista_historia OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 33046)
-- Name: lista_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lista_usuario (
    id_lista character varying NOT NULL,
    codigo_usuario character varying NOT NULL
);


ALTER TABLE public.lista_usuario OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 33013)
-- Name: listas_lectura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listas_lectura (
    id_lista character varying NOT NULL,
    nombre_lista text NOT NULL,
    visibilidad boolean NOT NULL
);


ALTER TABLE public.listas_lectura OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16451)
-- Name: paises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paises (
    id_pais integer NOT NULL,
    nombre_pais character varying(100) NOT NULL
);


ALTER TABLE public.paises OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16456)
-- Name: paletas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paletas (
    id_paleta integer NOT NULL,
    color1 character varying NOT NULL,
    color2 character varying NOT NULL,
    color3 character varying NOT NULL,
    color_letra character varying,
    color_letra_fondo character varying,
    codigo_usuario character varying
);


ALTER TABLE public.paletas OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16465)
-- Name: paletas_id_paleta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paletas_id_paleta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paletas_id_paleta_seq OWNER TO postgres;

--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 230
-- Name: paletas_id_paleta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paletas_id_paleta_seq OWNED BY public.paletas.id_paleta;


--
-- TOC entry 231 (class 1259 OID 16466)
-- Name: saga; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saga (
    nombre_saga character varying(100) CONSTRAINT saga_nombre_not_null NOT NULL,
    codigo_usuario character varying CONSTRAINT saga_correo_usuario_not_null NOT NULL,
    imagen_saga character varying(225) NOT NULL,
    id_saga text NOT NULL,
    descripcion_saga text NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.saga OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 41272)
-- Name: usuarios_seguidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios_seguidos (
    codigo_usuario_seguido character varying NOT NULL,
    codigo_usuario_seguidor character varying NOT NULL,
    fecha_seguimiento timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.usuarios_seguidos OWNER TO postgres;

--
-- TOC entry 3353 (class 2604 OID 16476)
-- Name: hashtags id_hashtag; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags ALTER COLUMN id_hashtag SET DEFAULT nextval('public.hashtags_id_hashtag_seq'::regclass);


--
-- TOC entry 3358 (class 2604 OID 16477)
-- Name: paletas id_paleta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paletas ALTER COLUMN id_paleta SET DEFAULT nextval('public.paletas_id_paleta_seq'::regclass);


--
-- TOC entry 3553 (class 0 OID 16385)
-- Dependencies: 219
-- Data for Name: USUARIOS; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."USUARIOS" (nombre_usuario, correo_usuario, "contraseña_usuario", id_pais, id_genero, descripcion_personal, foto_perfil_usuario, codigo_usuario, id_paleta, idioma_usuario, ip_usuario, google_id, fecha_registro) FROM stdin;
TeleRin	telerincontac@gmail.com	scrypt:32768:8:1$eXrvSKpA4cqRbbzN$ed5718c308ba7c9fb664326abbb86db84bf9650922eefdb4a986ea15b74ae058a09754518616a849fab85a533b258dc122563e79f19c4795ac1f035381cb9d49	37	0	El dueño	338603teler_perfil.webp	338603teler	1	spanish	{scrypt:32768:8:1$2jmMLBhNUk6fVRg1$79eb1a697e90e9fa64ed344387199b2021443d55bf835689a0f61c45be4ccdba0c7f524e5f23b10484f135b5bffe4dc6210d518376bdf655ac2f2f3f1b6ab267,scrypt:32768:8:1$FrcTZttagsjHb7Y0$df14a3182c1cff9a62f18350bb6dba6f1803ca7577e65c496ea3362a9d5f6bc91fc55befbb1e04d609cbd33ac83a159b18d9c9cdb30c3b52c6cd3d296171d78d}	115604399927658300303	2026-06-03 05:06:08.59742
Sonic99DX	lovichabdiel@gmail.com	\N	132	1	vivs el polnito	121384lovic_perfil.webp	121384lovic	1	spanish	{scrypt:32768:8:1$yJGF2OwUhkqeceX6$53de68e3818cc1f08c8b2fc02ee673d71563e2e7849fa657ed616e16c611702f18bcd08201d89f716aab76d4ac0a19f4c52926083f3225c293d8ffbdbe7f8e2a,scrypt:32768:8:1$ZO2TpK3oHxKJwKmx$a6de85f874f37b017a547b03ec541f114ba72df2473cd00c3c031b811d24ec1ec4fea18ace71eb092750104f1b2e04226db3e63128a2a8d1cfdf1e44e691c4df}	110618687854581094938	2026-06-03 05:06:08.59742
gamer _20	emanuelbanol4@gmail.com	\N	37	2	Beta tester	432028emanu_perfil.webp	432028emanu	1	spanish	{scrypt:32768:8:1$OWUtrJuE1DLyL9Zu$35e822df402686166318384dcc0a8c264feb8e5ea988360086d68b29079b4fc91fbf3c068bdddc83ece60c628216db846cd986a64cd0e201eee9218a4fabd9b6}	117197469088074844395	2026-06-03 05:06:08.59742
the crow	magiahh67@gmail.com	scrypt:32768:8:1$t1uhEHtkQ3jQixc4$f90c4be6ca391a7e7e2c80500066b04a5d0667aa2f89d431d3f669c062118f7977ec6458f77e12bb4d9774474fadc8d0cc472542116dcc1cc99495c5ba202f56	0	0	\N	876148magia_perfil.webp	876148magia	1	spanish	{scrypt:32768:8:1$QwI5Qr672Dn7Q7gZ$a4914d0f937fe4d5f97515ebee9dec572f8cf31cbff264249d01fb2efacf866bfd687ff616d97667c4107d1ca41e76a34581b9cf57ad37996d90a5250cff98a0,scrypt:32768:8:1$i69TzAfN1YOHm2pu$1b1b3132618e3983458c4f7cc97f2d4217404d669f3ccdecc6cc92db88fb3eddac7814efbcee1e44bf555f2ccfef325107699f539c386d2d14be3da4f38ab6f8,scrypt:32768:8:1$3HLeLDrXysIGLG8n$9dda585f4d25fa8bdff4b0fff108e685fc426c134bf9d17d09dca4c2e6bc5de0a16ff00941999384797f8c7f6d520d1c9f24f95dc1d42941e0b65ab37192c2a3}	\N	2026-06-03 05:06:08.59742
pussy destroyer	j.f.m.b1106@gmail.com	\N	103	1	follabuelas5000	499342j.f.m_perfil.webp	499342j.f.m	1	spanish	{scrypt:32768:8:1$ZV8W5POOP3IVOLkJ$76db29340c3c3f3e7d66ff16e458b8f9e2e23d443ad04ab5476720a97bfcdb11347b645a9ffa606420bc8717e1349389c6a7757de23de1df45b5086c460a9ebc}	106675070339678151477	2026-06-11 19:20:16.480293
Alejo	ducuarasatizabalalejandro@gmail.com	scrypt:32768:8:1$SjcQvnQFyfQReDko$be836f9dad7e7294711a2ad6d6f185003c4bca4f468e09d9920607e9b4ab8c01c68a8ee06719e2b6e7f411df6f6ec4c4aa52e8393b1aed52e98e5650d336cae8	52	1	Programador	765874ducua_perfil.webp	765874ducua	1	spanish	{scrypt:32768:8:1$4vTYVM7vvkp38AI2$35bd867a701493578b18e71cd746e976e74c64a183ace9d7f08546dffcc928036253de0faee288735a7e6fab4e5e897c08427a317b9d8840427943f8b90e2358,scrypt:32768:8:1$AQP9EmnYvJlarvMe$e2f40e9765f3372eb9ecbc7771df05aa1981a56b82e2001e36c9cdd4f29ad16f7f50a0617b1208be77b23f0e908ad60989f528af1e3b2b0572777f7e1212df6b,scrypt:32768:8:1$lXAbm45x8PBCGPHJ$04d8707e530d24718c96894749086d8879f6b84c779fc24530b5b76ffd594a11dd55860902116ab6de2ccad0b2420e605ec0cb233e56ed90aed920fb13a3a499,scrypt:32768:8:1$eJRZEcx9QZcr7jYh$12c2f5f626c8aae59b80e6455101af864135e9156772b5092331977dbba40a765dba05b0fd1e0c8563cac5ae08bd078f3a33cf857a4e1458c0a4397304761815,scrypt:32768:8:1$RfmPFD4kcm6iUUPe$778cd1f17f7422ca84c79b3748052283d35a9f8cb87aa659a47d124a324bd789ba6776fbfcbc3e0670173534dc620ef74bd81cb1633b7c2eba22672f806d12d6,scrypt:32768:8:1$GqDgGUVlmnjvJ6eA$98363b0f13cc53e1fc4bde7ba115fa4e86bb33ef3b8b3f701f5ed6d1a9dd9e598f4f0bdaf10a461100b80cdb7f8e9daea60b6e36443734260a335273974e1a52,scrypt:32768:8:1$EIKg2DpvivoxPtT4$4f02b3ad1bd179daf6aa2a0db62a62863f7e2b5aa5a5b4cf6fbdc98378954c69abb806f0cee09bb6f97f38bde99fd4045622c9e7bb240939ab0e8953c7821736,scrypt:32768:8:1$QGv9vb8FaFJ0ZYer$655f51fdd887d6c92894e22cac66d8c496c0a84d9a449d046db2209cc57ef6e5d2c2751717f4f9d2329dbc98f3c740f9654df3e052c9e0e4c6dfe51c60cf0d5f,scrypt:32768:8:1$m2JCyLKJi7Q2edNR$bf8a61ffdac8b0bcb287b923fa4ecaa0c76d96108935b190575dc549c93bf467e00f74478c050c85d025ec0babda220b71a54b1913fcba7e9e1227ab5bbef8f0,scrypt:32768:8:1$rtsqlnmNuBqGZs0S$56fb954f9b38ecfb1782e678238955c0f45ef9d4462fa32f1101dd90da8525710c08d7508f9549023276ec1ea4cf39d0c17883921cc5c62f8d7828642540d724,scrypt:32768:8:1$qgnAurlksNzmvwit$f8b1c2c4f0fee6d800469cdf4b61547fe5301347982208a11da9ae79f9b7a4590a2a7c45551bdb5aadf971d17c76d5c6828d31dbc691dc89615ad6cfc0971e65,scrypt:32768:8:1$WB5xXEj6dEGkfXBn$d0aa371ca037da12e8b704f7277c25186749590285d379f694072ba2c404f104ede2cab41eceb80b20d3b47a8922e2bdf141f87b073b7c0c2f8c6326bcf27530,scrypt:32768:8:1$CEjT2hONuqLfb2uK$9f83bc24c1460ec6e6a28d80e8ef7d352a305abe9044cf0473570efc39d0296a52b9e603d19442201f3161e301b67d7560ce7b9174b189f8d2bb9e5dc8fda785}	112170301094736581888	2026-06-03 05:06:08.59742
\.


--
-- TOC entry 3554 (class 0 OID 16395)
-- Dependencies: 220
-- Data for Name: calificacion_historia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calificacion_historia (codigo_usuario, id_historia, calificacion) FROM stdin;
499342j.f.m	-historia-765874ducua--El eco en el viento de palmira	2
765874ducua	-historia-765874ducua--prueba de mensaje redirigir	1
121384lovic	-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 1	2
121384lovic	-historia-765874ducua--El eco en el viento de palmira	3
765874ducua	-historia-765874ducua--461802	3
765874ducua	-historia-876148magia--inicio-876148magia-Saga de testeo-Las noches boca arriba 2	1
765874ducua	-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 4	3
876148magia	-historia-876148magia--inicio-876148magia-Saga de testeo-Las noches boca arriba	1
765874ducua	-historia-765874ducua--El eco en el viento de palmira	3
338603teler	-historia-765874ducua--El eco en el viento de palmira	2
876148magia	-historia-876148magia--inicio-876148magia-Hamlet-elecciones	3
876148magia	-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 1	3
499342j.f.m	-historia-765874ducua--461802	3
\.


--
-- TOC entry 3555 (class 0 OID 16403)
-- Dependencies: 221
-- Data for Name: generos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.generos (id_genero, nombre_genero) FROM stdin;
1	Masculino
2	Femenino
0	Undefined
\.


--
-- TOC entry 3556 (class 0 OID 16410)
-- Dependencies: 222
-- Data for Name: hashtags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hashtags (nombre_hashtag, id_hashtag) FROM stdin;
\.


--
-- TOC entry 3557 (class 0 OID 16417)
-- Dependencies: 223
-- Data for Name: hashtags_historias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hashtags_historias (id_historia, id_hashtag) FROM stdin;
\.


--
-- TOC entry 3559 (class 0 OID 16425)
-- Dependencies: 225
-- Data for Name: hashtags_sagas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hashtags_sagas (id_saga, id_hashtag) FROM stdin;
\.


--
-- TOC entry 3560 (class 0 OID 16432)
-- Dependencies: 226
-- Data for Name: historial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial (id_historia, tiempo_vista, codigo_usuario) FROM stdin;
-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 4	2026-06-04 22:31:12	876148magia
-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 5	2026-06-03 05:56:43	765874ducua
-historia-876148magia--el quijote de la mancha	2026-06-05 22:21:46	765874ducua
-historia-765874ducua--461802	2026-06-11 19:21:57	499342j.f.m
-historia-765874ducua--El eco en el viento de palmira	2026-06-11 20:00:41	499342j.f.m
-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 3	2026-06-03 07:49:45	876148magia
765874ducua-365074d1-4f8c-43c7-90f3-c44cdf490797	2026-06-12 19:35:23	765874ducua
-historia-876148magia--inicio-876148magia-Saga de testeo-Las noches boca arriba 2	2026-06-03 08:17:08	876148magia
-historia-876148magia--inicio-876148magia-Saga de testeo-jajajaja	2026-06-03 08:50:17	876148magia
-historia-765874ducua--prueba de mensaje redirigir	2026-06-01 12:30:03	432028emanu
-historia-765874ducua--prueba de mensaje redirigir	2026-06-03 08:50:49	765874ducua
-historia-765874ducua--la venganza de las zorra 2.0	2026-06-14 14:15:46	765874ducua
-historia-876148magia--inicio-876148magia-Saga de testeo-Las noches boca arriba	2026-06-03 08:51:40	765874ducua
-historia-876148magia--inicio-876148magia-Saga de testeo-Las noches boca arriba	2026-06-03 08:55:17	876148magia
-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 3	2026-06-03 19:43:39	765874ducua
-historia-876148magia--inicio-876148magia-Saga de testeo-poema no2	2026-06-04 16:42:07	765874ducua
-historia-876148magia--inicio-876148magia-Hamlet-elecciones	2026-06-04 22:13:05	876148magia
-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 1	2026-06-04 22:15:00	876148magia
-historia-765874ducua--El eco en el viento de palmira	2026-06-14 15:19:20	765874ducua
765874ducua-ca886ff0-ebbb-4436-85f7-cfd42a99015c	2026-06-14 21:33:34	765874ducua
-historia-765874ducua--461802	2026-06-15 13:39:26	765874ducua
-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 1	2026-06-02 12:05:33	765874ducua
-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 4	2026-06-02 12:09:41	765874ducua
-historia-876148magia--inicio-876148magia-Saga de testeo-Las noches boca arriba 2	2026-06-03 03:56:43	765874ducua
\.


--
-- TOC entry 3561 (class 0 OID 16440)
-- Dependencies: 227
-- Data for Name: historias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historias (nombre_historia, descripcion_historia, visibilidad_historia, id_saga, id_historia, contenido_historia, codigo_usuario, idioma, fecha_creacion, fecha_actualizacion, publicada, borrador_historia) FROM stdin;
prueba de mensaje redirigir	esta es una historia 	t		-historia-765874ducua--prueba de mensaje redirigir	{"ops": [{"insert": "Esta va a ser la 100% primera historia actualizada"}, {"insert": "\\n", "attributes": {"header": 1}}, {"insert": "actualizada 3.0 "}, {"insert": "\\n", "attributes": {"header": 2}}, {"insert": "Una tarde de junio, mientras el sol comenzaba a esconderse tiñendo el cielo de tonos dorados y violetas, una ráfaga inusualmente cálida hizo sonar sus jazmines como si fueran campanitas. Elena cerró los ojos y prestó atención. El viento le susurró sobre una semilla de oro brillante que había caído hacía siglos en la antigua "}, {"insert": "Hacienda El Paraíso", "attributes": {"bold": true}}, {"insert": ", custodiada por el espíritu del lugar.\\nIntrigada y sintiendo una llamada irresistible, Elena cerró su vivero, tomó su bicicleta y emprendió el camino hacia la zona rural de El Cerrito. El trayecto le tomó alrededor de 45 minutos pedaleando entre paisajes de ensueño. Al llegar, la brisa de la tarde la guio hasta un viejo árbol de samán, justo detrás de la casa colonial.\\nAllí, medio enterrada entre las raíces y brillando con la luz del atardecer, encontró una semilla del tamaño de un limón. En cuanto la tomó entre sus manos, una suave melodía resonó en su mente: la semilla era un fragmento de la naturaleza que guardaba los recuerdos y anhelos de aquellos que habían amado profundamente en esas tierras.\\nDe repente, la semilla comenzó a germinar rápidamente, desenredando una brillante enredadera dorada que ascendió por el tronco del samán. Las flores de esta planta emitían una luz cálida y reconfortante. Desde ese día, el viento de la región se volvió más suave y perfumado.\\nElena comprendió que su misión era proteger aquel tesoro. Regresaba cada fin de semana a regar la planta y a escuchar los cuentos que el viento le traía. Y así, la leyenda del Valle del Cauca creció; cuentan los lugareños que si te sientas bajo el gran samán de El Paraíso al atardecer y cierras los ojos, puedes escuchar las voces del pasado susurrando palabras de amor.\\n"}]}	765874ducua	spanish	2026-06-03 04:32:45.639038	2026-06-18 04:15:56.274549	t	{"ops": [{"insert": "Esta va a ser la 100% primera historia actualizada"}, {"insert": "\\n", "attributes": {"header": 1}}, {"insert": "actualizada 3.0 "}, {"insert": "\\n", "attributes": {"header": 2}}, {"insert": "Una tarde de junio, mientras el sol comenzaba a esconderse tiñendo el cielo de tonos dorados y violetas, una ráfaga inusualmente cálida hizo sonar sus jazmines como si fueran campanitas. Elena cerró los ojos y prestó atención. El viento le susurró sobre una semilla de oro brillante que había caído hacía siglos en la antigua "}, {"insert": "Hacienda El Paraíso", "attributes": {"bold": true}}, {"insert": ", custodiada por el espíritu del lugar.\\nIntrigada y sintiendo una llamada irresistible, Elena cerró su vivero, tomó su bicicleta y emprendió el camino hacia la zona rural de El Cerrito. El trayecto le tomó alrededor de 45 minutos pedaleando entre paisajes de ensueño. Al llegar, la brisa de la tarde la guio hasta un viejo árbol de samán, justo detrás de la casa colonial.\\nAllí, medio enterrada entre las raíces y brillando con la luz del atardecer, encontró una semilla del tamaño de un limón. En cuanto la tomó entre sus manos, una suave melodía resonó en su mente: la semilla era un fragmento de la naturaleza que guardaba los recuerdos y anhelos de aquellos que habían amado profundamente en esas tierras.\\nDe repente, la semilla comenzó a germinar rápidamente, desenredando una brillante enredadera dorada que ascendió por el tronco del samán. Las flores de esta planta emitían una luz cálida y reconfortante. Desde ese día, el viento de la región se volvió más suave y perfumado.\\nElena comprendió que su misión era proteger aquel tesoro. Regresaba cada fin de semana a regar la planta y a escuchar los cuentos que el viento le traía. Y así, la leyenda del Valle del Cauca creció; cuentan los lugareños que si te sientas bajo el gran samán de El Paraíso al atardecer y cierras los ojos, puedes escuchar las voces del pasado susurrando palabras de amor.\\n"}]}
Capítulo 2	La escalada vertical del muro de piedra	t	-inicio-765874ducua-La Saga de Cientopitos	-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 2	{"ops": [{"insert": "Capítulo 2: La escalada vertical del muro de piedra"}, {"insert": "\\n", "attributes": {"header": 1}}, {"insert": "La tragedia golpeó una tarde calurosa de primavera. Mientras Cientopitos inspeccionaba una corteza de pino, un crujido lúgubre resonó sobre sus cabezas. De la oscuridad de una grieta en lo alto del viejo muro de ladrillos, descendió una figura de pesadilla: la Araña Sombra. Con un movimiento fulminante, el arácnido atrapó al bicho bolita entre sus quelíceros y lo arrastró hacia las alturas de la pared de piedra para convertirlo en su festín.\\nAl escuchar los gritos de su amigo, Cientopitos sintió que la adrenalina recorría sus cien extremidades. Ajustó sus antenas hacia el frente, clavó sus ganchos delanteros en la rugosa superficie del muro y comenzó un ascenso vertical que desafiaba la gravedad. El muro era un territorio hostil e infinito a escala de insecto:\\n"}, {"insert": "Las corrientes de aire:", "attributes": {"bold": true}}, {"insert": " Ráfagas salvajes de viento golpeaban el muro, amenazando con despegar a Cientopitos y lanzarlo hacia una muerte segura contra el suelo."}, {"insert": "\\n", "attributes": {"list": "bullet"}}, {"insert": "El Batallón de la Grieta:", "attributes": {"bold": true}}, {"insert": " A mitad del camino, un grupo de cincuenta hormigas soldado, armadas con mandíbulas capaces de partir madera, custodiaban el territorio y bloquearon el paso del ciempiés de forma agresiva."}, {"insert": "\\n", "attributes": {"list": "bullet"}}, {"insert": "Aplicando su entrenamiento nocturno, Cientopitos ejecutó un patrón de movimiento en zigzag a una velocidad de vértigo, esquivando las tenazas de las hormigas sin detener su marcha un solo segundo. Al llegar a la repisa superior, se topó cara a cara con la Araña Sombra, cuyos ocho ojos brillaban con un destello violáceo. El arácnido se lanzó al ataque lanzando hilos de seda pegajosa. Con un giro perfecto de noventa grados, Cientopitos esquivó el ataque por milímetros, usó sus patas traseras como resortes para impulsarse y propinó un golpe certero en el nodo principal de la telaraña. La estructura colapsó. Cientopitos atrapó al bicho bolita en el aire, se enrolló sobre sí mismo formando una esfera blindada y se arrojó al vacío, rebotando de forma segura sobre la superficie acolchada de un helecho gigante.\\n"}]}	765874ducua	spanish	2026-06-03 04:32:45.639038	2026-06-03 04:44:03.97006	t	\N
Capítulo 3	El escape apocalíptico bajo la tormenta	t	-inicio-765874ducua-La Saga de Cientopitos	-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 3	{"ops": [{"insert": "Capítulo 3: El escape apocalíptico bajo la tormenta"}, {"insert": "\\n", "attributes": {"header": 1}}, {"insert": "La alegría del rescate se desvaneció al instante. El cielo sobre el jardín se tiñó de un color carbón amenazante y la presión del aire cayó drásticamente. De repente, una detonación sorda sacudió el suelo: una gota de lluvia del tamaño de una manzana humana impactó a pocos centímetros de los héroes, salpicando lodo hirviente y creando una onda de choque que los lanzó por los aires. La peor tormenta del año había comenzado y el suelo del jardín se transformaba rápidamente en un laberinto de ríos caudalosos e inundaciones de lodo.\\n\\nPara empeorar la situación, el peligro no solo venía del suelo. Un enorme pájaro petirrojo, con el plumaje erizado por el frío y desesperado por encontrar alimento antes de que la lluvia arreciara, descendió del cielo picoteando el fango con una violencia frenética. Sus ojos hambrientos se fijaron en la silueta de los dos insectos.\\n\\nCientopitos comprendió que no podían luchar contra la naturaleza. Tomando una decisión extrema, utilizó cincuenta de sus patas delanteras para abrazar firmemente el caparazón de su amigo herido y las otras cincuenta para iniciar una carrera suicida hacia los cimientos de la gran estructura de concreto que los insectos llamaban \\"La Fortaleza de los Gigantes\\" (la casa de los humanos). Esquivando los picotazos del ave —que abrían cráteres en la tierra a milímetros de su cuerpo— y nadando contra corrientes de agua sucia que amenazaban con ahogarlos, Cientopitos divisó una pequeña y milagrosa hendidura bajo la madera de la puerta trasera. Con un último esfuerzo que estiró sus músculos al límite, se deslizó por el estrecho túnel justo cuando una ola de lodo sepultaba el exterior.\\n"}]}	765874ducua	spanish	2026-06-03 04:32:45.639038	2026-06-03 04:44:03.97006	t	\N
Capítulo 4	El laberinto de los gigantes y la reliquia brillante	t	-inicio-765874ducua-La Saga de Cientopitos	-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 4	{"ops": [{"insert": "Capítulo 4: El laberinto de los gigantes y la reliquia brillante"}, {"insert": "\\n", "attributes": {"header": 1}}, {"insert": "El interior de la casa era un universo totalmente alienígena. Cientopitos y el bicho bolita se encontraron en un desierto interminable de madera pulida y colosales cordilleras de tela que los humanos llamaban alfombras. El ambiente estaba lleno de peligros desconocidos: un estruendo ensordecedor comenzó a vibrar cuando los humanos encendieron un monstruo plano y ruidoso (la aspiradora) que devoraba todo a su paso con una fuerza de succión aterradora.\\nEl bicho bolita, debilitado por el veneno residual que la araña le había inoculado, apenas podía moverse. Cientopitos sabía que necesitaba encontrar un refugio alto y provisiones. Escaló con paciencia las patas de un mueble de roble, sorteando montañas de cojines mullidos, hasta llegar a la superficie de una mesa auxiliar. Allí, en el interior de una caja de madera abierta, algo extraordinario captó la atención de sus antenas.\\nSe trataba de una antigua canica de vidrio translúcido. En su interior, atrapada en el centro del cristal, flotaba una espiral de colores azul eléctrico y verde esmeralda que emitía una sutil vibración cósmica y un calor reconfortante. Cientopitos experimentó una atracción magnética hacia el objeto. Con un esfuerzo sobrehumano, apoyando sus cien patas contra el borde de la caja, empujó la pesada esfera de vidrio hacia el borde del mueble, haciéndola rodar por una rampa de tela hasta el suelo, justo donde descansaba su compañero.\\nAl hacer contacto la canica con el caparazón del bicho bolita, una pulsación de energía lumínica estalló en la habitación. Los hilos pegajosos y el veneno se disolvieron al instante, sanando sus heridas y fortaleciendo su armadura con un brillo metálico. El destello mágico también envolvió a Cientopitos: sus cien patas comenzaron a brillar con un fuego dorado y sintió cómo una fuerza descomunal y una velocidad hiperbólica se asentaban en todo su cuerpo. Ya no eran simples insectos del jardín.\\n"}]}	765874ducua	spanish	2026-06-03 04:32:45.639038	2026-06-03 04:44:03.97006	t	\N
Capítulo 5	El nacimiento de los guardianes del jardín	f	-inicio-765874ducua-La Saga de Cientopitos	-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 5	{"ops": [{"insert": "Capítulo 5: El nacimiento de los guardianes del jardín"}, {"insert": "\\n", "attributes": {"header": 1}}, {"insert": "Dotados de una vitalidad renovada y capacidades que desafiaban las leyes de la naturaleza, Cientopitos y el bicho bolita no perdieron tiempo. Corrieron en perfecta sincronía hacia la rendija de la puerta trasera. Al cruzar el umbral, descubrieron que la tormenta había disipado las nubes, dejando el jardín bañado por los hilos dorados de un sol radiante que hacía brillar las gotas de agua sobre las hojas como si fueran diamantes.\\nEl regreso de los dos amigos a la colonia bajo la piedra gris no pasó desapercibido. Los mismos ciempiés que antes se burlaban de la torpeza de Cientopitos guardaron un silencio sepulcral al ver el destello dorado de sus patas y la majestuosidad con la que se movía, escoltado por un bicho bolita cuyo caparazón ahora reflejaba la luz como el acero.\\nCientopitos colocó la canica mágica en el centro del hormiguero abandonado de la colonia, transformándolo en un faro de energía que protegía los alrededores de hongos y plagas. Sabían que el peligro volvería, que la Araña Sombra buscaría venganza y que el jardín albergaba amenazas aún mayores en el estanque prohibido, pero ya no tenían miedo. Cientopitos y su eterno compañero habían asumido su destino: se habían convertido en los guardianes y protectores legendarios del micromundo.\\n"}]}	765874ducua	spanish	2026-06-03 04:32:45.639038	2026-06-03 04:44:03.97006	t	\N
Capítulo 1	El origen en la hojarasca profunda	t	-inicio-765874ducua-La Saga de Cientopitos	-historia-765874ducua--inicio-765874ducua-La Saga de Cientopitos-Capítulo 1	{"ops": [{"insert": "Capítulo 1: El origen en la hojarasca profunda"}, {"insert": "\\n", "attributes": {"header": 1}}, {"insert": "En el rincón más recóndito y húmedo del jardín, justo bajo la sombra eterna de una gran piedra gris cubierta de musgo, transcurrió la infancia de "}, {"insert": "Cientopitos", "attributes": {"bold": true}}, {"insert": ". Desde el día en que rompió el cascarón siendo una pequeña y frágil larva, su vida no fue fácil. A diferencia de sus hermanos, que nacieron con una coordinación innata, Cientopitos sufría constantemente el tropiezo de sus propias extremidades. Sus cien patas se movían sin ritmo, provocando que terminara enredado sobre el lodo mientras los demás ciempiés de la colonia se burlaban de su torpeza.\\nLejos de rendirse, Cientopitos convirtió la burla en motivación. Cada noche, cuando los depredadores dormían y la luna iluminaba la hojarasca, se retiraba a un claro oculto entre raíces de diente de león para entrenar en secreto. Practicaba durante horas la sincronización milimétrica de cada par de patas: las diez primeras abrían camino, las del medio daban tracción y las traseras aseguraban el equilibrio. Tras semanas de disciplina militar, logró lo impensable. No solo dejó de tropezar, sino que desarrolló un sistema de aceleración ondulatoria que lo convirtió, sin discusión, en el ciempiés más veloz, ágil y astuto de todo el jardín.\\nDurante sus exploraciones diarias, Cientopitos conoció a su contraparte perfecta: un bicho bolita de caparazón grisáceo, un tanto temeroso pero de una lealtad inquebrantable. Juntos pasaban los días buscando hojas tiernas y esquivando los peligros cotidianos del suelo. La vida parecía haber encontrado un equilibrio perfecto, pero en el micromundo, la paz es solo una tregua antes de la tormenta.\\n"}]}	765874ducua	spanish	2026-06-03 04:32:45.639038	2026-06-03 04:44:03.97006	t	\N
Las noches boca arriba	Historia corta	t	-inicio-876148magia-Saga de testeo	-historia-876148magia--inicio-876148magia-Saga de testeo-Las noches boca arriba	{"ops": [{"insert": " La noche boca arriba - Julio Cortázar", "attributes": {"color": "#404040", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"header": 2}}, {"insert": "A mitad del largo zaguán del hotel pensó que debía ser tarde, y se apuró a salir a la calle y sacar la motocicleta del rincón donde el portero de al lado le permitía guardarla. En la joyería de la esquina vio que eran las nueve menos diez; llegaría con tiempo sobrado adonde iba. El sol se filtraba entre los altos edificios del centro, y él —porque para sí mismo, para ir pensando, no tenía nombre— montó en la máquina saboreando el paseo. La moto ronroneaba entre sus piernas, y un viento fresco le chicoteaba los pantalones.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"blockquote": true}}, {"insert": "Dejó pasar los ministerios (el rosa, el blanco) y la serie de comercios con brillantes vitrinas de la calle Central. Ahora entraba en la parte más agradable del trayecto, el verdadero paseo: una calle larga, bordeada de árboles, con poco tráfico y amplias villas que dejaban venir los jardines hasta las aceras, apenas demarcadas por setos bajos. Quizá algo distraído, pero corriendo por la derecha como correspondía, se dejó llevar por la tersura, por la leve crispación de ese día apenas empezado. Tal vez su involuntario relajamiento le impidió prevenir el accidente. Cuando vio que la mujer parada en la esquina se lanzaba a la calzada a pesar de las luces verdes, ya era tarde para las soluciones fáciles. Frenó con el pié y con la mano, desviándose a la izquierda; oyó el grito de la mujer, y junto con el choque perdió la visión. Fue como dormirse de golpe.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"blockquote": true}}, {"insert": "Volvió bruscamente del desmayo. Cuatro o cinco hombres jóvenes lo estaban sacando de debajo de la moto. Sentía gusto a sal y sangre, le dolía una rodilla, y cuando lo alzaron gritó, porque no podía soportar la presión en el brazo derecho. Voces que no parecían pertenecer a las caras suspendidas sobre él, lo alentaban con bromas y seguridades. Su único alivio fue oír la confirmación de que había estado en su derecho al cruzar la esquina. Preguntó por la mujer, tratando de dominar la náusea que le ganaba la garganta. Mientras lo llevaban boca arriba hasta una farmacia próxima, supo que la causante del accidente no tenía más que rasguños en la piernas. «Usté la agarró apenas, pero el golpe le hizo saltar la máquina de costado...» Opiniones, recuerdos, despacio, éntrenlo de espaldas, así va bien, y alguien con guardapolvo dándole de beber un trago que lo alivió en la penumbra de una pequeña farmacia de barrio.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"blockquote": true}}, {"insert": "\\n"}]}	876148magia	spanish	2026-06-03 04:32:45.639038	2026-06-03 04:44:03.97006	t	\N
Las noches boca arriba 2	Historia corta	t	-inicio-876148magia-Saga de testeo	-historia-876148magia--inicio-876148magia-Saga de testeo-Las noches boca arriba 2	{"ops": [{"insert": " La noche boca arriba - Julio Cortázar", "attributes": {"color": "#404040", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"header": 2}}, {"insert": "La ambulancia policial llegó a los cinco minutos, y lo subieron a una camilla blanda donde pudo tenderse a gusto. Con toda lucidez, pero sabiendo que estaba bajo los efectos de un shock terrible, dio sus señas al policía que lo acompañaba. El brazo casi no le dolía; de una cortadura en la ceja goteaba sangre por toda la cara. Una o dos veces se lamió los labios para beberla. Se sentía bien, era un accidente, mala suerte; unas semanas quieto y nada más. El vigilante le dijo que la motocicleta no parecía muy estropeada. «Natural», dijo él. «Como que me la ligué encima...» Los dos rieron, y el vigilante le dio la mano al llegar al hospital y le deseó buena suerte. Ya la náusea volvía poco a poco; mientras lo llevaban en una camilla de ruedas hasta un pabellón del fondo, pasando bajo árboles llenos de pájaros, cerró los ojos y deseó estar dormido o cloroformado. Pero lo tuvieron largo rato en una pieza con olor a hospital, llenando una ficha, quitándole la ropa y vistiéndolo con una camisa grisácea y dura. Le movían cuidadosamente el brazo, sin que le doliera. Las enfermeras bromeaban todo el tiempo, y si no hubiera sido por las contracciones del estómago se habría sentido muy bien, casi contento.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Lo llevaron a la sala de radio, y veinte minutos después, con la placa todavía húmeda puesta sobre el pecho como una lápida negra, pasó a la sala de operaciones. Alguien de blanco, alto y delgado, se le acercó y se puso a mirar la radiografía. Manos de mujer le acomodaron la cabeza, sintió que lo pasaban de una camilla a otra. El hombre de blanco se le acercó otra vez, sonriendo, con algo que le brillaba en la mano derecha. Le palmeó la mejilla e hizo una seña a alguien parado atrás.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Como sueño era curioso porque estaba lleno de olores y él nunca soñaba olores. Primero un olor a pantano, ya que a la izquierda de la calzada empezaban las marismas, los tembladerales de donde no volvía nadie. Pero el olor cesó, y en cambio vino una fragancia compuesta y oscura como la noche en que se movía huyendo de los aztecas. Y todo era tan natural, tenía que huir de los aztecas que andaban a caza de hombre, y su única probabilidad era la de esconderse en lo más denso de la selva, cuidando de no apartarse de la estrecha calzada que sólo ellos, los motecas, conocían.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Lo que más lo torturaba era el olor, como si aun en la absoluta aceptación del sueño algo se revelara contra eso que no era habitual, que hasta entonces no había participado del juego. «Huele a guerra», pensó, tocando instintivamente el puñal de piedra atravesado en su ceñidor de lana tejida. Un sonido inesperado lo hizo agacharse y quedar inmóvil, temblando. Tener miedo no era extraño, en sus sueños abundaba el miedo. Esperó, tapado por las ramas de un arbusto y la noche sin estrellas. Muy lejos, probablemente del otro lado del gran lago, debían estar ardiendo fuegos de vivac; un resplandor rojizo teñía esa parte del cielo. El sonido no se repitió. Había sido como una rama quebrada. Tal vez un animal que escapaba como él del olor de la guerra. Se enderezó despacio, venteando. No se oía nada, pero el miedo seguía allí como el olor, ese incienso dulzón de la guerra florida. Había que seguir, llegar al corazón de la selva evitando las ciénagas. A tientas, agachándose a cada instante para tocar el suelo más duro de la calzada, dio algunos pasos. Hubiera querido echar a correr, pero los tembladerales palpitaban a su lado. En el sendero en tinieblas, buscó el rumbo. Entonces sintió una bocanada horrible del olor que más temía, y saltó desesperado hacia adelante.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n"}]}	876148magia	spanish	2026-06-03 04:32:45.639038	2026-06-03 04:44:03.97006	t	\N
hola como tas	saga para probar cambio de sistema de per	t		-historia-765874ducua--461802	{"ops": [{"insert": "461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802vvvv", "attributes": {"color": "#222222", "background": "#ffffff"}}, {"insert": "\\n"}]}	765874ducua	spanish	2026-06-03 04:32:45.639038	2026-06-14 15:53:33.887459	t	{"ops": [{"insert": "461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802vvvv", "attributes": {"color": "#222222", "background": "#ffffff"}}, {"insert": "\\n"}]}
jajajaja	la sebolla	f	-inicio-876148magia-Saga de testeo	-historia-876148magia--inicio-876148magia-Saga de testeo-jajajaja	{"ops": [{"insert": " La noche boca arriba - Julio Cortázar", "attributes": {"color": "#404040", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"header": 2}}, {"insert": "A mitad del largo zaguán del hotel pensó que debía ser tarde, y se apuró a salir a la calle y sacar la motocicleta del rincón donde el portero de al lado le permitía guardarla. En la joyería de la esquina vio que eran las nueve menos diez; llegaría con tiempo sobrado adonde iba. El sol se filtraba entre los altos edificios del centro, y él —porque para sí mismo, para ir pensando, no tenía nombre— montó en la máquina saboreando el paseo. La moto ronroneaba entre sus piernas, y un viento fresco le chicoteaba los pantalones.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"blockquote": true}}, {"insert": "Dejó pasar los ministerios (el rosa, el blanco) y la serie de comercios con brillantes vitrinas de la calle Central. Ahora entraba en la parte más agradable del trayecto, el verdadero paseo: una calle larga, bordeada de árboles, con poco tráfico y amplias villas que dejaban venir los jardines hasta las aceras, apenas demarcadas por setos bajos. Quizá algo distraído, pero corriendo por la derecha como correspondía, se dejó llevar por la tersura, por la leve crispación de ese día apenas empezado. Tal vez su involuntario relajamiento le impidió prevenir el accidente. Cuando vio que la mujer parada en la esquina se lanzaba a la calzada a pesar de las luces verdes, ya era tarde para las soluciones fáciles. Frenó con el pié y con la mano, desviándose a la izquierda; oyó el grito de la mujer, y junto con el choque perdió la visión. Fue como dormirse de golpe.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"blockquote": true}}, {"insert": "\\n"}]}	876148magia	spanish	2026-06-03 08:49:14.804931	2026-06-03 08:49:14.804931	t	\N
poema no2	poema	t	-inicio-876148magia-Saga de testeo	-historia-876148magia--inicio-876148magia-Saga de testeo-poema no2	{"ops": [{"insert": " La noche boca arriba - Julio Cortázar", "attributes": {"color": "#404040", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"header": 2}}, {"insert": "A mitad del largo zaguán del hotel pensó que debía ser tarde, y se apuró a salir a la calle y sacar la motocicleta del rincón donde el portero de al lado le permitía guardarla. En la joyería de la esquina vio que eran las nueve menos diez; llegaría con tiempo sobrado adonde iba. El sol se filtraba entre los altos edificios del centro, y él —porque para sí mismo, para ir pensando, no tenía nombre— montó en la máquina saboreando el paseo. La moto ronroneaba entre sus piernas, y un viento fresco le chicoteaba los pantalones.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"blockquote": true}}, {"insert": "Dejó pasar los ministerios (el rosa, el blanco) y la serie de comercios con brillantes vitrinas de la calle Central. Ahora entraba en la parte más agradable del trayecto, el verdadero paseo: una calle larga, bordeada de árboles, con poco tráfico y amplias villas que dejaban venir los jardines hasta las aceras, apenas demarcadas por setos bajos. Quizá algo distraído, pero corriendo por la derecha como correspondía, se dejó llevar por la tersura, por la leve crispación de ese día apenas empezado. Tal vez su involuntario relajamiento le impidió prevenir el accidente. Cuando vio que la mujer parada en la esquina se lanzaba a la calzada a pesar de las luces verdes, ya era tarde para las soluciones fáciles. Frenó con el pié y con la mano, desviándose a la izquierda; oyó el grito de la mujer, y junto con el choque perdió la visión. Fue como dormirse de golpe.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"blockquote": true}}, {"insert": "\\n"}]}	876148magia	spanish	2026-06-03 08:54:26.671689	2026-06-03 08:54:26.671689	t	\N
elecciones	mi amita	t	-inicio-876148magia-Hamlet	-historia-876148magia--inicio-876148magia-Hamlet-elecciones	{"ops": [{"insert": "1. La noche boca arriba - Julio Cortázar", "attributes": {"color": "#404040", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"header": 2}}, {"insert": "A mitad del largo zaguán del hotel pensó que debía ser tarde, y se apuró a salir a la calle y sacar la motocicleta del rincón donde el portero de al lado le permitía guardarla. En la joyería de la esquina vio que eran las nueve menos diez; llegaría con tiempo sobrado adonde iba. El sol se filtraba entre los altos edificios del centro, y él —porque para sí mismo, para ir pensando, no tenía nombre— montó en la máquina saboreando el paseo. La moto ronroneaba entre sus piernas, y un viento fresco le chicoteaba los pantalones.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"blockquote": true}}, {"insert": "Dejó pasar los ministerios (el rosa, el blanco) y la serie de comercios con brillantes vitrinas de la calle Central. Ahora entraba en la parte más agradable del trayecto, el verdadero paseo: una calle larga, bordeada de árboles, con poco tráfico y amplias villas que dejaban venir los jardines hasta las aceras, apenas demarcadas por setos bajos. Quizá algo distraído, pero corriendo por la derecha como correspondía, se dejó llevar por la tersura, por la leve crispación de ese día apenas empezado. Tal vez su involuntario relajamiento le impidió prevenir el accidente. Cuando vio que la mujer parada en la esquina se lanzaba a la calzada a pesar de las luces verdes, ya era tarde para las soluciones fáciles. Frenó con el pié y con la mano, desviándose a la izquierda; oyó el grito de la mujer, y junto con el choque perdió la visión. Fue como dormirse de golpe.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"blockquote": true}}, {"insert": "Volvió bruscamente del desmayo. Cuatro o cinco hombres jóvenes lo estaban sacando de debajo de la moto. Sentía gusto a sal y sangre, le dolía una rodilla, y cuando lo alzaron gritó, porque no podía soportar la presión en el brazo derecho. Voces que no parecían pertenecer a las caras suspendidas sobre él, lo alentaban con bromas y seguridades. Su único alivio fue oír la confirmación de que había estado en su derecho al cruzar la esquina. Preguntó por la mujer, tratando de dominar la náusea que le ganaba la garganta. Mientras lo llevaban boca arriba hasta una farmacia próxima, supo que la causante del accidente no tenía más que rasguños en la piernas. «Usté la agarró apenas, pero el golpe le hizo saltar la máquina de costado...» Opiniones, recuerdos, despacio, éntrenlo de espaldas, así va bien, y alguien con guardapolvo dándole de beber un trago que lo alivió en la penumbra de una pequeña farmacia de barrio.", "attributes": {"color": "#555555", "background": "#ffffff"}}, {"insert": "\\n", "attributes": {"blockquote": true}}, {"insert": "\\n"}]}	876148magia	spanish	2026-06-04 22:12:01.770845	2026-06-04 22:12:01.770845	t	\N
hamelet	hamelet	f		-historia-876148magia--hamelet	{"ops": [{"insert": "En un país llamado Colombia, cerca de la cordillera de los Andes, habitaba una tribu indígena que llevaba muchísimos años instalada en esas tierras. Sus miembros eran personas sencillas que convivían pacíficamente, hasta que un día el grupo de los jóvenes se reunió en asamblea y tomó una terrible decisión: ¡expulsar del poblado a todos los ancianos!", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Los arrogantes muchachos  declararon que los viejecitos  se habían convertido en un estorbo para el buen funcionamiento de la comunidad porque ya no tenían fuerzas para cargar los sacos de semillas y porque sus movimientos se habían vuelto tan torpes que necesitaban ayuda incluso para comer o asearse. Por estas razones, aseguraron, era necesario echarlos para siempre.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Tan solo un chico bueno y generoso llamado Llivan creyó que se estaba cometiendo una gran injusticia y se rebeló contra los demás:", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡¿Estáis locos?!… ¡No podemos hacer esa barbaridad! Les debemos todo lo que somos, todo lo que poseemos. Ellos  siempre nos han ayudado y ahora somos nosotros quienes debemos cuidarlos con amor y respeto.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Desgraciadamente ninguno se conmovió y Llivan tuvo que contemplar horrorizado cómo los ancianos eran obligados a abandonar sus hogares.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Esto es horrible! Nadie se merece que le traten así.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Cuando los vio alejarse del pueblo con la cabeza agachada y arrastrando los pies, decidió que no podía quedarse de brazos cruzados. Sin pararse a pensar, echó a correr hasta alcanzarlos.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Esperen, por favor, esperen! Si me lo permiten iré con ustedes para que se sientan más seguros y ayudarles a buscar un buen lugar donde vivir.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "El de más edad sonrió y aceptó la propuesta en su nombre y el de los demás.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– Claro que sí, Llivan. Tú eres un buen muchacho y no un canalla. Agradecemos mucho tu compañía y toda la ayuda que nos puedas proporcionar.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Oh no, no me den las gracias! Siento que es mi deber, pero les aseguro que lo hago con gusto.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Llivan se puso al frente y los dirigió hacia un cálido y hermoso valle rodeado de montañas. Tardaron varias horas, pero mereció la pena.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Este es el lugar elegido para montar el nuevo poblado! La tierra es fértil, ideal para cultivar. Además, está atravesado por un rio en el que podremos pescar a diario. ¿No les parece perfecto?", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "El más anciano reconoció que la elección era excelente.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n\\n"}]}	876148magia	spanish	2026-06-05 21:06:19.021432	2026-06-05 21:06:19.021432	t	\N
the sisters brothers	the sisters brothers	f		-historia-876148magia--the sisters brothers	{"ops": [{"insert": "En un país llamado Colombia, cerca de la cordillera de los Andes, habitaba una tribu indígena que llevaba muchísimos años instalada en esas tierras. Sus miembros eran personas sencillas que convivían pacíficamente, hasta que un día el grupo de los jóvenes se reunió en asamblea y tomó una terrible decisión: ¡expulsar del poblado a todos los ancianos!", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Los arrogantes muchachos  declararon que los viejecitos  se habían convertido en un estorbo para el buen funcionamiento de la comunidad porque ya no tenían fuerzas para cargar los sacos de semillas y porque sus movimientos se habían vuelto tan torpes que necesitaban ayuda incluso para comer o asearse. Por estas razones, aseguraron, era necesario echarlos para siempre.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Tan solo un chico bueno y generoso llamado Llivan creyó que se estaba cometiendo una gran injusticia y se rebeló contra los demás:", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡¿Estáis locos?!… ¡No podemos hacer esa barbaridad! Les debemos todo lo que somos, todo lo que poseemos. Ellos  siempre nos han ayudado y ahora somos nosotros quienes debemos cuidarlos con amor y respeto.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Desgraciadamente ninguno se conmovió y Llivan tuvo que contemplar horrorizado cómo los ancianos eran obligados a abandonar sus hogares.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Esto es horrible! Nadie se merece que le traten así.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Cuando los vio alejarse del pueblo con la cabeza agachada y arrastrando los pies, decidió que no podía quedarse de brazos cruzados. Sin pararse a pensar, echó a correr hasta alcanzarlos.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Esperen, por favor, esperen! Si me lo permiten iré con ustedes para que se sientan más seguros y ayudarles a buscar un buen lugar donde vivir.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "El de más edad sonrió y aceptó la propuesta en su nombre y el de los demás.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– Claro que sí, Llivan. Tú eres un buen muchacho y no un canalla. Agradecemos mucho tu compañía y toda la ayuda que nos puedas proporcionar.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Oh no, no me den las gracias! Siento que es mi deber, pero les aseguro que lo hago con gusto.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Llivan se puso al frente y los dirigió hacia un cálido y hermoso valle rodeado de montañas. Tardaron varias horas, pero mereció la pena.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Este es el lugar elegido para montar el nuevo poblado! La tierra es fértil, ideal para cultivar. Además, está atravesado por un rio en el que podremos pescar a diario. ¿No les parece perfecto?", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "El más anciano reconoció que la elección era excelente.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n\\n"}]}	876148magia	spanish	2026-06-05 21:07:24.065795	2026-06-05 21:07:24.065795	t	\N
manual de fisica avanzada 1	manual tecnico de grado universitario sobre fisica avanzada	f		-historia-876148magia--manual de fisica avanzada 1	{"ops": [{"insert": "En un país llamado Colombia, cerca de la cordillera de los Andes, habitaba una tribu indígena que llevaba muchísimos años instalada en esas tierras. Sus miembros eran personas sencillas que convivían pacíficamente, hasta que un día el grupo de los jóvenes se reunió en asamblea y tomó una terrible decisión: ¡expulsar del poblado a todos los ancianos!", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Los arrogantes muchachos  declararon que los viejecitos  se habían convertido en un estorbo para el buen funcionamiento de la comunidad porque ya no tenían fuerzas para cargar los sacos de semillas y porque sus movimientos se habían vuelto tan torpes que necesitaban ayuda incluso para comer o asearse. Por estas razones, aseguraron, era necesario echarlos para siempre.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Tan solo un chico bueno y generoso llamado Llivan creyó que se estaba cometiendo una gran injusticia y se rebeló contra los demás:", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡¿Estáis locos?!… ¡No podemos hacer esa barbaridad! Les debemos todo lo que somos, todo lo que poseemos. Ellos  siempre nos han ayudado y ahora somos nosotros quienes debemos cuidarlos con amor y respeto.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Desgraciadamente ninguno se conmovió y Llivan tuvo que contemplar horrorizado cómo los ancianos eran obligados a abandonar sus hogares.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Esto es horrible! Nadie se merece que le traten así.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Cuando los vio alejarse del pueblo con la cabeza agachada y arrastrando los pies, decidió que no podía quedarse de brazos cruzados. Sin pararse a pensar, echó a correr hasta alcanzarlos.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Esperen, por favor, esperen! Si me lo permiten iré con ustedes para que se sientan más seguros y ayudarles a buscar un buen lugar donde vivir.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "El de más edad sonrió y aceptó la propuesta en su nombre y el de los demás.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– Claro que sí, Llivan. Tú eres un buen muchacho y no un canalla. Agradecemos mucho tu compañía y toda la ayuda que nos puedas proporcionar.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Oh no, no me den las gracias! Siento que es mi deber, pero les aseguro que lo hago con gusto.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Llivan se puso al frente y los dirigió hacia un cálido y hermoso valle rodeado de montañas. Tardaron varias horas, pero mereció la pena.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Este es el lugar elegido para montar el nuevo poblado! La tierra es fértil, ideal para cultivar. Además, está atravesado por un rio en el que podremos pescar a diario. ¿No les parece perfecto?", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "El más anciano reconoció que la elección era excelente.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n\\n"}]}	876148magia	spanish	2026-06-05 21:08:43.439848	2026-06-05 21:08:43.439848	t	\N
100 de soledad	de Gabriel Garcia Marquez	f		-historia-876148magia--100 de soledad	{"ops": [{"insert": "En un país llamado Colombia, cerca de la cordillera de los Andes, habitaba una tribu indígena que llevaba muchísimos años instalada en esas tierras. Sus miembros eran personas sencillas que convivían pacíficamente, hasta que un día el grupo de los jóvenes se reunió en asamblea y tomó una terrible decisión: ¡expulsar del poblado a todos los ancianos!", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Los arrogantes muchachos  declararon que los viejecitos  se habían convertido en un estorbo para el buen funcionamiento de la comunidad porque ya no tenían fuerzas para cargar los sacos de semillas y porque sus movimientos se habían vuelto tan torpes que necesitaban ayuda incluso para comer o asearse. Por estas razones, aseguraron, era necesario echarlos para siempre.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Tan solo un chico bueno y generoso llamado Llivan creyó que se estaba cometiendo una gran injusticia y se rebeló contra los demás:", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡¿Estáis locos?!… ¡No podemos hacer esa barbaridad! Les debemos todo lo que somos, todo lo que poseemos. Ellos  siempre nos han ayudado y ahora somos nosotros quienes debemos cuidarlos con amor y respeto.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Desgraciadamente ninguno se conmovió y Llivan tuvo que contemplar horrorizado cómo los ancianos eran obligados a abandonar sus hogares.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Esto es horrible! Nadie se merece que le traten así.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Cuando los vio alejarse del pueblo con la cabeza agachada y arrastrando los pies, decidió que no podía quedarse de brazos cruzados. Sin pararse a pensar, echó a correr hasta alcanzarlos.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Esperen, por favor, esperen! Si me lo permiten iré con ustedes para que se sientan más seguros y ayudarles a buscar un buen lugar donde vivir.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "El de más edad sonrió y aceptó la propuesta en su nombre y el de los demás.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– Claro que sí, Llivan. Tú eres un buen muchacho y no un canalla. Agradecemos mucho tu compañía y toda la ayuda que nos puedas proporcionar.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Oh no, no me den las gracias! Siento que es mi deber, pero les aseguro que lo hago con gusto.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Llivan se puso al frente y los dirigió hacia un cálido y hermoso valle rodeado de montañas. Tardaron varias horas, pero mereció la pena.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Este es el lugar elegido para montar el nuevo poblado! La tierra es fértil, ideal para cultivar. Además, está atravesado por un rio en el que podremos pescar a diario. ¿No les parece perfecto?", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "El más anciano reconoció que la elección era excelente.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n\\n"}]}	876148magia	spanish	2026-06-05 21:09:26.136366	2026-06-05 21:09:26.136366	t	\N
el quijote de la mancha	somos los mejores en literatura nadie tiene un Quijote no lo podréis tener jamás en ninguna otra lengua podréis tener jamás un Quijote es imposible no tenéis lengua para escribir un Quijote en el mejor de los casos podéis tener algún traductor inteligente para haceros ver de lejos más o menos lo que es El Quijote os sabéis español o no podéis catar eso eso solo se Cata en español hay cosas que solo se saben en español en el español nativo ahora si queréis aprender lenguas inútiles	f		-historia-876148magia--el quijote de la mancha	{"ops": [{"insert": "En un país llamado Colombia, cerca de la cordillera de los Andes, habitaba una tribu indígena que llevaba muchísimos años instalada en esas tierras. Sus miembros eran personas sencillas que convivían pacíficamente, hasta que un día el grupo de los jóvenes se reunió en asamblea y tomó una terrible decisión: ¡expulsar del poblado a todos los ancianos!", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Los arrogantes muchachos  declararon que los viejecitos  se habían convertido en un estorbo para el buen funcionamiento de la comunidad porque ya no tenían fuerzas para cargar los sacos de semillas y porque sus movimientos se habían vuelto tan torpes que necesitaban ayuda incluso para comer o asearse. Por estas razones, aseguraron, era necesario echarlos para siempre.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Tan solo un chico bueno y generoso llamado Llivan creyó que se estaba cometiendo una gran injusticia y se rebeló contra los demás:", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡¿Estáis locos?!… ¡No podemos hacer esa barbaridad! Les debemos todo lo que somos, todo lo que poseemos. Ellos  siempre nos han ayudado y ahora somos nosotros quienes debemos cuidarlos con amor y respeto.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Desgraciadamente ninguno se conmovió y Llivan tuvo que contemplar horrorizado cómo los ancianos eran obligados a abandonar sus hogares.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Esto es horrible! Nadie se merece que le traten así.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Cuando los vio alejarse del pueblo con la cabeza agachada y arrastrando los pies, decidió que no podía quedarse de brazos cruzados. Sin pararse a pensar, echó a correr hasta alcanzarlos.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Esperen, por favor, esperen! Si me lo permiten iré con ustedes para que se sientan más seguros y ayudarles a buscar un buen lugar donde vivir.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "El de más edad sonrió y aceptó la propuesta en su nombre y el de los demás.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– Claro que sí, Llivan. Tú eres un buen muchacho y no un canalla. Agradecemos mucho tu compañía y toda la ayuda que nos puedas proporcionar.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Oh no, no me den las gracias! Siento que es mi deber, pero les aseguro que lo hago con gusto.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Llivan se puso al frente y los dirigió hacia un cálido y hermoso valle rodeado de montañas. Tardaron varias horas, pero mereció la pena.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Este es el lugar elegido para montar el nuevo poblado! La tierra es fértil, ideal para cultivar. Además, está atravesado por un rio en el que podremos pescar a diario. ¿No les parece perfecto?", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "El más anciano reconoció que la elección era excelente.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n\\n"}]}	876148magia	spanish	2026-06-05 21:17:33.120142	2026-06-05 21:17:33.120142	t	\N
media noche de eterna primavera	la noche	f		-historia-876148magia--media noche de eterna primavera	{"ops": [{"insert": "En un país llamado Colombia, cerca de la cordillera de los Andes, habitaba una tribu indígena que llevaba muchísimos años instalada en esas tierras. Sus miembros eran personas sencillas que convivían pacíficamente, hasta que un día el grupo de los jóvenes se reunió en asamblea y tomó una terrible decisión: ¡expulsar del poblado a todos los ancianos!", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Los arrogantes muchachos  declararon que los viejecitos  se habían convertido en un estorbo para el buen funcionamiento de la comunidad porque ya no tenían fuerzas para cargar los sacos de semillas y porque sus movimientos se habían vuelto tan torpes que necesitaban ayuda incluso para comer o asearse. Por estas razones, aseguraron, era necesario echarlos para siempre.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Tan solo un chico bueno y generoso llamado Llivan creyó que se estaba cometiendo una gran injusticia y se rebeló contra los demás:", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡¿Estáis locos?!… ¡No podemos hacer esa barbaridad! Les debemos todo lo que somos, todo lo que poseemos. Ellos  siempre nos han ayudado y ahora somos nosotros quienes debemos cuidarlos con amor y respeto.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Desgraciadamente ninguno se conmovió y Llivan tuvo que contemplar horrorizado cómo los ancianos eran obligados a abandonar sus hogares.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Esto es horrible! Nadie se merece que le traten así.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Cuando los vio alejarse del pueblo con la cabeza agachada y arrastrando los pies, decidió que no podía quedarse de brazos cruzados. Sin pararse a pensar, echó a correr hasta alcanzarlos.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Esperen, por favor, esperen! Si me lo permiten iré con ustedes para que se sientan más seguros y ayudarles a buscar un buen lugar donde vivir.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "El de más edad sonrió y aceptó la propuesta en su nombre y el de los demás.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– Claro que sí, Llivan. Tú eres un buen muchacho y no un canalla. Agradecemos mucho tu compañía y toda la ayuda que nos puedas proporcionar.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Oh no, no me den las gracias! Siento que es mi deber, pero les aseguro que lo hago con gusto.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "Llivan se puso al frente y los dirigió hacia un cálido y hermoso valle rodeado de montañas. Tardaron varias horas, pero mereció la pena.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "– ¡Este es el lugar elegido para montar el nuevo poblado! La tierra es fértil, ideal para cultivar. Además, está atravesado por un rio en el que podremos pescar a diario. ¿No les parece perfecto?", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n"}, {"insert": "El más anciano reconoció que la elección era excelente.", "attributes": {"color": "#1a1a1a", "background": "#ffffff"}}, {"insert": "\\n\\n"}]}	876148magia	spanish	2026-06-05 21:18:34.424285	2026-06-05 21:18:34.424285	t	\N
https://www.xnxx.es/	https://www.xnxx.es/	t	-inicio-765874ducua-461802 2.0	765874ducua-365074d1-4f8c-43c7-90f3-c44cdf490797	{"ops": [{"insert": "https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/", "attributes": {"bold": true, "color": "#000000", "background": "#f5f1e8"}}, {"insert": "\\n"}]}	765874ducua	spanish	2026-06-12 19:20:03.104197	2026-06-12 19:36:16.982884	t	{"ops": [{"insert": "hola pepito.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/https://www.xnxx.es/", "attributes": {"bold": true, "color": "#000000", "background": "#f5f1e8"}}, {"insert": "\\n"}]}
-historia-765874d	-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205	t		765874ducua-ca886ff0-ebbb-4436-85f7-cfd42a99015c	{"ops": [{"insert": "-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205v\\n"}]}	765874ducua	spanish	2026-06-12 23:23:34.962668	2026-06-15 05:41:32.502943	t	\N
aga%20de%20Cientopitos-Capítulo%205	-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205	t		765874ducua-8f8c4c7c-7609-418b-9316-74fc828dba43	{"ops": [{"insert": "-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-          765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia- 765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205v\\n"}]}	765874ducua	spanish	2026-06-12 23:25:05.446032	2026-06-14 16:39:19.206147	t	{"ops": [{"insert": "-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-          765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia- 765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874dunnnnncua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205-historia-765874ducua--inicio-765874ducua-La%20Saga%20de%20Cientopitos-Capítulo%205v\\n"}]}
la venganza de las zorra 2.0	tiene zorras	t	-inicio-765874ducua-granja	-historia-765874ducua--la venganza de las zorra 2.0	{"ops": [{"insert": " Neón \\nEl café de las cuatro de la tarde siempre era el momento más tranquilo para Elena y Roxana. Sentadas en la esquina de un pequeño restaurante con ventanas empañadas por la lluvia, compartían un panecillo y revisaban las cuentas del mes en una libreta gastada.\\nElena, de treinta y cuatro años, llevaba casi una década en el oficio. Su prioridad absoluta era la educación de su hijo, quien vivía con su abuela en otra provincia y creía que su madre trabajaba como administradora en una cadena de hoteles. Roxana, de veintidós, era más nueva en la zona; había llegado huyendo de una situación familiar compleja y buscaba independizarse por completo.\\n—Si mantenemos el ritmo de este mes, en diciembre podré pagar la matrícula completa del próximo año —dijo Elena, tachando una cifra en el papel con un bolígrafo azul.\\nRoxana sonrió, aunque mantenía la mirada cansada. El trabajo en el club nocturno exigía no solo esfuerzo físico, sino una constante gestión emocional para lidiar con clientes de todo tipo, mantener las normas de seguridad y cuidar la salud propia de manera estricta.\\n—Yo hablé hoy con el casero —comentó Roxana, dándole un sorbo a su café—. Ya no me pedirá el depósito doble para renovar el contrato del apartamento. Al menos este invierno tendré un lugar seguro.\\nA pesar de los prejuicios sociales y los riesgos inherentes a su entorno, ambas habían construido una red de apoyo sólida. En la calle y en el local, se cuidaban mutuamente: compartían alertas sobre clientes problemáticos, se aseguraban de que la otra regresara sana y salva a casa después de cada jornada y compartían gastos para abaratar costos.\\nAl caer la noche, las luces de neón del establecimiento se encendieron. Elena y Roxana guardaron la libreta, se acomodaron el abrigo y caminaron juntas hacia la entrada del local, listas para iniciar un nuevo turno, unidas por la determinación de construir el futuro que habían planeado.\\n"}]}	765874ducua	spanish	2026-06-03 04:32:45.639038	2026-06-14 15:36:11.453012	t	{"ops": [{"insert": "Esta va a ser la 100% primera historia actualizada"}, {"insert": "\\n", "attributes": {"header": 1}}, {"insert": "actualizada 3.0"}, {"insert": "\\n", "attributes": {"header": 2}}, {"insert": "Una tarde de junio, mientras el sol comenzaba a esconderse tiñendo el cielo de tonos dorados y violetas, una ráfaga inusualmente cálida hizo sonar sus jazmines como si fueran campanitas. Elena cerró los ojos y prestó atención. El viento le susurró sobre una semilla de oro brillante que había caído hacía siglos en la antigua "}, {"insert": "Hacienda El Paraíso", "attributes": {"bold": true}}, {"insert": ", custodiada por el espíritu del lugar.\\nIntrigada y sintiendo una llamada irresistible, Elena cerró su vivero, tomó su bicicleta y emprendió el camino hacia la zona rural de El Cerrito. El trayecto le tomó alrededor de 45 minutos pedaleando entre paisajes de ensueño. Al llegar, la brisa de la tarde la guio hasta un viejo árbol de samán, justo detrás de la casa colonial.\\nAllí, medio enterrada entre las raíces y brillando con la luz del atardecer, encontró una semilla del tamaño de un limón. En cuanto la tomó entre sus manos, una suave melodía resonó en su mente: la semilla era un fragmento de la naturaleza que guardaba los recuerdos y anhelos de aquellos que habían amado profundamente en esas tierras.\\nDe repente, la semilla comenzó a germinar rápidamente, desenredando una brillante enredadera dorada que ascendió por el tronco del samán. Las flores de esta planta emitían una luz cálida y reconfortante. Desde ese día, el viento de la región se volvió más suave y perfumado.\\nElena comprendió que su misión era proteger aquel tesoro. Regresaba cada fin de semana a regar la planta y a escuchar los cuentos que el viento le traía. Y así, la leyenda del Valle del Cauca creció; cuentan los lugareños que si te sientas bajo el gran samán de El Paraíso al atardecer y cierras los ojos, puedes escuchar las voces del pasado susurrando palabras de amor.\\n"}]}
El eco en el viento de palmira	Inspirada en mi hermosa ciudad y la primera historia actualizada	t		-historia-765874ducua--El eco en el viento de palmira	{"ops": [{"insert": "Esta va a ser la 100% primera historia actualizada"}, {"insert": "\\n", "attributes": {"header": 1}}, {"insert": "actualizada 3.0"}, {"insert": "\\n", "attributes": {"header": 2}}, {"insert": "Una tarde de junio, mientras el sol comenzaba a esconderse tiñendo el cielo de tonos dorados y violetas, una ráfaga inusualmente cálida hizo sonar sus jazmines como si fueran campanitas. Elena cerró los ojos y prestó atención. El viento le susurró sobre una semilla de oro brillante que había caído hacía siglos en la antigua "}, {"insert": "Hacienda El Paraíso", "attributes": {"bold": true}}, {"insert": ", custodiada por el espíritu del lugar.\\nIntrigada y sintiendo una llamada irresistible, Elena cerró su vivero, tomó su bicicleta y emprendió el camino hacia la zona rural de El Cerrito. El trayecto le tomó alrededor de 45 minutos pedaleando entre paisajes de ensueño. Al llegar, la brisa de la tarde la guio hasta un viejo árbol de samán, justo detrás de la casa colonial.\\nAllí, medio enterrada entre las raíces y brillando con la luz del atardecer, encontró una semilla del tamaño de un limón. En cuanto la tomó entre sus manos, una suave melodía resonó en su mente: la semilla era un fragmento de la naturaleza que guardaba los recuerdos y anhelos de aquellos que habían amado profundamente en esas tierras.\\nDe repente, la semilla comenzó a germinar rápidamente, desenredando una brillante enredadera dorada que ascendió por el tronco del samán. Las flores de esta planta emitían una luz cálida y reconfortante. Desde ese día, el viento de la región se volvió más suave y perfumado.\\nElena comprendió que su misión era proteger aquel tesoro. Regresaba cada fin de semana a regar la planta y a escuchar los cuentos que el viento le traía. Y así, la leyenda del Valle del Cauca creció; cuentan los lugareños que si te sientas bajo el gran samán de El Paraíso al atardecer y cierras los ojos, puedes escuchar las voces del pasado susurrando palabras de amor.\\n"}]}	765874ducua	spanish	2026-06-03 21:17:47.259605	2026-06-14 15:53:52.387543	t	{"ops": [{"insert": "Esta va a ser la 100% primera historia actualizada"}, {"insert": "\\n", "attributes": {"header": 1}}, {"insert": "actualizada 3.0"}, {"insert": "\\n", "attributes": {"header": 2}}, {"insert": "Una tarde de junio, mientras el sol comenzaba a esconderse tiñendo el cielo de tonos dorados y violetas, una ráfaga inusualmente cálida hizo sonar sus jazmines como si fueran campanitas. Elena cerró los ojos y prestó atención. El viento le susurró sobre una semilla de oro brillante que había caído hacía siglos en la antigua "}, {"insert": "Hacienda El Paraíso", "attributes": {"bold": true}}, {"insert": ", custodiada por el espíritu del lugar.\\nIntrigada y sintiendo una llamada irresistible, Elena cerró su vivero, tomó su bicicleta y emprendió el camino hacia la zona rural de El Cerrito. El trayecto le tomó alrededor de 45 minutos pedaleando entre paisajes de ensueño. Al llegar, la brisa de la tarde la guio hasta un viejo árbol de samán, justo detrás de la casa colonial.\\nAllí, medio enterrada entre las raíces y brillando con la luz del atardecer, encontró una semilla del tamaño de un limón. En cuanto la tomó entre sus manos, una suave melodía resonó en su mente: la semilla era un fragmento de la naturaleza que guardaba los recuerdos y anhelos de aquellos que habían amado profundamente en esas tierras.\\nDe repente, la semilla comenzó a germinar rápidamente, desenredando una brillante enredadera dorada que ascendió por el tronco del samán. Las flores de esta planta emitían una luz cálida y reconfortante. Desde ese día, el viento de la región se volvió más suave y perfumado.\\nElena comprendió que su misión era proteger aquel tesoro. Regresaba cada fin de semana a regar la planta y a escuchar los cuentos que el viento le traía. Y así, la leyenda del Valle del Cauca creció; cuentan los lugareños que si te sientas bajo el gran samán de El Paraíso al atardecer y cierras los ojos, puedes escuchar las voces del pasado susurrando palabras de amor.\\n"}]}
%20venganza%20de%20las%20zorra%202.0	ua--la%20venganza%20de%20las%20zorra%202.0	t		765874ducua-5c9b1ec9-eb5e-414d-8f8d-9db80bb86ecf	{"ops": [{"insert": "       njnjnj njnjnj njnjn njnjnj njnjn njnj -historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0\\n"}]}	765874ducua	spanish	2026-06-14 15:41:27.883609	2026-06-14 16:49:12.321217	t	{"ops": [{"insert": " uno dos       njnjnj njnjnj njnjn njnjnj njnjn njnj -historia-765874ducua--jjjnnnnnnjjjjjjjjjla%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0-historia-765874ducua--la%20venganza%20de%20las%20zorra%202.0\\n"}]}
\.


--
-- TOC entry 3567 (class 0 OID 33024)
-- Dependencies: 233
-- Data for Name: lista_historia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lista_historia (id_lista, id_historia) FROM stdin;
\.


--
-- TOC entry 3568 (class 0 OID 33046)
-- Dependencies: 234
-- Data for Name: lista_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lista_usuario (id_lista, codigo_usuario) FROM stdin;
\.


--
-- TOC entry 3566 (class 0 OID 33013)
-- Dependencies: 232
-- Data for Name: listas_lectura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listas_lectura (id_lista, nombre_lista, visibilidad) FROM stdin;
\.


--
-- TOC entry 3562 (class 0 OID 16451)
-- Dependencies: 228
-- Data for Name: paises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paises (id_pais, nombre_pais) FROM stdin;
1	Afghanistan
2	Albania
3	Algeria
4	Andorra
5	Angola
6	Antigua and Barbuda
7	Argentina
8	Armenia
9	Australia
10	Austria
11	Azerbaijan
12	Bahamas
13	Bahrain
14	Bangladesh
15	Barbados
16	Belarus
17	Belgium
18	Belize
19	Benin
20	Bhutan
21	Bolivia
22	Bosnia and Herzegovina
23	Botswana
24	Brazil
25	Brunei
26	Bulgaria
27	Burkina Faso
28	Burundi
29	Cabo Verde
30	Cambodia
31	Cameroon
32	Canada
33	Central African Republic
34	Chad
35	Chile
36	China
37	Colombia
38	Comoros
39	Congo, Democratic Republic of the
40	Congo, Republic of the
41	Costa Rica
42	Côte d'Ivoire
43	Croatia
44	Cuba
45	Cyprus
46	Czech Republic
47	Denmark
48	Djibouti
49	Dominica
50	Dominican Republic
51	Ecuador
52	Egypt
53	El Salvador
54	Equatorial Guinea
55	Eritrea
56	Estonia
57	Eswatini
58	Ethiopia
59	Fiji
60	Finland
61	France
62	Gabon
63	Gambia
64	Georgia
65	Germany
66	Ghana
67	Greece
68	Grenada
69	Guatemala
70	Guinea
71	Guinea-Bissau
72	Guyana
73	Haiti
74	Honduras
75	Hungary
76	Iceland
77	India
78	Indonesia
79	Iran
80	Iraq
81	Ireland
82	Israel
83	Italy
84	Jamaica
85	Japan
86	Jordan
87	Kazakhstan
88	Kenya
89	Kiribati
90	Korea, North
91	Korea, South
92	Kuwait
93	Kyrgyzstan
94	Laos
95	Latvia
96	Lebanon
97	Lesotho
98	Liberia
99	Libya
100	Liechtenstein
101	Lithuania
102	Luxembourg
103	Madagascar
104	Malawi
105	Malaysia
106	Maldives
107	Mali
108	Malta
109	Marshall Islands
110	Mauritania
111	Mauritius
112	Mexico
113	Micronesia
114	Moldova
115	Monaco
116	Mongolia
117	Montenegro
118	Morocco
119	Mozambique
120	Myanmar
121	Namibia
122	Nauru
123	Nepal
124	Netherlands
125	New Zealand
126	Nicaragua
127	Niger
128	Nigeria
129	North Macedonia
130	Norway
131	Oman
132	Pakistan
133	Palau
134	Panama
135	Papua New Guinea
136	Paraguay
137	Peru
138	Philippines
139	Poland
140	Portugal
141	Qatar
142	Romania
143	Russia
144	Rwanda
145	Saint Kitts and Nevis
146	Saint Lucia
147	Saint Vincent and the Grenadines
148	Samoa
149	San Marino
150	Sao Tome and Principe
151	Saudi Arabia
152	Senegal
153	Serbia
154	Seychelles
155	Sierra Leone
156	Singapore
157	Slovakia
158	Slovenia
159	Solomon Islands
160	Somalia
161	South Africa
162	South Sudan
163	Spain
164	Sri Lanka
165	Sudan
166	Suriname
167	Sweden
168	Switzerland
169	Syria
170	Taiwan
171	Tajikistan
172	Tanzania
173	Thailand
174	Timor-Leste
175	Togo
176	Tonga
177	Trinidad and Tobago
178	Tunisia
179	Turkey
180	Turkmenistan
181	Tuvalu
182	Uganda
183	Ukraine
184	United Arab Emirates
185	United Kingdom
186	United States
187	Uruguay
188	Uzbekistan
189	Vanuatu
190	Vatican City
191	Venezuela
192	Vietnam
193	Yemen
194	Zambia
195	Zimbabwe
0	undefined
\.


--
-- TOC entry 3563 (class 0 OID 16456)
-- Dependencies: 229
-- Data for Name: paletas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paletas (id_paleta, color1, color2, color3, color_letra, color_letra_fondo, codigo_usuario) FROM stdin;
\.


--
-- TOC entry 3565 (class 0 OID 16466)
-- Dependencies: 231
-- Data for Name: saga; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saga (nombre_saga, codigo_usuario, imagen_saga, id_saga, descripcion_saga, fecha_creacion, fecha_actualizacion) FROM stdin;
461802 2.0	765874ducua	-inicio-765874ducua-461802 2.0_saga.webp	-inicio-765874ducua-461802 2.0	historia para probar el cambio de usuario	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
Ducuara	432028emanu	-inicio-432028emanu-Ducuara_saga.webp	-inicio-432028emanu-Ducuara	Lee y verás	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
uno	765874ducua	-inicio-765874ducua-uno_saga.webp	-inicio-765874ducua-uno	primera saag	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
dos	765874ducua	-inicio-765874ducua-dos_saga.webp	-inicio-765874ducua-dos	segunda saga	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
tres	765874ducua	-inicio-765874ducua-tres_saga.webp	-inicio-765874ducua-tres	tres sagas	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
cuatro	765874ducua	-inicio-765874ducua-cuatro_saga.webp	-inicio-765874ducua-cuatro	cuatro sagas	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
cinco	765874ducua	-inicio-765874ducua-cinco_saga.webp	-inicio-765874ducua-cinco	cinco sagas	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
sesis	765874ducua	-inicio-765874ducua-sesis_saga.webp	-inicio-765874ducua-sesis	seis sagas	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
siete	765874ducua	-inicio-765874ducua-siete_saga.webp	-inicio-765874ducua-siete	siete sagas	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
ocho	765874ducua	-inicio-765874ducua-ocho_saga.webp	-inicio-765874ducua-ocho	ocho sagas	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
szdxgh	765874ducua	-inicio-765874ducua-szdxgh_saga.webp	-inicio-765874ducua-szdxgh	zsdcvbhj	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
xdc	765874ducua	-inicio-765874ducua-xdc_saga.webp	-inicio-765874ducua-xdc	xdcfgbhjn	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
asdasdsad	765874ducua	-inicio-765874ducua-asdasdsad_saga.webp	-inicio-765874ducua-asdasdsad	sadasd	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
La Leyenda de Cientopitos	765874ducua	-inicio-765874ducua-La Leyenda de Cientopitos_saga.webp	-inicio-765874ducua-La Leyenda de Cientopitos	El Protector del Micromundo	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
prueba	765874ducua	-inicio-765874ducua-prueba_saga.webp	-inicio-765874ducua-prueba	asdasdasd	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
La Saga de Cientopitos	765874ducua	-inicio-765874ducua-La Saga de Cientopitos_saga.webp	-inicio-765874ducua-La Saga de Cientopitos	El Despertar del Héroe	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
Saga de testeo	876148magia	-inicio-876148magia-Saga de testeo_saga.webp	-inicio-876148magia-Saga de testeo	saga para testear las sagas	2026-06-03 05:08:02.94485	2026-06-03 05:08:02.94485
The sisters brothers	876148magia	-inicio-876148magia-The sisters brothers_saga.webp	-inicio-876148magia-The sisters brothers	the sisters brothers	2026-06-04 19:55:48.441693	2026-06-04 19:55:48.441693
Hamlet	876148magia	-inicio-876148magia-Hamlet_saga.webp	-inicio-876148magia-Hamlet	Hamlet	2026-06-04 19:56:24.819724	2026-06-04 19:56:24.819724
Polnito liko GRATIS	499342j.f.m	-inicio-499342j.f.m-Polnito liko GRATIS_saga.webp	-inicio-499342j.f.m-Polnito liko GRATIS	encuentra el mejor polnito GRATIS!!!\r\nhttps://es.erome.com/	2026-06-11 19:41:15.756796	2026-06-11 19:41:15.756796
PUTA MIERDA DE PAGINA	121384lovic	-inicio-121384lovic-PUTA MIERDA DE PAGINA_saga.webp	-inicio-121384lovic-PUTA MIERDA DE PAGINA	sin polnito no hay vidahttps://www.xnxx.es/	2026-06-11 20:19:30.693462	2026-06-11 20:19:30.693462
When entras a TeleRIn	121384lovic	-inicio-121384lovic-When entras a TeleRIn_saga.webp	-inicio-121384lovic-When entras a TeleRIn	tremenda pagina 20/10 y god	2026-06-11 21:17:47.752311	2026-06-11 21:17:47.752311
Dios nos ah abandonado	121384lovic	-inicio-121384lovic-Dios nos ah abandonado_saga.webp	-inicio-121384lovic-Dios nos ah abandonado	Hijos de putas dios a salido de la pagina despues de vernos a nosotros	2026-06-11 21:23:01.129447	2026-06-11 21:23:01.129447
When te proyectas en tu pagina	121384lovic	-inicio-121384lovic-When te proyectas en tu pagina_saga.webp	-inicio-121384lovic-When te proyectas en tu pagina	but el profe te regaña	2026-06-11 21:24:24.301979	2026-06-11 21:24:24.301979
When entras a telerin	121384lovic	-inicio-121384lovic-When entras a telerin_saga.webp	-inicio-121384lovic-When entras a telerin	esperando ver polnito	2026-06-11 21:28:43.548426	2026-06-11 21:28:43.548426
Telerin Lore	121384lovic	-inicio-121384lovic-Telerin Lore_saga.webp	-inicio-121384lovic-Telerin Lore	Perros hijueputas	2026-06-11 21:29:17.33163	2026-06-11 21:29:17.33163
2026	121384lovic	-inicio-121384lovic-2026_saga.webp	-inicio-121384lovic-2026	tu compa el que no topa ni el aire	2026-06-11 21:30:39.644344	2026-06-11 21:30:39.644344
Te piden tu parte del trabajo	121384lovic	-inicio-121384lovic-Te piden tu parte del trabajo_saga.webp	-inicio-121384lovic-Te piden tu parte del trabajo	But Ducuara te regaña	2026-06-11 21:32:28.970227	2026-06-11 21:32:28.970227
Entras a esta pagina	121384lovic	-inicio-121384lovic-Entras a esta pagina_saga.webp	-inicio-121384lovic-Entras a esta pagina	Te enteras que no es un casino y es una mierdera pagina de escritura y no mas vales pa pura verga	2026-06-11 21:33:39.324313	2026-06-11 21:33:39.324313
Top excusas	121384lovic	-inicio-121384lovic-Top excusas_saga.webp	-inicio-121384lovic-Top excusas	Top excusas que ni en tu putisima perra existencia escucharas	2026-06-11 21:40:09.529199	2026-06-11 21:40:09.529199
Hola amiguitos	121384lovic	-inicio-121384lovic-Hola amiguitos_saga.webp	-inicio-121384lovic-Hola amiguitos	When saludas a tus amiguitos programadores y te regañan por chimbear	2026-06-11 21:40:52.935516	2026-06-11 21:40:52.935516
when te gritan	121384lovic	-inicio-121384lovic-when te gritan_saga.webp	-inicio-121384lovic-when te gritan	but eres un lobo solitario fucking bestia armada con legos	2026-06-11 21:41:53.729367	2026-06-11 21:41:53.729367
te ven chimbeando en la pagina	121384lovic	-inicio-121384lovic-te ven chimbeando en la pagina_saga.webp	-inicio-121384lovic-te ven chimbeando en la pagina	El regaño del profe se asoma por la ventana	2026-06-11 21:42:48.405783	2026-06-11 21:42:48.405783
Tus amiguitos entran a tu perfil	121384lovic	-inicio-121384lovic-Tus amiguitos entran a tu perfil_saga.webp	-inicio-121384lovic-Tus amiguitos entran a tu perfil	Y te regañan por andar perdiendo el tiempo con tus momazos farmeadores de aura en la pagina del senita rico	2026-06-11 21:50:16.658824	2026-06-11 21:50:16.658824
Damn	121384lovic	-inicio-121384lovic-Damn_saga.webp	-inicio-121384lovic-Damn	Cuando rompes la pagina por tus mmdas	2026-06-11 21:55:02.529932	2026-06-11 21:55:02.529932
._.	121384lovic	-inicio-121384lovic-._._saga.webp	-inicio-121384lovic-._.	Como te mira ducuara despues de romper la pagina de la manera mas estupida y subreal posible	2026-06-11 21:56:36.262726	2026-06-11 21:56:36.262726
Diavlazo	121384lovic	-inicio-121384lovic-Diavlazo_saga.webp	-inicio-121384lovic-Diavlazo	Cuando tienes una amiga chichona y abusas de tus privilegios	2026-06-11 21:57:17.500885	2026-06-11 21:57:17.500885
WE	121384lovic	-inicio-121384lovic-WE_saga.webp	-inicio-121384lovic-WE	Nosotros viendo que mmdas podemos a TeleRin	2026-06-11 21:58:08.447883	2026-06-11 21:58:08.447883
Meme nivel D	121384lovic	-inicio-121384lovic-Meme nivel D_saga.webp	-inicio-121384lovic-Meme nivel D	Haces un meme para que Ducuara se ria	2026-06-11 22:06:26.760107	2026-06-11 22:06:26.760107
granja	765874ducua	-inicio-765874ducua-granja_saga.webp	-inicio-765874ducua-granja	historias de animales	2026-06-12 23:26:13.880195	2026-06-12 23:26:13.880195
libros prueba	765874ducua	-inicio-765874ducua-libros prueba_saga.webp	-inicio-765874ducua-libros prueba	probando sistema de guardado de imagenes	2026-06-18 03:11:56.628428	2026-06-18 03:11:56.628428
\.


--
-- TOC entry 3569 (class 0 OID 41272)
-- Dependencies: 235
-- Data for Name: usuarios_seguidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios_seguidos (codigo_usuario_seguido, codigo_usuario_seguidor, fecha_seguimiento) FROM stdin;
765874ducua	876148magia	2026-06-04 21:31:39.166512
765874ducua	338603teler	2026-06-04 21:39:04.8442
338603teler	121384lovic	2026-06-04 21:51:30.461754
765874ducua	499342j.f.m	2026-06-11 21:26:55.775275
876148magia	499342j.f.m	2026-06-11 21:27:59.288448
338603teler	499342j.f.m	2026-06-11 21:28:03.873648
121384lovic	499342j.f.m	2026-06-11 21:28:27.905399
499342j.f.m	876148magia	2026-06-11 21:34:28.63012
499342j.f.m	121384lovic	2026-06-11 21:35:05.563384
765874ducua	121384lovic	2026-06-11 21:35:18.261508
876148magia	121384lovic	2026-06-11 21:35:18.767423
338603teler	765874ducua	2026-06-15 16:57:58.539372
499342j.f.m	765874ducua	2026-06-18 04:19:02.855497
\.


--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 224
-- Name: hashtags_id_hashtag_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hashtags_id_hashtag_seq', 6, true);


--
-- TOC entry 3578 (class 0 OID 0)
-- Dependencies: 230
-- Name: paletas_id_paleta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paletas_id_paleta_seq', 7, true);


--
-- TOC entry 3363 (class 2606 OID 32975)
-- Name: USUARIOS USUARIOS_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USUARIOS"
    ADD CONSTRAINT "USUARIOS_pkey" PRIMARY KEY (codigo_usuario);


--
-- TOC entry 3365 (class 2606 OID 33011)
-- Name: USUARIOS correo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USUARIOS"
    ADD CONSTRAINT correo UNIQUE (correo_usuario);


--
-- TOC entry 3368 (class 2606 OID 16481)
-- Name: generos generos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generos
    ADD CONSTRAINT generos_pkey PRIMARY KEY (id_genero);


--
-- TOC entry 3370 (class 2606 OID 16483)
-- Name: hashtags hashtags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags
    ADD CONSTRAINT hashtags_pkey PRIMARY KEY (id_hashtag);


--
-- TOC entry 3375 (class 2606 OID 16485)
-- Name: historias historias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historias
    ADD CONSTRAINT historias_pkey PRIMARY KEY (id_historia);


--
-- TOC entry 3385 (class 2606 OID 33023)
-- Name: listas_lectura listas_lectura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listas_lectura
    ADD CONSTRAINT listas_lectura_pkey PRIMARY KEY (id_lista);


--
-- TOC entry 3379 (class 2606 OID 16487)
-- Name: paises paises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paises
    ADD CONSTRAINT paises_pkey PRIMARY KEY (id_pais);


--
-- TOC entry 3381 (class 2606 OID 16489)
-- Name: paletas paletas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paletas
    ADD CONSTRAINT paletas_pkey PRIMARY KEY (id_paleta);


--
-- TOC entry 3383 (class 2606 OID 16491)
-- Name: saga saga_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saga
    ADD CONSTRAINT saga_pkey PRIMARY KEY (id_saga);


--
-- TOC entry 3373 (class 2606 OID 16561)
-- Name: historial uk_historial_usuario_historia; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT uk_historial_usuario_historia UNIQUE (codigo_usuario, id_historia);


--
-- TOC entry 3387 (class 2606 OID 41282)
-- Name: usuarios_seguidos unico_usuario_seguidor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_seguidos
    ADD CONSTRAINT unico_usuario_seguidor UNIQUE (codigo_usuario_seguido, codigo_usuario_seguidor);


--
-- TOC entry 3376 (class 1259 OID 16492)
-- Name: idx_id_historia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_id_historia ON public.historias USING btree (id_historia);


--
-- TOC entry 3366 (class 1259 OID 16493)
-- Name: idx_id_historia_calificacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_id_historia_calificacion ON public.calificacion_historia USING btree (id_historia);


--
-- TOC entry 3377 (class 1259 OID 16494)
-- Name: idx_id_saga; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_id_saga ON public.historias USING btree (id_saga);


--
-- TOC entry 3371 (class 1259 OID 16495)
-- Name: idx_nombre_hashtag; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nombre_hashtag ON public.hashtags USING btree (nombre_hashtag);


--
-- TOC entry 3405 (class 2620 OID 41271)
-- Name: saga act_fecha_actualizacion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER act_fecha_actualizacion BEFORE UPDATE ON public.saga FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();


--
-- TOC entry 3404 (class 2620 OID 41264)
-- Name: historias actr_fecha_actualizacion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER actr_fecha_actualizacion BEFORE UPDATE ON public.historias FOR EACH ROW EXECUTE FUNCTION public.actualizar_fecha_actualizacion();


--
-- TOC entry 3388 (class 2606 OID 32977)
-- Name: calificacion_historia codigo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificacion_historia
    ADD CONSTRAINT codigo_usuario FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


--
-- TOC entry 3394 (class 2606 OID 32982)
-- Name: historial codigo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT codigo_usuario FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


--
-- TOC entry 3400 (class 2606 OID 33058)
-- Name: lista_usuario codigo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_usuario
    ADD CONSTRAINT codigo_usuario FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario);


--
-- TOC entry 3397 (class 2606 OID 32987)
-- Name: saga codigo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saga
    ADD CONSTRAINT codigo_usuario FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


--
-- TOC entry 3402 (class 2606 OID 41283)
-- Name: usuarios_seguidos codigo_usuario_seguido; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_seguidos
    ADD CONSTRAINT codigo_usuario_seguido FOREIGN KEY (codigo_usuario_seguido) REFERENCES public."USUARIOS"(codigo_usuario);


--
-- TOC entry 3403 (class 2606 OID 41288)
-- Name: usuarios_seguidos codigo_usuario_seguidor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_seguidos
    ADD CONSTRAINT codigo_usuario_seguidor FOREIGN KEY (codigo_usuario_seguidor) REFERENCES public."USUARIOS"(codigo_usuario);


--
-- TOC entry 3390 (class 2606 OID 16511)
-- Name: hashtags_historias id_hashtag; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags_historias
    ADD CONSTRAINT id_hashtag FOREIGN KEY (id_hashtag) REFERENCES public.hashtags(id_hashtag) NOT VALID;


--
-- TOC entry 3392 (class 2606 OID 16516)
-- Name: hashtags_sagas id_hashtag; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags_sagas
    ADD CONSTRAINT id_hashtag FOREIGN KEY (id_hashtag) REFERENCES public.hashtags(id_hashtag);


--
-- TOC entry 3389 (class 2606 OID 16521)
-- Name: calificacion_historia id_historia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificacion_historia
    ADD CONSTRAINT id_historia FOREIGN KEY (id_historia) REFERENCES public.historias(id_historia) NOT VALID;


--
-- TOC entry 3391 (class 2606 OID 16526)
-- Name: hashtags_historias id_historia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags_historias
    ADD CONSTRAINT id_historia FOREIGN KEY (id_historia) REFERENCES public.historias(id_historia) NOT VALID;


--
-- TOC entry 3395 (class 2606 OID 16531)
-- Name: historial id_historia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT id_historia FOREIGN KEY (id_historia) REFERENCES public.historias(id_historia) NOT VALID;


--
-- TOC entry 3398 (class 2606 OID 33036)
-- Name: lista_historia id_historia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_historia
    ADD CONSTRAINT id_historia FOREIGN KEY (id_historia) REFERENCES public.historias(id_historia);


--
-- TOC entry 3399 (class 2606 OID 33031)
-- Name: lista_historia id_lista; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_historia
    ADD CONSTRAINT id_lista FOREIGN KEY (id_lista) REFERENCES public.listas_lectura(id_lista);


--
-- TOC entry 3401 (class 2606 OID 33053)
-- Name: lista_usuario id_lista; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_usuario
    ADD CONSTRAINT id_lista FOREIGN KEY (id_lista) REFERENCES public.listas_lectura(id_lista);


--
-- TOC entry 3393 (class 2606 OID 16546)
-- Name: hashtags_sagas id_saga; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags_sagas
    ADD CONSTRAINT id_saga FOREIGN KEY (id_saga) REFERENCES public.saga(id_saga);


--
-- TOC entry 3396 (class 2606 OID 32992)
-- Name: paletas paletas_codigo_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paletas
    ADD CONSTRAINT paletas_codigo_usuario_fkey FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


-- Completed on 2026-06-18 00:04:00

--
-- PostgreSQL database dump complete
--

\unrestrict WNbnNsM7QdXLCt8GVUDnQpEHQMKKhboTraubZc14LS9I8dlggpYsy0naPhKhOz4

