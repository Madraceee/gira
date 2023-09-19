-- +goose Up
CREATE TABLE epic(
    epic_id UUID PRIMARY KEY,
    epic_name VARCHAR(50) NOT NULL UNIQUE,
    epic_description TEXT NOT NULL,
    epic_features TEXT NOT NULL,
    epic_link TEXT,
    epic_start_date timestamp NOT NULL,
    epic_end_date timestamp,
    epic_owner UUID NOT NULL,
    CONSTRAINT epic_fk FOREIGN KEY (epic_owner) REFERENCES users (users_id)
    ON DELETE CASCADE
);

-- +goose Down
DROP TABLE epic;
