-- +goose Up
CREATE TABLE task_assignment(
    task_assignment_task_id UUID,
    task_assignment_epic_id UUID,
    task_assignment_users_id UUID,
    task_assignment_role_id SERIAL,
    CONSTRAINT task_assignment_pk PRIMARY KEY(task_assignment_task_id,task_assignment_epic_id,task_assignment_users_id,task_assignment_role_id),
    CONSTRAINT task_assignment_fk_epic_id FOREIGN KEY(task_assignment_epic_id) REFERENCES epic(epic_id) ON DELETE CASCADE,
    CONSTRAINT task_assignment_fk_task_id FOREIGN KEY(task_assignment_epic_id,task_assignment_task_id) REFERENCES task(task_epic_id,task_id) ON DELETE CASCADE,
    CONSTRAINT task_assignment_fk_users_id FOREIGN KEY(task_assignment_users_id) REFERENCES users(users_id) ON DELETE CASCADE,
    CONSTRAINT task_assignment_fk_role_id FOREIGN KEY(task_assignment_epic_id,task_assignment_role_id) REFERENCES role(role_epic_id,role_id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE task_assignment;