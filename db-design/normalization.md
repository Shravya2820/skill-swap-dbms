# Normalization of SkillSwap Database

## 1NF (First Normal Form)
- All attributes are atomic
- No repeating groups
- Example: Skills separated into Skill table

## 2NF (Second Normal Form)
- No partial dependency
- All non-key attributes depend on full primary key
- Example: Skill_Offer depends on student_id and skill_id

## 3NF (Third Normal Form)
- No transitive dependency
- Example: Student details stored separately, not repeated

## Conclusion
Database is normalized up to 3NF to avoid redundancy and improve efficiency
