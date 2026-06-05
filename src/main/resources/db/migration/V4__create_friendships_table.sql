-- V4: the friendships table — a self-referencing join (User <-> User).
-- Both FKs point back at users(id): requester sent the request, addressee received it.
-- status is stored as TEXT to match @Enumerated(EnumType.STRING) (the enum NAME, not its ordinal).

CREATE TABLE friendships (
    id           BIGSERIAL PRIMARY KEY,
    requester_id BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    addressee_id BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status       VARCHAR(255) NOT NULL,                 -- 'PENDING' | 'ACCEPTED' | 'DECLINED'
    created_at   TIMESTAMPTZ,                           -- Instant createdAt

    CONSTRAINT uq_friendship_pair UNIQUE (requester_id, addressee_id)  -- no duplicate request, same direction
);