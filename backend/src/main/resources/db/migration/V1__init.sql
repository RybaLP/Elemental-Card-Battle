CREATE TABLE card (
                      id BIGSERIAL PRIMARY KEY,
                      power INTEGER NOT NULL,
                      name VARCHAR(255),
                      color VARCHAR(255),
                      elemental_type VARCHAR(255) NOT NULL,
                      image_url VARCHAR(255),
                      price INTEGER NOT NULL
);

CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       currency INTEGER DEFAULT 100,
                       games_won INTEGER DEFAULT 0,
                       games_lost INTEGER DEFAULT 0
);

CREATE TABLE user_card (
                           id BIGSERIAL PRIMARY KEY,
                           user_id BIGINT NOT NULL,
                           card_id BIGINT NOT NULL,
                           acquired_at TIMESTAMP NOT NULL DEFAULT NOW(),
                           CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                           CONSTRAINT fk_card FOREIGN KEY (card_id) REFERENCES card(id) ON DELETE CASCADE,
                           CONSTRAINT uq_user_card UNIQUE (user_id, card_id)
);