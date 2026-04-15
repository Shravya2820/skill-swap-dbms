USE skill_swap;

-- STUDENTS
INSERT INTO Student VALUES (1,'Rahul','rahul@gmail.com','CSE',3);
INSERT INTO Student VALUES (2,'Priya','priya@gmail.com','ISE',2);
INSERT INTO Student VALUES (3,'Amit','amit@gmail.com','ECE',4);

-- SKILLS
INSERT INTO Skill VALUES (101,'Python','Programming');
INSERT INTO Skill VALUES (102,'Graphic Design','Design');
INSERT INTO Skill VALUES (103,'Java','Programming');

-- SKILL OFFERS
INSERT INTO Skill_Offer VALUES (1,1,101,'Advanced');
INSERT INTO Skill_Offer VALUES (2,1,103,'Intermediate');
INSERT INTO Skill_Offer VALUES (3,2,102,'Advanced');

-- SKILL REQUESTS
INSERT INTO Skill_Request VALUES (1,2,101);
INSERT INTO Skill_Request VALUES (2,3,103);

-- SWAP REQUESTS
INSERT INTO Swap_Request VALUES (1,2,1,102,101,'Pending');
INSERT INTO Swap_Request VALUES (2,3,1,103,101,'Accepted');

-- SWAP SESSIONS
INSERT INTO Swap_Session VALUES (1,2,'2026-03-19','Great learning',5);