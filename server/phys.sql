--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3 (Debian 11.3-1.pgdg90+1)
-- Dumped by pg_dump version 12rc1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

--
-- Name: classrooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classrooms (
    id integer NOT NULL,
    name character varying(128) NOT NULL
);


--
-- Name: classrooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.classrooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classrooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.classrooms_id_seq OWNED BY public.classrooms.id;


--
-- Name: discipline_tests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discipline_tests (
    discipline integer NOT NULL,
    test integer NOT NULL
);


--
-- Name: disciplines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.disciplines (
    id integer NOT NULL,
    name character varying(128) NOT NULL
);


--
-- Name: disciplines_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.disciplines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: disciplines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.disciplines_id_seq OWNED BY public.disciplines.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name character varying(128) NOT NULL
);


--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessons (
    id integer NOT NULL,
    day smallint NOT NULL,
    number smallint NOT NULL,
    classroom integer NOT NULL,
    teacher integer NOT NULL,
    discipline integer NOT NULL,
    semester integer NOT NULL
);


--
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lessons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lessons_id_seq OWNED BY public.lessons.id;


--
-- Name: marks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marks (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    symbol character varying(8) NOT NULL,
    weight real NOT NULL
);


--
-- Name: marks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.marks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: marks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.marks_id_seq OWNED BY public.marks.id;


--
-- Name: modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.modules (
    id integer NOT NULL,
    begin timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    semester integer NOT NULL
);


--
-- Name: modules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.modules_id_seq OWNED BY public.modules.id;


--
-- Name: parameters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parameters (
    parameter integer NOT NULL,
    value character varying(256) NOT NULL
);


--
-- Name: semesters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.semesters (
    id integer NOT NULL,
    begin timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL
);


--
-- Name: semester_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.semester_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: semester_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.semester_id_seq OWNED BY public.semesters.id;


--
-- Name: student_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_entries (
    id integer NOT NULL,
    lesson integer NOT NULL,
    student integer NOT NULL
);


--
-- Name: student_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_entries_id_seq OWNED BY public.student_entries.id;


--
-- Name: student_entries_lesson_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_entries_lesson_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_entries_lesson_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_entries_lesson_seq OWNED BY public.student_entries.lesson;


--
-- Name: student_entries_student_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_entries_student_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_entries_student_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_entries_student_seq OWNED BY public.student_entries.student;


--
-- Name: student_infos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_infos (
    id integer NOT NULL,
    student integer NOT NULL,
    semester integer NOT NULL,
    "healthGroup" smallint NOT NULL,
    "receiptDate" timestamp with time zone,
    diary real NOT NULL,
    competitions real NOT NULL,
    "personalQualities" real NOT NULL,
    "examDate" date
);


--
-- Name: student_info_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_info_id_seq OWNED BY public.student_infos.id;


--
-- Name: student_test_marks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_test_marks (
    id integer NOT NULL,
    test integer NOT NULL,
    result real NOT NULL,
    student integer NOT NULL,
    semester integer NOT NULL
);


--
-- Name: student_test_marks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_test_marks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_test_marks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_test_marks_id_seq OWNED BY public.student_test_marks.id;


--
-- Name: student_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_visits (
    id integer NOT NULL,
    entry integer NOT NULL,
    mark integer NOT NULL,
    week smallint NOT NULL
);


--
-- Name: student_visits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_visits_id_seq OWNED BY public.student_visits.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students (
    id integer NOT NULL,
    surname character varying(128) NOT NULL,
    name character varying(128) NOT NULL,
    middlename character varying(128) NOT NULL,
    "group" integer NOT NULL,
    gender character varying(6) NOT NULL
);


--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: tests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tests (
    id integer NOT NULL,
    name character varying(128) NOT NULL,
    direction smallint NOT NULL,
    "maleMarks" real[] NOT NULL,
    "femaleMarks" real[] NOT NULL
);


--
-- Name: tests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tests_id_seq OWNED BY public.tests.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    login character varying(128) NOT NULL,
    password character varying(128) NOT NULL,
    surname character varying(128) NOT NULL,
    name character varying(128) NOT NULL,
    middlename character varying(128),
    "fullAccess" boolean DEFAULT false NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: classrooms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classrooms ALTER COLUMN id SET DEFAULT nextval('public.classrooms_id_seq'::regclass);


--
-- Name: disciplines id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disciplines ALTER COLUMN id SET DEFAULT nextval('public.disciplines_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: lessons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons ALTER COLUMN id SET DEFAULT nextval('public.lessons_id_seq'::regclass);


--
-- Name: marks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marks ALTER COLUMN id SET DEFAULT nextval('public.marks_id_seq'::regclass);


--
-- Name: modules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modules ALTER COLUMN id SET DEFAULT nextval('public.modules_id_seq'::regclass);


--
-- Name: semesters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.semesters ALTER COLUMN id SET DEFAULT nextval('public.semester_id_seq'::regclass);


--
-- Name: student_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_entries ALTER COLUMN id SET DEFAULT nextval('public.student_entries_id_seq'::regclass);


--
-- Name: student_entries lesson; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_entries ALTER COLUMN lesson SET DEFAULT nextval('public.student_entries_lesson_seq'::regclass);


--
-- Name: student_entries student; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_entries ALTER COLUMN student SET DEFAULT nextval('public.student_entries_student_seq'::regclass);


--
-- Name: student_infos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_infos ALTER COLUMN id SET DEFAULT nextval('public.student_info_id_seq'::regclass);


--
-- Name: student_test_marks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_test_marks ALTER COLUMN id SET DEFAULT nextval('public.student_test_marks_id_seq'::regclass);


--
-- Name: student_visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_visits ALTER COLUMN id SET DEFAULT nextval('public.student_visits_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: tests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests ALTER COLUMN id SET DEFAULT nextval('public.tests_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: classrooms classrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classrooms
    ADD CONSTRAINT classrooms_pkey PRIMARY KEY (id);


--
-- Name: discipline_tests discipline_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discipline_tests
    ADD CONSTRAINT discipline_tests_pkey PRIMARY KEY (discipline, test);


--
-- Name: disciplines disciplines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disciplines
    ADD CONSTRAINT disciplines_pkey PRIMARY KEY (id);


--
-- Name: groups groups_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_name_key UNIQUE (name);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: marks marks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT marks_pkey PRIMARY KEY (id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: parameters options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parameters
    ADD CONSTRAINT options_pkey PRIMARY KEY (parameter);


--
-- Name: semesters semester_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT semester_pkey PRIMARY KEY (id);


--
-- Name: student_entries student_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_entries
    ADD CONSTRAINT student_entries_pkey PRIMARY KEY (id);


--
-- Name: student_infos student_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_infos
    ADD CONSTRAINT student_info_pkey PRIMARY KEY (id);


--
-- Name: student_test_marks student_test_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_test_marks
    ADD CONSTRAINT student_test_marks_pkey PRIMARY KEY (id);


--
-- Name: student_visits student_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_visits
    ADD CONSTRAINT student_visits_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: tests tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_pkey PRIMARY KEY (id);


--
-- Name: classrooms unique_classrooms_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classrooms
    ADD CONSTRAINT unique_classrooms_name UNIQUE (name);


--
-- Name: disciplines unique_disciplines_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.disciplines
    ADD CONSTRAINT unique_disciplines_name UNIQUE (name);


--
-- Name: student_visits unique_entry_visit; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_visits
    ADD CONSTRAINT unique_entry_visit UNIQUE (entry, week);


--
-- Name: lessons unique_lesson; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT unique_lesson UNIQUE (day, number, teacher, semester);


--
-- Name: marks unique_marks_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT unique_marks_name UNIQUE (name);


--
-- Name: student_entries unique_student_entry; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_entries
    ADD CONSTRAINT unique_student_entry UNIQUE (lesson, student);


--
-- Name: student_infos unique_student_info; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_infos
    ADD CONSTRAINT unique_student_info UNIQUE (student, semester);


--
-- Name: student_test_marks unique_student_test_mark; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_test_marks
    ADD CONSTRAINT unique_student_test_mark UNIQUE (test, student, semester);


--
-- Name: tests unique_tests_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT unique_tests_name UNIQUE (name);


--
-- Name: users users_login_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_login_key UNIQUE (login);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: lessons lnk_classrooms_lessons; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lnk_classrooms_lessons FOREIGN KEY (classroom) REFERENCES public.classrooms(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: discipline_tests lnk_disciplines_discipline_test; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discipline_tests
    ADD CONSTRAINT lnk_disciplines_discipline_test FOREIGN KEY (discipline) REFERENCES public.disciplines(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lessons lnk_disciplines_lessons; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lnk_disciplines_lessons FOREIGN KEY (discipline) REFERENCES public.disciplines(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: students lnk_groups_students; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT lnk_groups_students FOREIGN KEY ("group") REFERENCES public.groups(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_entries lnk_lessons_student_entries; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_entries
    ADD CONSTRAINT lnk_lessons_student_entries FOREIGN KEY (lesson) REFERENCES public.lessons(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_visits lnk_marks_student_visits; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_visits
    ADD CONSTRAINT lnk_marks_student_visits FOREIGN KEY (mark) REFERENCES public.marks(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lessons lnk_semester_lessons; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lnk_semester_lessons FOREIGN KEY (semester) REFERENCES public.semesters(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: modules lnk_semester_modules; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT lnk_semester_modules FOREIGN KEY (semester) REFERENCES public.semesters(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_infos lnk_semester_student_info; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_infos
    ADD CONSTRAINT lnk_semester_student_info FOREIGN KEY (semester) REFERENCES public.semesters(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_test_marks lnk_semester_student_test_marks; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_test_marks
    ADD CONSTRAINT lnk_semester_student_test_marks FOREIGN KEY (semester) REFERENCES public.semesters(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_visits lnk_student_entries_student_visits; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_visits
    ADD CONSTRAINT lnk_student_entries_student_visits FOREIGN KEY (entry) REFERENCES public.student_entries(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_entries lnk_students_student_entries; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_entries
    ADD CONSTRAINT lnk_students_student_entries FOREIGN KEY (student) REFERENCES public.students(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_infos lnk_students_student_info; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_infos
    ADD CONSTRAINT lnk_students_student_info FOREIGN KEY (student) REFERENCES public.students(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_test_marks lnk_students_student_test_marks; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_test_marks
    ADD CONSTRAINT lnk_students_student_test_marks FOREIGN KEY (student) REFERENCES public.students(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: discipline_tests lnk_tests_discipline_test; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discipline_tests
    ADD CONSTRAINT lnk_tests_discipline_test FOREIGN KEY (test) REFERENCES public.tests(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_test_marks lnk_tests_student_test_marks; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_test_marks
    ADD CONSTRAINT lnk_tests_student_test_marks FOREIGN KEY (test) REFERENCES public.tests(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lessons lnk_users_lessons; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lnk_users_lessons FOREIGN KEY (teacher) REFERENCES public.users(id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

