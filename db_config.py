import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="shrav*2820*sql",   
        database="skill_swap"
    )