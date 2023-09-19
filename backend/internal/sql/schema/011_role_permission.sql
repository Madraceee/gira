-- +goose Up
CREATE TABLE role_permission(
    role_permission_role_id SERIAL,
    role_permission_epic_id UUID,
    role_permission_permission_id SERIAL,
    CONSTRAINT role_permission_pk PRIMARY KEY(role_permission_role_id,role_permission_epic_id,role_permission_permission_id),
    CONSTRAINT role_permission_fk_permission_id FOREIGN KEY(role_permission_permission_id) REFERENCES permission(permission_id) ON DELETE CASCADE,
    CONSTRAINT role_permission_fk_role_id FOREIGN KEY(role_permission_epic_id,role_permission_role_id) REFERENCES role(role_epic_id,role_id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE role_permission;