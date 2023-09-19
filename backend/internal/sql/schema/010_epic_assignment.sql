-- +goose Up
CREATE TABLE epic_assignment(
    epic_assignment_epic_id UUID,
    epic_assignment_users_id UUID,
    epic_assignment_role_id SERIAL,
    CONSTRAINT epic_assignment_pk PRIMARY KEY(epic_assignment_epic_id,epic_assignment_users_id,epic_assignment_role_id),
    CONSTRAINT epic_assignment_fk_epic_id FOREIGN KEY(epic_assignment_epic_id) REFERENCES epic(epic_id) ON DELETE CASCADE,
    CONSTRAINT epic_assignment_fk_users_id FOREIGN KEY(epic_assignment_users_id) REFERENCES users(users_id) ON DELETE CASCADE,
    CONSTRAINT epic_assignment_fk_role_id FOREIGN KEY(epic_assignment_epic_id,epic_assignment_role_id) REFERENCES role(role_epic_id,role_id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE epic_assignment;