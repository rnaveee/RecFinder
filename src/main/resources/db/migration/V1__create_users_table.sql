-- V1: the users table and its child table for the many-sports collection.
-- Flyway runs this once, in version order, and records it in flyway_schema_history.
-- Hibernate (ddl-auto=validate) then checks that User.java matches these tables.

CREATE TABLE users (
    id       BIGSERIAL PRIMARY KEY,           -- maps to Long id + @GeneratedValue(IDENTITY)
    name     VARCHAR(255) NOT NULL,           -- a user must have a name
    age      INTEGER,                         -- nullable: Integer age can be null
    bio      TEXT,                            -- TEXT: no length cap, for free-form text
    socials  VARCHAR(255),
    location VARCHAR(255)
);

-- Child table for @ElementCollection Set<String> sports.
-- One row per (user, sport). No surrogate id needed: it's owned by users.
CREATE TABLE user_sports (
    user_id BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    sport   VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, sport)             -- enforces the Set semantics: no duplicate sport per user
);