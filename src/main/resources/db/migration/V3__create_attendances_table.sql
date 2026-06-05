-- V3: the attendances join table — "user X is attending scrimmage Y".
-- A join ENTITY (not a plain @ManyToMany) because it carries its own data (joined_at).
-- Surrogate id for the PK; the UNIQUE (user_id, scrimmage_id) is what actually
-- prevents the same user joining the same scrimmage twice.

CREATE TABLE attendances (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    scrimmage_id BIGINT      NOT NULL REFERENCES scrimmages (id) ON DELETE CASCADE,
    joined_at    TIMESTAMPTZ,                          -- Instant joinedAt

    CONSTRAINT uq_attendance_user_scrimmage UNIQUE (user_id, scrimmage_id)
);