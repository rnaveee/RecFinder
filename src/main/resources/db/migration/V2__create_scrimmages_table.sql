-- V2: the scrimmages table. Column names are snake_case to match Spring Boot's
-- camelCase->snake_case naming strategy (startTime -> start_time, etc.).
-- The created_by foreign key is this app's first relationship (Scrimmage @ManyToOne User).

CREATE TABLE scrimmages (
    id              BIGSERIAL PRIMARY KEY,
    sport           VARCHAR(255) NOT NULL,
    city            VARCHAR(255),
    location        VARCHAR(255),
    start_time      TIMESTAMPTZ  NOT NULL,            -- Instant -> timestamp WITH time zone (UTC)
    attendance_cost NUMERIC(6, 2),                    -- BigDecimal money: up to 9999.99, exact
    max_players     INTEGER,
    created_by      BIGINT       NOT NULL             -- optional=false on the @ManyToOne
                    REFERENCES users (id)             -- FK -> users.id; default ON DELETE NO ACTION:
);                                                    -- you can't delete a user who still owns scrimmages