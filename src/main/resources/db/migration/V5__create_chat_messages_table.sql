-- V5: the chat_messages table — in-event chat, one row per message.
-- Two @ManyToOne FKs: which scrimmage (the room) and who sent it.
-- Both CASCADE: a message is meaningless without its room or its author.

CREATE TABLE chat_messages (
    id           BIGSERIAL PRIMARY KEY,
    scrimmage_id BIGINT      NOT NULL REFERENCES scrimmages (id) ON DELETE CASCADE,
    sender_id    BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    content      TEXT        NOT NULL,
    sent_at      TIMESTAMPTZ NOT NULL
);

-- Reading a room's history is the hot query (GET /api/scrimmages/{id}/messages),
-- so index the FK + time to keep "newest messages in this room" fast.
CREATE INDEX idx_chat_messages_scrimmage_sent_at ON chat_messages (scrimmage_id, sent_at);
