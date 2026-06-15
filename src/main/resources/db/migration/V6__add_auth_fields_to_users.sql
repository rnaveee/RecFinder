ALTER TABLE users
    ADD COLUMN email         VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT '';

ALTER TABLE users
    ADD CONSTRAINT users_email_unique UNIQUE (email);

ALTER TABLE users
    ALTER COLUMN email        DROP DEFAULT,
    ALTER COLUMN password_hash DROP DEFAULT;
