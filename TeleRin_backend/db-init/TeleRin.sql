--
-- PostgreSQL database dump
--

\restrict 3fpkcSYswL3nJyQOkOMaEhZ72ezwB03PdwdII4Uyllr6NZ31uSxymTsa8VsVYV0

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg13+1)
-- Dumped by pg_dump version 18.1

-- Started on 2026-05-26 10:36:31

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
    id_pais integer DEFAULT 0 NOT NULL,
    id_genero integer DEFAULT 0 NOT NULL,
    descripcion_personal text,
    foto_perfil_usuario character varying(225) DEFAULT 'predefinido.jpg'::character varying NOT NULL,
    codigo_usuario character varying(225) NOT NULL,
    id_paleta integer DEFAULT 1 NOT NULL,
    idioma_usuario text DEFAULT 'spanish'::text NOT NULL,
    ip_usuario character varying(225)[]
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
-- TOC entry 3537 (class 0 OID 0)
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
    nombre_historia character varying(100) CONSTRAINT historias_nombre_not_null NOT NULL,
    descripcion_historia text,
    visibilidad_historia boolean DEFAULT false CONSTRAINT historias_visibilidad_not_null NOT NULL,
    id_saga text,
    fecha_actualizacion time without time zone,
    id_historia text NOT NULL,
    contenido_historia jsonb NOT NULL,
    codigo_usuario character varying NOT NULL,
    idioma text
);


ALTER TABLE public.historias OWNER TO postgres;

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
-- TOC entry 3538 (class 0 OID 0)
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
    descripcion_saga text NOT NULL
);


ALTER TABLE public.saga OWNER TO postgres;

--
-- TOC entry 3335 (class 2604 OID 16476)
-- Name: hashtags id_hashtag; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags ALTER COLUMN id_hashtag SET DEFAULT nextval('public.hashtags_id_hashtag_seq'::regclass);


--
-- TOC entry 3337 (class 2604 OID 16477)
-- Name: paletas id_paleta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paletas ALTER COLUMN id_paleta SET DEFAULT nextval('public.paletas_id_paleta_seq'::regclass);


--
-- TOC entry 3519 (class 0 OID 16385)
-- Dependencies: 219
-- Data for Name: USUARIOS; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."USUARIOS" (nombre_usuario, correo_usuario, "contraseña_usuario", id_pais, id_genero, descripcion_personal, foto_perfil_usuario, codigo_usuario, id_paleta, idioma_usuario, ip_usuario) FROM stdin;
Alejandro 123	ducuarasatizabalalejandro@gmail.com	scrypt:32768:8:1$7aZ8IYpHBCL0SqG7$c6fdcd1c24907a6e1d7c07b782d8670aa9b57964abbec4fe6517b25200a72824583e6121f0fce69e35f0c1736677908324c5a0177c3f7a43c3040d281b1c129e	37	2	Programador Principal	765874ducua_perfil.jpg	765874ducua	1	spanish	{scrypt:32768:8:1$4vTYVM7vvkp38AI2$35bd867a701493578b18e71cd746e976e74c64a183ace9d7f08546dffcc928036253de0faee288735a7e6fab4e5e897c08427a317b9d8840427943f8b90e2358,scrypt:32768:8:1$AQP9EmnYvJlarvMe$e2f40e9765f3372eb9ecbc7771df05aa1981a56b82e2001e36c9cdd4f29ad16f7f50a0617b1208be77b23f0e908ad60989f528af1e3b2b0572777f7e1212df6b,scrypt:32768:8:1$lXAbm45x8PBCGPHJ$04d8707e530d24718c96894749086d8879f6b84c779fc24530b5b76ffd594a11dd55860902116ab6de2ccad0b2420e605ec0cb233e56ed90aed920fb13a3a499,scrypt:32768:8:1$T6jE9ovuVJryS2UZ$cfe191567e19435cdd897793460e4fbbf013cb77f01d86e5fa129860160e78b159761d93f268cec25aafa5e70f807693bbc9c9aba351e62fcd1d8a7dd40d8f3a}
\.


--
-- TOC entry 3520 (class 0 OID 16395)
-- Dependencies: 220
-- Data for Name: calificacion_historia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calificacion_historia (codigo_usuario, id_historia, calificacion) FROM stdin;
765874ducua	-historia-765874ducua--461802	1
\.


--
-- TOC entry 3521 (class 0 OID 16403)
-- Dependencies: 221
-- Data for Name: generos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.generos (id_genero, nombre_genero) FROM stdin;
1	Masculino
2	Femenino
0	Undefined
\.


--
-- TOC entry 3522 (class 0 OID 16410)
-- Dependencies: 222
-- Data for Name: hashtags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hashtags (nombre_hashtag, id_hashtag) FROM stdin;
\.


--
-- TOC entry 3523 (class 0 OID 16417)
-- Dependencies: 223
-- Data for Name: hashtags_historias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hashtags_historias (id_historia, id_hashtag) FROM stdin;
\.


--
-- TOC entry 3525 (class 0 OID 16425)
-- Dependencies: 225
-- Data for Name: hashtags_sagas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hashtags_sagas (id_saga, id_hashtag) FROM stdin;
\.


--
-- TOC entry 3526 (class 0 OID 16432)
-- Dependencies: 226
-- Data for Name: historial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial (id_historia, tiempo_vista, codigo_usuario) FROM stdin;
-historia-765874ducua--461802	2026-05-26 15:06:41	765874ducua
\.


--
-- TOC entry 3527 (class 0 OID 16440)
-- Dependencies: 227
-- Data for Name: historias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historias (nombre_historia, descripcion_historia, visibilidad_historia, id_saga, fecha_actualizacion, id_historia, contenido_historia, codigo_usuario, idioma) FROM stdin;
461802	saga para probar cambio de sistema de perfil	t		20:34:16	-historia-765874ducua--461802	{"ops": [{"insert": "461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802461802vvvv", "attributes": {"color": "#222222", "background": "#ffffff"}}, {"insert": "\\n"}]}	765874ducua	spanish
\.


--
-- TOC entry 3528 (class 0 OID 16451)
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
-- TOC entry 3529 (class 0 OID 16456)
-- Dependencies: 229
-- Data for Name: paletas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paletas (id_paleta, color1, color2, color3, color_letra, color_letra_fondo, codigo_usuario) FROM stdin;
\.


--
-- TOC entry 3531 (class 0 OID 16466)
-- Dependencies: 231
-- Data for Name: saga; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saga (nombre_saga, codigo_usuario, imagen_saga, id_saga, descripcion_saga) FROM stdin;
461802 2.0	765874ducua	-inicio-765874ducua-461802 2.0_saga.jpg	-inicio-765874ducua-461802 2.0	historia para probar el cambio de usuario
\.


--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 224
-- Name: hashtags_id_hashtag_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hashtags_id_hashtag_seq', 6, true);


--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 230
-- Name: paletas_id_paleta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paletas_id_paleta_seq', 7, true);


--
-- TOC entry 3339 (class 2606 OID 32975)
-- Name: USUARIOS USUARIOS_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USUARIOS"
    ADD CONSTRAINT "USUARIOS_pkey" PRIMARY KEY (codigo_usuario);


--
-- TOC entry 3341 (class 2606 OID 33011)
-- Name: USUARIOS correo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USUARIOS"
    ADD CONSTRAINT correo UNIQUE (correo_usuario);


--
-- TOC entry 3346 (class 2606 OID 16481)
-- Name: generos generos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generos
    ADD CONSTRAINT generos_pkey PRIMARY KEY (id_genero);


--
-- TOC entry 3348 (class 2606 OID 16483)
-- Name: hashtags hashtags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags
    ADD CONSTRAINT hashtags_pkey PRIMARY KEY (id_hashtag);


--
-- TOC entry 3353 (class 2606 OID 16485)
-- Name: historias historias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historias
    ADD CONSTRAINT historias_pkey PRIMARY KEY (id_historia);


--
-- TOC entry 3343 (class 2606 OID 33009)
-- Name: USUARIOS nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USUARIOS"
    ADD CONSTRAINT nombre UNIQUE (nombre_usuario);


--
-- TOC entry 3357 (class 2606 OID 16487)
-- Name: paises paises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paises
    ADD CONSTRAINT paises_pkey PRIMARY KEY (id_pais);


--
-- TOC entry 3359 (class 2606 OID 16489)
-- Name: paletas paletas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paletas
    ADD CONSTRAINT paletas_pkey PRIMARY KEY (id_paleta);


--
-- TOC entry 3361 (class 2606 OID 16491)
-- Name: saga saga_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saga
    ADD CONSTRAINT saga_pkey PRIMARY KEY (id_saga);


--
-- TOC entry 3351 (class 2606 OID 16561)
-- Name: historial uk_historial_usuario_historia; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT uk_historial_usuario_historia UNIQUE (codigo_usuario, id_historia);


--
-- TOC entry 3354 (class 1259 OID 16492)
-- Name: idx_id_historia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_id_historia ON public.historias USING btree (id_historia);


--
-- TOC entry 3344 (class 1259 OID 16493)
-- Name: idx_id_historia_calificacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_id_historia_calificacion ON public.calificacion_historia USING btree (id_historia);


--
-- TOC entry 3355 (class 1259 OID 16494)
-- Name: idx_id_saga; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_id_saga ON public.historias USING btree (id_saga);


--
-- TOC entry 3349 (class 1259 OID 16495)
-- Name: idx_nombre_hashtag; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nombre_hashtag ON public.hashtags USING btree (nombre_hashtag);


--
-- TOC entry 3362 (class 2606 OID 32977)
-- Name: calificacion_historia codigo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificacion_historia
    ADD CONSTRAINT codigo_usuario FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


--
-- TOC entry 3368 (class 2606 OID 32982)
-- Name: historial codigo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT codigo_usuario FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


--
-- TOC entry 3371 (class 2606 OID 32987)
-- Name: saga codigo_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saga
    ADD CONSTRAINT codigo_usuario FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


--
-- TOC entry 3364 (class 2606 OID 16511)
-- Name: hashtags_historias id_hashtag; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags_historias
    ADD CONSTRAINT id_hashtag FOREIGN KEY (id_hashtag) REFERENCES public.hashtags(id_hashtag) NOT VALID;


--
-- TOC entry 3366 (class 2606 OID 16516)
-- Name: hashtags_sagas id_hashtag; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags_sagas
    ADD CONSTRAINT id_hashtag FOREIGN KEY (id_hashtag) REFERENCES public.hashtags(id_hashtag);


--
-- TOC entry 3363 (class 2606 OID 16521)
-- Name: calificacion_historia id_historia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calificacion_historia
    ADD CONSTRAINT id_historia FOREIGN KEY (id_historia) REFERENCES public.historias(id_historia) NOT VALID;


--
-- TOC entry 3365 (class 2606 OID 16526)
-- Name: hashtags_historias id_historia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags_historias
    ADD CONSTRAINT id_historia FOREIGN KEY (id_historia) REFERENCES public.historias(id_historia) NOT VALID;


--
-- TOC entry 3369 (class 2606 OID 16531)
-- Name: historial id_historia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial
    ADD CONSTRAINT id_historia FOREIGN KEY (id_historia) REFERENCES public.historias(id_historia) NOT VALID;


--
-- TOC entry 3367 (class 2606 OID 16546)
-- Name: hashtags_sagas id_saga; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtags_sagas
    ADD CONSTRAINT id_saga FOREIGN KEY (id_saga) REFERENCES public.saga(id_saga);


--
-- TOC entry 3370 (class 2606 OID 32992)
-- Name: paletas paletas_codigo_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paletas
    ADD CONSTRAINT paletas_codigo_usuario_fkey FOREIGN KEY (codigo_usuario) REFERENCES public."USUARIOS"(codigo_usuario) NOT VALID;


-- Completed on 2026-05-26 10:36:32

--
-- PostgreSQL database dump complete
--

\unrestrict 3fpkcSYswL3nJyQOkOMaEhZ72ezwB03PdwdII4Uyllr6NZ31uSxymTsa8VsVYV0

