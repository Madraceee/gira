-- +goose Up
CREATE TABLE epic_members(
    epic_members_user_id UUID,
    epic_members_epic_id UUID,
    CONSTRAINT epic_members_pk PRIMARY KEY(epic_members_user_id,epic_members_epic_id),
    CONSTRAINT epic_members_fk_user_id FOREIGN KEY(epic_members_user_id) REFERENCES users(users_id) ON DELETE CASCADE,
    CONSTRAINT epic_members_fk_epic_id FOREIGN KEY(epic_members_epic_id) REFERENCES epic(epic_id) ON DELETE CASCADE
);
-- +goose Down
DROP TABLE epic_members;
