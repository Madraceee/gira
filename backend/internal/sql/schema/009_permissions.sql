-- +goose Up
CREATE TABLE permission(
    permission_id INT,
    permission_name VARCHAR(50) NOT NULL,
    permission_desc TEXT NOT NULL,
    CONSTRAINT permissions_pk PRIMARY KEY(permission_id)
);

INSERT INTO permission VALUES (1,'VIEW','User can view the task. Cannot modify it');
INSERT INTO permission VALUES (2,'UPDATESTATUS','User can only update the status of the task.');
INSERT INTO permission VALUES (3,'UPDATETASKFULL','User can update all fields in the task');
INSERT INTO permission VALUES (4,'TASKADDMEMBER','User can add members to the task and give roles');
INSERT INTO permission VALUES (5,'TASKREMOVEMEMBER','User can remove members from the task');

INSERT INTO permission VALUES (100,'EPICADDMEMBER','User can add members to the EPIC');
INSERT INTO permission VALUES (101,'EPICREMOVEMEMBER','User can remove members to the EPIC');
INSERT INTO permission VALUES (102,'ADDTASK','User can add tasks, the user automatically gets assigned permissions to access task');
INSERT INTO permission VALUES (103,'REMOVETASK','User can remove tasks');
INSERT INTO permission VALUES (104,'ADDSPRINT','User can add sprint');
INSERT INTO permission VALUES (105,'REMOVESPRINT','User can remove sprint');

-- +goose Down
DROP TABLE permission;
