[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/M4NvrXuV)

# Task Management System
To build a task management system to handle user authentication, authorization and access management.

#### Note:
Instructions to run frontend and backend will be available in their respective folder.

---
## Overview
There are 2 types of users
* Master
* Member

Master can create Epic, sprints, tasks, assign members to each task.
Member will be assigned a task by the master.

#### Master
Master is like a ***scrum master***. Master can create an Epic, make tasks, assign them to sprints. Master is also responsible for assigning members to each task and provide them with role.

#### Member
Member can be invited to a Epic by Master. Master then assignes them role.
Roles include
* Developer
* Tester
* Reviewer

Member can have 1 or more roles on different tasks.

Default roles are 
1. Developer - Developer can add logs/messages to a task, change status, add links etc.
2. Tester - Tester can check the changes and only change status from testing->Building/Review
3. Reviewer - They will be part of the reviewing team. They can only look at the task.

---
#### Task Life Cycle
![image](https://github.com/BalkanID-University/ssn-chennai-2023-fte-hiring-Madraceee/assets/100791797/2f71d1f3-c147-42c3-a8df-275f10c89a53)
