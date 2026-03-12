--
-- PostgreSQL database dump
--

\restrict qEoYa9VdPJI2vJRPWIAVusbvLXirPo85EDnEsgLwYgNqhhalxhHQbFacUY8SbTo

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg13+1)
-- Dumped by pg_dump version 18.1

-- Started on 2026-03-12 17:31:29

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16385)
-- Name: USUARIOS; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."USUARIOS" (
    nombre_usuario character varying(100) CONSTRAINT usuarios_nombre_not_null NOT NULL,
    correo_usuario character varying(100) CONSTRAINT usuarios_correo_not_null NOT NULL,
    "contraseña_usuario" character varying(255) CONSTRAINT usuarios_contrasena_not_null NOT NULL,
    id_pais integer,
    id_genero integer,
    descripcion_personal text,
    foto_perfil_usuario character varying(225),
    ip_usuario character varying(225),
    codigo_usuario character varying NOT NULL
);


ALTER TABLE public."USUARIOS" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16394)
-- Name: calificacion_historia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calificacion_historia (
    codigo_usuario character varying(100) CONSTRAINT calificacion_historia_correo_usuario_not_null NOT NULL,
    id_historia character varying NOT NULL,
    calificacion integer NOT NULL
);


ALTER TABLE public.calificacion_historia OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16402)
-- Name: generos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.generos (
    id_genero integer NOT NULL,
    nombre_genero text NOT NULL
);


ALTER TABLE public.generos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16409)
-- Name: hashtags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hashtags (
    nombre_hashtag character varying NOT NULL,
    id_hashtag integer NOT NULL
);


ALTER TABLE public.hashtags OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16416)
-- Name: hashtags_historias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hashtags_historias (
    id_historia character varying NOT NULL,
    id_hashtag integer NOT NULL
);


ALTER TABLE public.hashtags_historias OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16423)
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
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 224
-- Name: hashtags_id_hashtag_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hashtags_id_hashtag_seq OWNED BY public.hashtags.id_hashtag;


--
-- TOC entry 225 (class 1259 OID 16424)
-- Name: historial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial (
    id_historia character varying NOT NULL,
    tiempo_vista timestamp without time zone NOT NULL,
    codigo_usuario character varying NOT NULL
);


ALTER TABLE public.historial OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16432)
-- Name: historias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historias (
    nombre_historia character varying(100) CONSTRAINT historias_nombre_not_null NOT NULL,
    descripcion_historia text,
    visibilidad_historia boolean DEFAULT false CONSTRAINT historias_visibilidad_not_null NOT NULL,
    id_saga text,
    fecha_actualizacion time without time zone,
    id_historia text NOT NULL,
    contenido_historia jsonb NOT NULL,
    codigo_usuario character varying NOT NULL
);


ALTER TABLE public.historias OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16443)
-- Name: paises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paises (
    id_pais integer NOT NULL,
    nombre_pais character varying(100) NOT NULL
);


ALTER TABLE public.paises OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16448)
-- Name: saga; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saga (
    nombre_saga character varying(100) CONSTRAINT saga_nombre_not_null NOT NULL,
    codigo_usuario character varying CONSTRAINT saga_correo_usuario_not_null NOT NULL,
    imagen_saga character varying(225) NOT NULL,
    id_saga text NOT NULL,
    descripcion_saga text NOT NULL
);


ALTER TABLE public.saga OWNER TO postgres;

--
-- TOC entry 3321 (class 2604 OID 16458)
-- Name: hashtags id_hashtag; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags ALTER COLUMN id_hashtag SET DEFAULT nextval('public.hashtags_id_hashtag_seq'::regclass);


--
-- TOC entry 3494 (class 0 OID 16385)
-- Dependencies: 219
-- Data for Name: USUARIOS; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."USUARIOS" (nombre_usuario, correo_usuario, "contraseña_usuario", id_pais, id_genero, descripcion_personal, foto_perfil_usuario, ip_usuario, codigo_usuario) FROM stdin;
Yesi	yesickrivera@gmail.com	scrypt:32768:8:1$mgfPi1AwZmlLjL4S$fc94fd67e5b212bfe3bd3e5d1c85a5d3607bd403592c906f6b3a94ed4ac4f1b12f418deb467dea9634f744106910b21f8881128f3acc3d7d2117476629cdd98e	0	0	\N	predefinido.jpg	scrypt:32768:8:1$gf1y4v7z0b5FJPEY$ac1fd1bc9d957f71ffaa860a760ad37d17090e36fd8d7f6eaddad6510129bbc8ebf68777afb69bf8d93fddfc25ca576484c37e5595bfa2901ad252fe179bb27f	940371yesic
isaacKawaiUwU 2.0	ducuarasatizabalalejandro@gmail.com	scrypt:32768:8:1$wd6rx8ojlp1ICMPM$f30630e8f8b2d55732222b2c788ae18827af4db70acb1323ad7c74d461ef07f2c24568fbc17728dfc47f1f9fcf34c80ccf5d722980e7ad660dd67dfc282d8780	192	1	hola1234 :)	994474ducua_perfil.jpg	scrypt:32768:8:1$NH6127k2G1V2oE68$f58127711bb1636b58fcd56b896c3732ededb87735a5799ab73adeda17a45236216eeac507f6d996ab9782e04afc8cd524e8b7d826a5d6b8775c8e92a59d6417	994474ducua
alejandro	aleducsa@alpumarejopalmira.edu.co	scrypt:32768:8:1$nfDWd4ChH9eLPV7T$83d9a6d62fc76d27f1ba44052328f94cc911b46f9b67e35be38d45e5cfddf49ff33a56835c96a95ab899dbc995c7e54ffc512f0ef942dcf22bc024b9f4c264d3	37	1	programador	924583aledu_perfil.jpg	scrypt:32768:8:1$I11nPMAXqpntDtBd$d9fb4b4390212ecb1a70aada84417b2a1f26886f14ee2e762c2e86173011e3c8a941951cd36327c3a74775d2efa9c03dc9c84d1ce14ada79fc8ecb406da42189	924583aledu
\.


--
-- TOC entry 3495 (class 0 OID 16394)
-- Dependencies: 220
-- Data for Name: calificacion_historia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calificacion_historia (codigo_usuario, id_historia, calificacion) FROM stdin;
994474ducua	-historia-924583aledu-un Historia	1
924583aledu	-historia-994474ducua-1	1
924583aledu	-historia-994474ducua-prueba 34	1
994474ducua	-historia-994474ducua-1	3
994474ducua	-historia-994474ducua-prueba 34	3
\.


--
-- TOC entry 3496 (class 0 OID 16402)
-- Dependencies: 221
-- Data for Name: generos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.generos (id_genero, nombre_genero) FROM stdin;
1	Masculino
2	Femenino
0	Undefined
3	hipopotamo
\.


--
-- TOC entry 3497 (class 0 OID 16409)
-- Dependencies: 222
-- Data for Name: hashtags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hashtags (nombre_hashtag, id_hashtag) FROM stdin;
help	1
aaaaaaa	2
adasdasd	3
cienciaficcion	4
realidadvirtual	5
\.


--
-- TOC entry 3498 (class 0 OID 16416)
-- Dependencies: 223
-- Data for Name: hashtags_historias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hashtags_historias (id_historia, id_hashtag) FROM stdin;
-historia-924583aledu--Ahora si la primer histora con #	4
-historia-994474ducua--probando recomendador	4
\.


--
-- TOC entry 3500 (class 0 OID 16424)
-- Dependencies: 225
-- Data for Name: historial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial (id_historia, tiempo_vista, codigo_usuario) FROM stdin;
-historia-994474ducua-1	2026-03-12 19:46:44	924583aledu
-historia-994474ducua-prueba 34	2026-03-12 19:55:40	924583aledu
-historia-994474ducua-1	2026-03-12 20:24:29	994474ducua
-historia-994474ducua-prueba 34	2026-03-12 20:48:57	994474ducua
\.


--
-- TOC entry 3501 (class 0 OID 16432)
-- Dependencies: 226
-- Data for Name: historias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historias (nombre_historia, descripcion_historia, visibilidad_historia, id_saga, fecha_actualizacion, id_historia, contenido_historia, codigo_usuario) FROM stdin;
primer historia de la pagina	asdasdsadasd	t		12:37:35	-historia-994474ducua-primer historia de la pagina	{"ops": [{"insert": "primer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprime"}, {"insert": "r histoariaprimer histoaria", "attributes": {"underline": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"underline": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"underline": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"underline": true}}, {"insert": "\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\np"}, {"insert": "rimer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoariaprimer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoariaprimer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoariaprimer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\nprimer histoariaprimer histoaria\\n\\n\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\n"}]}	994474ducua
un Historia	historia de prueba	t		13:40:18	-historia-924583aledu-un Historia	{"ops": [{"insert": "esta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\n es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\n\\n es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\n es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\n es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\n"}]}	924583aledu
2	1234	t		11:03:06	-historia-994474ducua-2	{"ops": [{"insert": "\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;v\\n"}]}	994474ducua
primer historia con hashtag	#help nuestro primer hashtag	t		21:08:43	-historia-994474ducua--primer historia con hashtag	{"ops": [{"insert": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaa\\n"}]}	994474ducua
segunda historia con hashtags	aaaaa #aaaaaaa aaaaaaaa aaaasdasdas #adasdasd asdasdasdasd	t		22:30:49	-historia-994474ducua--segunda historia con hashtags	{"ops": [{"insert": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\n"}]}	994474ducua
1	1234	t	-inicio-994474ducua-la noche	10:55:34	-historia-994474ducua-1	{"ops": [{"insert": "asdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\n"}]}	994474ducua
prueba 34	uno dos tras	t	-inicio-994474ducua-la noche	22:33:28	-historia-994474ducua-prueba 34	{"ops": [{"insert": "asdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\n"}]}	994474ducua
Ahora si la primer histora con #	#cienciaFiccion	t		17:26:49	-historia-924583aledu--Ahora si la primer histora con #	{"ops": [{"insert": "El Programador y la Puerta\\nAlejandro siempre había tenido una curiosidad extraña por las cosas que no entendía. Mientras otros veían una computadora como una simple máquina, él la veía como una puerta.\\nUna noche, mientras programaba en silencio, la pantalla mostró algo raro.\\nConexión establecida.\\n¿Deseas continuar?\\nAlejandro frunció el ceño.\\n—Yo no programé esto… —murmuró.\\nPensó que era un error, pero su curiosidad pudo más. Escribió:\\nsí\\nLa pantalla parpadeó.\\nBienvenido.\\nHas encontrado la puerta.\\nEl cursor comenzó a escribir solo.\\nCada programador cree que crea sistemas…\\npero algunos sistemas también crean programadores.\\nDe pronto, todas sus carpetas se abrieron: proyectos viejos, códigos olvidados, experimentos que nunca terminó.\\nEntonces apareció otro mensaje.\\n¿Quieres ver lo que podrías crear?\\nLa computadora empezó a mostrar versiones de proyectos que Alejandro nunca había hecho: una red social gigantesca, un sistema de inteligencia artificial, videojuegos y herramientas usadas por millones de personas.\\nAlejandro sintió algo extraño. No era miedo.\\nEra posibilidad.\\nLa pantalla mostró el último mensaje:\\nLa puerta no crea el futuro.\\nSolo muestra lo que podrías hacer si sigues programando.\\nLa pantalla volvió a la normalidad.\\nSilencio.\\nAlejandro miró su editor de código, sonrió y empezó a escribir otra vez.\\n"}]}	924583aledu
probando recomendador	#CIENCIAFICCION cinco cuatro tres dos uno	t		20:14:47	-historia-994474ducua--probando recomendador	{"ops": [{"insert": "-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1-historia-994474ducua-1\\n"}]}	994474ducua
\.


--
-- TOC entry 3502 (class 0 OID 16443)
-- Dependencies: 227
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
-- TOC entry 3503 (class 0 OID 16448)
-- Dependencies: 228
-- Data for Name: saga; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saga (nombre_saga, codigo_usuario, imagen_saga, id_saga, descripcion_saga) FROM stdin;
gojo	994474ducua	-inicio-994474ducua-gojo_saga.jpg	-inicio-994474ducua-gojo	fe
peroro	994474ducua	-inicio-994474ducua-peroro_saga.jpg	-inicio-994474ducua-peroro	comunismo
saitama	994474ducua	-inicio-994474ducua-saitama_saga.jpg	-inicio-994474ducua-saitama	jaja
hollow kingh	994474ducua	-inicio-994474ducua-hollow kingh_saga.jpg	-inicio-994474ducua-hollow kingh	silksong
cuphead	994474ducua	-inicio-994474ducua-cuphead_saga.jpg	-inicio-994474ducua-cuphead	ijoikjk
ingreso	994474ducua	-inicio-994474ducua-ingreso_saga.jpg	-inicio-994474ducua-ingreso	ijoikjk
la noche	994474ducua	-inicio-994474ducua-la noche_saga.jpg	-inicio-994474ducua-la noche	historias de noche texto deprueba para ver que tal se ve si el texto aumenta de tamaño
\.


--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 224
-- Name: hashtags_id_hashtag_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hashtags_id_hashtag_seq', 5, true);


--
-- TOC entry 3324 (class 2606 OID 16460)
-- Name: USUARIOS USUARIOS_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USUARIOS"
    ADD CONSTRAINT "USUARIOS_pkey" PRIMARY KEY (codigo_usuario);


--
-- TOC entry 3327 (class 2606 OID 16462)
-- Name: generos generos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generos
    ADD CONSTRAINT generos_pkey PRIMARY KEY (id_genero);


--
-- TOC entry 3329 (class 2606 OID 16464)
-- Name: hashtags hashtags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags
    ADD CONSTRAINT hashtags_pkey PRIMARY KEY (id_hashtag);


--
-- TOC entry 3332 (class 2606 OID 16466)
-- Name: historias historias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historias
    ADD CONSTRAINT historias_pkey PRIMARY KEY (id_historia);


--
-- TOC entry 3336 (class 2606 OID 16468)
-- Name: paises paises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paises
    ADD CONSTRAINT paises_pkey PRIMARY KEY (id_pais);


--
-- TOC entry 3338 (class 2606 OID 16470)
-- Name: saga saga_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saga
    ADD CONSTRAINT saga_pkey PRIMARY KEY (id_saga);


--
-- TOC entry 3333 (class 1259 OID 16471)
-- Name: idx_id_historia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_id_historia ON public.historias USING btree (id_historia);


--
-- TOC entry 3325 (class 1259 OID 16472)
-- Name: idx_id_historia_calificacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_id_historia_calificacion ON public.calificacion_historia USING btree (id_historia);


--
-- TOC entry 3334 (class 1259 OID 16473)
-- Name: idx_id_saga; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_id_saga ON public.historias USING btree (id_saga);


--
-- TOC entry 3330 (class 1259 OID 16474)
-- Name: idx_nombre_hashtag; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nombre_hashtag ON public.hashtags USING btree (nombre_hashtag);


--
-- TOC entry 3340 (class 2606 OID 16475)
-- Name: calificacion_historia codigo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificacion_historia
    ADD CONSTRAINT codigo_usuario FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


--
-- TOC entry 3344 (class 2606 OID 16480)
-- Name: historial codigo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT codigo_usuario FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


--
-- TOC entry 3346 (class 2606 OID 16485)
-- Name: saga codigo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saga
    ADD CONSTRAINT codigo_usuario FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


--
-- TOC entry 3342 (class 2606 OID 16490)
-- Name: hashtags_historias id_hashtag; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags_historias
    ADD CONSTRAINT id_hashtag FOREIGN KEY (id_hashtag) REFERENCES public.hashtags(id_hashtag) NOT VALID;


--
-- TOC entry 3341 (class 2606 OID 16495)
-- Name: calificacion_historia id_historia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificacion_historia
    ADD CONSTRAINT id_historia FOREIGN KEY (id_historia) REFERENCES public.historias(id_historia) NOT VALID;


--
-- TOC entry 3343 (class 2606 OID 16500)
-- Name: hashtags_historias id_historia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags_historias
    ADD CONSTRAINT id_historia FOREIGN KEY (id_historia) REFERENCES public.historias(id_historia) NOT VALID;


--
-- TOC entry 3345 (class 2606 OID 16505)
-- Name: historial id_historia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT id_historia FOREIGN KEY (id_historia) REFERENCES public.historias(id_historia) NOT VALID;


--
-- TOC entry 3339 (class 2606 OID 16510)
-- Name: USUARIOS id_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USUARIOS"
    ADD CONSTRAINT id_pais FOREIGN KEY (id_pais) REFERENCES public.paises(id_pais) NOT VALID;


-- Completed on 2026-03-12 17:31:29

--
-- PostgreSQL database dump complete
--

\unrestrict qEoYa9VdPJI2vJRPWIAVusbvLXirPo85EDnEsgLwYgNqhhalxhHQbFacUY8SbTo

