# 🧠 Skill Swap Platform (DBMS Mini Project)

## 📌 Project Description

The **Skill Swap Platform** is a database-driven web application that enables students to exchange skills with each other instead of using money.
Students can offer skills they are good at and request skills they want to learn. The system manages student data, skills, swap requests, and feedback using a structured relational database.

---

## 🎯 Objectives

* Promote peer-to-peer learning among students
* Provide a platform for skill exchange
* Implement core **DBMS concepts** such as ER modeling, normalization, and SQL
* Perform CRUD operations using a simple interface

---

## ⚙️ Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Python (Flask) / PHP
* **Database:** MySQL
* **Tools:** GitHub, VS Code

---

## 🗂️ Database Design

### 📊 Tables Used:

* **Student**
* **Skill**
* **Skill_Offer**
* **Skill_Request**
* **Swap_Request**
* **Swap_Session**

### 🔗 Relationships:

* Many-to-Many → Students ↔ Skills
* One-to-Many → Student → Swap Requests

---

## 🧠 DBMS Concepts Implemented

* ER Diagram
* Relational Schema
* Normalization (1NF, 2NF, 3NF)
* Primary Keys & Foreign Keys
* Constraints
* SQL Queries (CRUD operations)
* Joins & Aggregations
* Views (optional)
* Triggers (optional)

---

## 💻 Features

* Add and manage student details
* Add and manage skills
* Offer and request skills
* Create and manage swap requests
* Update swap status (Pending / Accepted)
* View and search data
* Basic feedback and rating system

---

## 🔄 CRUD Operations

* **Create:** Add students, skills, and swap requests
* **Read:** View students, skills, and swaps
* **Update:** Update swap status
* **Delete:** Remove swap session or records

---

## 🚀 How to Run the Project

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Shravya2820/skill-swap-dbms.git
cd skill-swap-dbms
```

### 2️⃣ Setup Database

* Open MySQL
* Run `schema.sql` to create tables
* Run `sample_data.sql` to insert data

### 3️⃣ Run Backend

* For Flask:

```bash
python app.py
```

### 4️⃣ Open Frontend

* Open `index.html` in browser

---

## 📊 Sample Queries

### 🔍 View all students

```sql
SELECT * FROM Student;
```

### 🔍 Pending swap requests

```sql
SELECT * FROM Swap_Request WHERE status = 'Pending';
```

### 🔍 Skills offered by students

```sql
SELECT s.name, sk.skill_name
FROM Student s
JOIN Skill_Offer so ON s.student_id = so.student_id
JOIN Skill sk ON so.skill_id = sk.skill_id;
```

---

## 👥 Team Members

* **Shreenidhi** – ER Diagram & Normalization
* **Shravya S** – Database & SQL
* **Shradda** – Frontend
* **Shravya N** – Backend & Integration

---

## 🎤 Conclusion

This project demonstrates the effective use of Database Management System concepts to design and implement a real-world application.
The system ensures structured data storage, efficient querying, and supports collaborative learning among students.

---

## 📌 Future Enhancements

* Advanced UI design
* Authentication system (Login/Register)
* Real-time notifications
* Recommendation system for skill matching

---

⭐ *This project focuses on strong database design with a simple user interface to demonstrate functionality.*
