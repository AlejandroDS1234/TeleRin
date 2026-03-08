--
-- PostgreSQL database dump
--

\restrict 0Gh2aNRn4wmPbaY1stRkbmeQ6M4qgvCLLDE3VkkRWoef2amZsAw9AiPUH2Nef53

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-03-08 07:56:44

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
-- TOC entry 219 (class 1259 OID 41027)
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
-- TOC entry 224 (class 1259 OID 49218)
-- Name: calificacion_historia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calificacion_historia (
    codigo_usuario character varying(100) CONSTRAINT calificacion_historia_correo_usuario_not_null NOT NULL,
    id_historia character varying NOT NULL,
    calificacion integer NOT NULL
);


ALTER TABLE public.calificacion_historia OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 41036)
-- Name: generos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.generos (
    id_genero integer NOT NULL,
    nombre_genero text NOT NULL
);


ALTER TABLE public.generos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 41043)
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
-- TOC entry 222 (class 1259 OID 41054)
-- Name: paises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paises (
    id_pais integer NOT NULL,
    nombre_pais character varying(100) NOT NULL
);


ALTER TABLE public.paises OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 41059)
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
-- TOC entry 4990 (class 0 OID 41027)
-- Dependencies: 219
-- Data for Name: USUARIOS; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."USUARIOS" (nombre_usuario, correo_usuario, "contraseña_usuario", id_pais, id_genero, descripcion_personal, foto_perfil_usuario, ip_usuario, codigo_usuario) FROM stdin;
alejandro	aleducsa@alpumarejopalmira.edu.co	scrypt:32768:8:1$x58Vz4MAnTF2sIND$4f143482ca524651d0bd81122ecc8835507a7861dc5ba16f08a9dccb40bd3e5a194bfa9d90b68937eaa91ff408252b9e2f6050de8dee11260fd06c65cc91b663	37	1	programador	924583aledu_perfil.jpg	scrypt:32768:8:1$tDPxfgpJEDpJq2V5$2d30bf0d163ff543b3a9d0d162a3ebc9816d717a966ac428c2a48149c7aa0fbed935d760d6ee41dd234849084be08cbb24d58d50b64385c5ed67d2a226f1d8fe	924583aledu
Yesi	yesickrivera@gmail.com	scrypt:32768:8:1$mgfPi1AwZmlLjL4S$fc94fd67e5b212bfe3bd3e5d1c85a5d3607bd403592c906f6b3a94ed4ac4f1b12f418deb467dea9634f744106910b21f8881128f3acc3d7d2117476629cdd98e	0	0	\N	predefinido.jpg	scrypt:32768:8:1$gf1y4v7z0b5FJPEY$ac1fd1bc9d957f71ffaa860a760ad37d17090e36fd8d7f6eaddad6510129bbc8ebf68777afb69bf8d93fddfc25ca576484c37e5595bfa2901ad252fe179bb27f	940371yesic
isaacKawaiUwU 2.0	ducuarasatizabalalejandro@gmail.com	scrypt:32768:8:1$wd6rx8ojlp1ICMPM$f30630e8f8b2d55732222b2c788ae18827af4db70acb1323ad7c74d461ef07f2c24568fbc17728dfc47f1f9fcf34c80ccf5d722980e7ad660dd67dfc282d8780	7	1	hola1234	994474ducua_perfil.jpg	scrypt:32768:8:1$5SpG5YOtdT5tNl3D$a8a1fae975ad90c0a18594ad011d5fdd9293d244d38d29de59cc7feb113502429639db896156116b05503db3e282b6be83cb94d49b1325cffb104cb021ecfe73	994474ducua
\.


--
-- TOC entry 4995 (class 0 OID 49218)
-- Dependencies: 224
-- Data for Name: calificacion_historia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calificacion_historia (codigo_usuario, id_historia, calificacion) FROM stdin;
994474ducua	-historia-924583aledu-un Historia	1
\.


--
-- TOC entry 4991 (class 0 OID 41036)
-- Dependencies: 220
-- Data for Name: generos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.generos (id_genero, nombre_genero) FROM stdin;
1	Masculino
2	Femenino
0	Undefined
\.


--
-- TOC entry 4992 (class 0 OID 41043)
-- Dependencies: 221
-- Data for Name: historias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historias (nombre_historia, descripcion_historia, visibilidad_historia, id_saga, fecha_actualizacion, id_historia, contenido_historia, codigo_usuario) FROM stdin;
primer historia de la pagina	asdasdsadasd	t		12:37:35	-historia-994474ducua-primer historia de la pagina	{"ops": [{"insert": "primer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprime"}, {"insert": "r histoariaprimer histoaria", "attributes": {"underline": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"underline": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"underline": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"underline": true}}, {"insert": "\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\np"}, {"insert": "rimer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoariaprimer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoariaprimer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoariaprimer histoaria", "attributes": {"bold": true}}, {"insert": "\\n"}, {"insert": "primer histoaria", "attributes": {"bold": true}}, {"insert": "\\nprimer histoariaprimer histoaria\\n\\n\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\nprimer histoaria\\nprimer histoariaprimer histoaria\\n"}]}	994474ducua
un Historia	historia de prueba	t		13:40:18	-historia-924583aledu-un Historia	{"ops": [{"insert": "esta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\n es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\n\\n es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\n es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\n es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\nesta es una historia\\n"}]}	924583aledu
prueba 34	uno dos tras	t	-inicio-994474ducua-la%20noche	22:33:28	-historia-994474ducua-prueba 34	{"ops": [{"insert": "asdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\nasddddddddddddddddddddddddddddddasdddddddddddddddddddddddddddddd\\nasdddddddddddddddddddddddddddddd\\n"}]}	994474ducua
1	1234	t	-inicio-994474ducua-la%20noche	10:55:34	-historia-994474ducua-1	{"ops": [{"insert": "asdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasddddddddddddddddddasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\nasdddddddddddddddddd\\n"}]}	994474ducua
2	1234	t		11:03:06	-historia-994474ducua-2	{"ops": [{"insert": "\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;\\nALTER TABLE historias\\nDROP CONSTRAINT historias_descripcion_key;v\\n"}]}	994474ducua
\.


--
-- TOC entry 4993 (class 0 OID 41054)
-- Dependencies: 222
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
-- TOC entry 4994 (class 0 OID 41059)
-- Dependencies: 223
-- Data for Name: saga; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saga (nombre_saga, codigo_usuario, imagen_saga, id_saga, descripcion_saga) FROM stdin;
gojo	994474ducua	-inicio-994474ducua-gojo_saga.jpg	-inicio-994474ducua-gojo	fe
peroro	994474ducua	-inicio-994474ducua-peroro_saga.jpg	-inicio-994474ducua-peroro	comunismo
saitama	994474ducua	-inicio-994474ducua-saitama_saga.jpg	-inicio-994474ducua-saitama	jaja
hollow kingh	994474ducua	-inicio-994474ducua-hollow kingh_saga.jpg	-inicio-994474ducua-hollow kingh	silksong
cuphead	994474ducua	-inicio-994474ducua-cuphead_saga.jpg	-inicio-994474ducua-cuphead	ijoikjk
ingreso	994474ducua	-inicio-994474ducua-ingreso_saga.jpg	-inicio-994474ducua-ingreso	ijoikjk
la noche	994474ducua	-inicio-994474ducua-la noche_saga.jpg	-inicio-994474ducua-la noche	historias de noche
\.


--
-- TOC entry 4830 (class 2606 OID 41070)
-- Name: USUARIOS USUARIOS_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USUARIOS"
    ADD CONSTRAINT "USUARIOS_pkey" PRIMARY KEY (codigo_usuario);


--
-- TOC entry 4832 (class 2606 OID 41072)
-- Name: generos generos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generos
    ADD CONSTRAINT generos_pkey PRIMARY KEY (id_genero);


--
-- TOC entry 4834 (class 2606 OID 41076)
-- Name: historias historias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historias
    ADD CONSTRAINT historias_pkey PRIMARY KEY (id_historia);


--
-- TOC entry 4836 (class 2606 OID 41078)
-- Name: paises paises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paises
    ADD CONSTRAINT paises_pkey PRIMARY KEY (id_pais);


--
-- TOC entry 4838 (class 2606 OID 41080)
-- Name: saga saga_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saga
    ADD CONSTRAINT saga_pkey PRIMARY KEY (id_saga);


--
-- TOC entry 4841 (class 2606 OID 49243)
-- Name: calificacion_historia codigo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificacion_historia
    ADD CONSTRAINT codigo_usuario FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


--
-- TOC entry 4840 (class 2606 OID 41081)
-- Name: saga codigo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saga
    ADD CONSTRAINT codigo_usuario FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


--
-- TOC entry 4842 (class 2606 OID 49238)
-- Name: calificacion_historia id_historia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificacion_historia
    ADD CONSTRAINT id_historia FOREIGN KEY (id_historia) REFERENCES public.historias(id_historia) NOT VALID;


--
-- TOC entry 4839 (class 2606 OID 41086)
-- Name: USUARIOS id_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USUARIOS"
    ADD CONSTRAINT id_pais FOREIGN KEY (id_pais) REFERENCES public.paises(id_pais) NOT VALID;


-- Completed on 2026-03-08 07:56:45

--
-- PostgreSQL database dump complete
--

\unrestrict 0Gh2aNRn4wmPbaY1stRkbmeQ6M4qgvCLLDE3VkkRWoef2amZsAw9AiPUH2Nef53

