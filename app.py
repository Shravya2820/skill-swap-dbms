import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from db_config import get_connection

app = Flask(__name__, static_folder='.')
CORS(app)

# ------------------------------
# SERVE FRONTEND (FIXED PROPERLY)
# ------------------------------
@app.route('/')
def serve_index():
    return send_from_directory(os.getcwd(), 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(os.getcwd(), path)

# ------------------------------
# ADD STUDENT
# ------------------------------
@app.route('/api/students', methods=['POST'])
def add_student():
    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO Student (name, email, dept, year)
        VALUES (%s, %s, %s, %s)
    """, (
        data['name'],
        data['email'],
        data['department'],
        1
    ))

    conn.commit()
    student_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return jsonify({
        "id": student_id,
        "name": data['name']
    })


# ------------------------------
# GET STUDENTS
# ------------------------------
@app.route('/api/students', methods=['GET'])
def get_students():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Student")
    students = cursor.fetchall()

    for s in students:
        cursor.execute("""
            SELECT sk.skill_name 
            FROM Skill_Offer so
            JOIN Skill sk ON so.skill_id = sk.skill_id
            WHERE so.student_id = %s
        """, (s['student_id'],))

        skills = cursor.fetchall()
        s['skills'] = [{"skillName": x['skill_name']} for x in skills]

        s['id'] = s.pop('student_id')
        s['department'] = s.pop('dept')

    cursor.close()
    conn.close()

    return jsonify(students)


# ------------------------------
# ADD SKILL
# ------------------------------
@app.route('/api/skills', methods=['POST'])
def add_skill():
    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO Skill (skill_name, category)
        VALUES (%s, %s)
    """, (data['skillName'], "General"))

    conn.commit()
    skill_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return jsonify({
        "id": skill_id,
        "skillName": data['skillName']
    })


# ------------------------------
# GET SKILLS
# ------------------------------
@app.route('/api/skills', methods=['GET'])
def get_skills():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Skill")
    skills = cursor.fetchall()

    for s in skills:
        s['id'] = s.pop('skill_id')
        s['skillName'] = s.pop('skill_name')

    cursor.close()
    conn.close()

    return jsonify(skills)


# ------------------------------
# OFFER SKILL
# ------------------------------
@app.route('/api/student-skills', methods=['POST'])
def offer_skill():
    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO Skill_Offer (student_id, skill_id, proficiency_level)
        VALUES (%s, %s, %s)
    """, (data['studentId'], data['skillId'], "Intermediate"))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Skill offered"})


# ------------------------------
# CREATE SWAP REQUEST
# ------------------------------
@app.route('/api/swap-requests', methods=['POST'])
def create_swap():
    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO Swap_Request 
        (sender_student_id, receiver_student_id, offered_skill, requested_skill, status)
        VALUES (%s, %s, %s, %s, 'Pending')
    """, (
        data['requesterId'],
        data['receiverId'],
        data['skillOfferedId'],
        data['skillWantedId']
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Swap created"})


# ------------------------------
# GET SWAP REQUESTS
# ------------------------------
@app.route('/api/swap-requests', methods=['GET'])
def get_swaps():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT sr.swap_id,
               s1.name AS sender_name,
               s2.name AS receiver_name,
               sk1.skill_name AS offered_name,
               sk2.skill_name AS wanted_name,
               sr.status
        FROM Swap_Request sr
        JOIN Student s1 ON sr.sender_student_id = s1.student_id
        JOIN Student s2 ON sr.receiver_student_id = s2.student_id
        JOIN Skill sk1 ON sr.offered_skill = sk1.skill_id
        JOIN Skill sk2 ON sr.requested_skill = sk2.skill_id
    """)

    swaps = cursor.fetchall()

    result = []
    for s in swaps:
        result.append({
            "id": s['swap_id'],
            "requesterName": s['sender_name'],
            "receiverName": s['receiver_name'],
            "skillOfferedName": s['offered_name'],
            "skillWantedName": s['wanted_name'],
            "status": s['status'].lower()
        })

    cursor.close()
    conn.close()

    return jsonify(result)


# ------------------------------
if __name__ == "__main__":
    app.run(debug=True)