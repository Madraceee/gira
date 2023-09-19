-- +goose Up
CREATE TABLE task(
    task_epic_id UUID,
    task_id UUID,
    task_name VARCHAR(50) NOT NULL,
    task_req TEXT NOT NULL,
    task_log TEXT,
    task_link TEXT,
    task_start_date timestamp NOT NULL DEFAULT NOW(),
    task_end_date timestamp,
    task_status TEXT NOT NULL, 
    task_sprint_id int,
    CONSTRAINT task_pk_id PRIMARY KEY (task_epic_id,task_id),
    CONSTRAINT task_fk_epic_id FOREIGN KEY (task_epic_id) REFERENCES epic (epic_id) ON DELETE CASCADE,
    CONSTRAINT task_check_date CHECK( task_end_date IS NULL OR task_start_date <= task_end_date),
    CONSTRAINT task_check_status CHECK (task_status IN ('NOT STARTED','BUILDING','TESTING','REVIEW','COMPLETED','HALTED'))
);

-- +goose Down
DROP TABLE task;
