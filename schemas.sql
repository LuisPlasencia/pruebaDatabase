CREATE TABLE IF NOT EXISTS tareas (
id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
titulo varchar(120) NOT NULL
);

-- Accounts: the password is never stored, only its bcrypt hash (always 60 characters)
CREATE TABLE IF NOT EXISTS usuarios (
id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
nombre varchar(60) NOT NULL,
email varchar(254) NOT NULL UNIQUE,
password_hash char(60) NOT NULL,
rol varchar(10) NOT NULL DEFAULT 'usuario' CHECK (rol IN ('usuario', 'admin')),
creado_en timestamptz NOT NULL DEFAULT now()
);

-- Deleting a user also deletes their routers (ON DELETE CASCADE)
CREATE TABLE IF NOT EXISTS routers (
id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
usuario_id integer NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
nombre varchar(60) NOT NULL,
direccion_ip inet NOT NULL,
creado_en timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS routers_usuario_id_idx ON routers (usuario_id);

-- Login sessions, in the format expected by connect-pg-simple
CREATE TABLE IF NOT EXISTS "session" (
"sid" varchar NOT NULL COLLATE "default" PRIMARY KEY,
"sess" json NOT NULL,
"expire" timestamp(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
