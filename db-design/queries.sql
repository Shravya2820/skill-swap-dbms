USE skill_swap;

-- VIEW TABLES
SELECT * FROM Student;
SELECT * FROM Skill;

-- Who offers what
SELECT s.name, sk.skill_name, so.proficiency_level
FROM Student s
JOIN Skill_Offer so ON s.student_id = so.student_id
JOIN Skill sk ON so.skill_id = sk.skill_id;

-- Who requested what
SELECT s.name, sk.skill_name
FROM Student s
JOIN Skill_Request sr ON s.student_id = sr.student_id
JOIN Skill sk ON sr.skill_id = sk.skill_id;

-- All swap requests
SELECT * FROM Swap_Request;

-- Pending swaps
SELECT * FROM Swap_Request WHERE status = 'Pending';

-- UPDATE example
UPDATE Swap_Request
SET status = 'Accepted'
WHERE swap_id = 1;

-- DELETE example
DELETE FROM Swap_Session
WHERE session_id = 1;