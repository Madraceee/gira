
# Task Management System (GIRA)
To build a task management system to handle user authentication, authorization and access management.

Youtube : https://youtu.be/7gSmqpifMhE?si=w6Kj16uWOxy7vrNz

---
# Note
To run , clone the repo git@github.com:Madraceee/gira.git

```
docker-compose up
```

The Frontend is accessible from http://localhost:3000

The Backend is accessible from http://localhost:8080


## Overview
There are 2 types of users
* Master
* Member

Epics are the problem/project to be solved.
Sprint is a fixed time period where teams complete the work.
Tasks are smaller problems/work which are assigned to members and completed by them.

---

## Master
Master is like a ***scrum master***. Master can create an Epic, make tasks, assign them to sprints.
#### Role of Master
- Master can Create an EPIC
- Master can invite MEMBERS to EPIC
- Master can create TASKS, sprints
- Master can assign TASKS to others.
- Master can create ROLES for TASKS and EPICS.
- Master can assign ROLES to MEMBERS.
- Master can remove assigned members from TASK
- Master can remove MEMBERS from EPIC

## Member
Member resembles anyone in a scrum team. They are invited to EPICS by a MASTER.
Each member gets their task assigned by MASTER.
For each task Developer can be a DEVELOPER or VIEWER
- Developer has full control over the assigned task
- View can only look at the tasks

---
## Features of GIRA
GIRA allows the MASTER to create custom roles for the members.
![image](https://github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/assets/100791797/575e6a50-8cf4-4de1-b5db-6ea835211987)

Members can enjoy the priveledges provided by the roles assigned to them.

GIRA provides 3 methods to fully organise the task


### **EPIC**

Epic is the super set of all problems/tasks. It contains a requirement, features which are to be implemented.
![image](https://github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/assets/100791797/9e1478c7-7b8b-4bd9-8c24-3c63c63f7861)

Each Epic is broken down into TASKS

### **TASK**

Each task is a small problem assigned to a member.
GIRA allows members to update the task report lively which can be tracked by everyone.

A task contains a requirement, start date and end date which is set initially.
The assigned members can then update the task
![image](https://github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/assets/100791797/87379809-1d72-4f91-aa2e-4225a2460ec9)

![image](https://github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/assets/100791797/d6e0c7ec-1958-441e-9bf8-84e29ad531d8)

The fields can be updated as and when required.
![image](https://github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/assets/100791797/14f96988-b93f-44c9-b6d6-ebe6723394e0)


**Sprint**
Sprint is a timeline within which a big task is solved.
Each EPIC can have nultiple sprints.
A Task can be assigned to a sprint
![image](https://github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/assets/100791797/f7e1e263-adf9-4f6d-a90b-d433c43198cf)

---

- All endpoints are secured, only Authenticated users can access
- All CRUD operations can be accessed up Authorized users only.
- Users can Disable their account. Masters cannot add them or assign them task. BUT the information will exist.
- Users can Delete their account. This removes all the data.
- Responsive UI for the users
  
---
## How to use

**Master**
```
Login into the site or create a new acc.
Create Epic
Invite Members
Create Roles
Assign Roles and Tasks to members
Once completed DELETE EPIC
```

**Member**
```
Create or Login into account
Wait for Scrum master to add you :)
Once in an EPIC, tasks can be finished
```

---
# Fallback
If docker is not working

### Frontend
![carbon (1)](https://github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/assets/100791797/3f66c957-ae66-480f-b26a-4451e86fd987)
```
cd ./frontend
npm i
npm run dev
```

### Backend
Req: https://github.com/pressly/goose

Create a .env file in ./backend

> PORT={YOUR PORT}
> DB_URL={DB URL WITH USERNAME PASSWORD AND DATABASE}

In backend directory run
`
goose -dir ./internal/sql/schema postgres {DB_URL} up
`
Once migration is over, run
`
go build -o main && ./main
`
