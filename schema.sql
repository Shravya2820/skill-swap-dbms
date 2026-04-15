CREATE DATABASE skill_swap;
USE skill_swap;

CREATE TABLE Student (
    student_id INT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    dept VARCHAR(50),
    year INT
);

CREATE TABLE Skill (
    skill_id INT PRIMARY KEY,
    skill_name VARCHAR(50),
    category VARCHAR(50)
);

CREATE TABLE Skill_Offer (
    offer_id INT PRIMARY KEY,
    student_id INT,
    skill_id INT,
    proficiency_level VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (skill_id) REFERENCES Skill(skill_id)
);

CREATE TABLE Skill_Request (
    request_id INT PRIMARY KEY,
    student_id INT,
    skill_id INT,
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (skill_id) REFERENCES Skill(skill_id)
);

CREATE TABLE Swap_Request (
    swap_id INT PRIMARY KEY,
    sender_student_id INT,
    receiver_student_id INT,
    offered_skill INT,
    requested_skill INT,
    status VARCHAR(20),
    FOREIGN KEY (sender_student_id) REFERENCES Student(student_id),
    FOREIGN KEY (receiver_student_id) REFERENCES Student(student_id),
    FOREIGN KEY (offered_skill) REFERENCES Skill(skill_id),
    FOREIGN KEY (requested_skill) REFERENCES Skill(skill_id)
);

CREATE TABLE Swap_Session (
    session_id INT PRIMARY KEY,
    swap_id INT,
    date DATE,
    feedback VARCHAR(200),
    rating INT,
    FOREIGN KEY (swap_id) REFERENCES Swap_Request(swap_id)
);