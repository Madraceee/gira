-- +goose Up
CREATE TABLE sprint(
    sprint_epic_id UUID,
    sprint_id INT,
    sprint_start_date timestamp NOT NULL DEFAULT NOW(),
    sprint_end_date timestamp NOT NULL DEFAULT NOW() + INTERVAL '14 days',
    CONSTRAINT sprint_pk PRIMARY KEY(sprint_epic_id,sprint_id),
    CONSTRAINT sprint_fk_epic_id FOREIGN KEY (sprint_epic_id) REFERENCES epic(epic_id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE sprint;
