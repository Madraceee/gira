-- +goose Up
CREATE TABLE role(
    role_id SERIAL,
    role_epic_id UUID,
    role_name VARCHAR(50) NOT NULL,
    CONSTRAINT role_pk PRIMARY KEY(role_id,role_epic_id),
    CONSTRAINT role_fk_epic_id FOREIGN KEY (role_epic_id) REFERENCES epic(epic_id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE role;