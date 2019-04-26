
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS pk_user_id CASCADE;


DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.users_id_seq;
CREATE TABLE users (
    id serial NOT NULL,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    registration_date date NOT NULL DEFAULT CURRENT_DATE
);


ALTER TABLE ONLY users
    ADD CONSTRAINT pk_user_id PRIMARY KEY (id);
