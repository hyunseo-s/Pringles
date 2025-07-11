import { getDbConnection } from '../db';

// Function to get the list of classes given a student Id
export async function getStudentsClasses(studentId: string) {

    const db = await getDbConnection();

    // Get the classes info from the Classes table by joining class students 
    // relation on where class id matches and student id matches
    const classes = await db.all(
        `SELECT c.classId, c.classname, c.classImg 
         FROM classes c 
         JOIN class_student cs ON c.classId = cs.classId 
         WHERE cs.studentId = ?`,
        [studentId]
    );

    return { classes };
}

// Function to add the student to a class given the classId and list of students
export async function addStudents(classId: string, students: string[]) {

    const db = await getDbConnection();

    // Go through all students email first
    for (const email of students) {

        // Get their user info
        const user = await db.get(
            `SELECT userid FROM users WHERE email = ?`,
            [email]
        );

        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        // Insert into class student table using the user info
        await db.run(
            `INSERT INTO class_student (classId, studentId) 
            VALUES (?, ?)`,
            [classId, user.userid]
        );
      }

    return { message: 'Students added' };
}

// Function to create a class
export async function createClass(name: string, students: string[], classImg: string, teacherId: string) {

    const db = await getDbConnection();

    // Insert into classes table using the info
    const res = await db.run(
        `INSERT INTO classes (classname, classImg) 
        VALUES (?, ?)`,
        [name, classImg]
    );

    // Once the table is created, we get the classId, and we put the teacher in
    const classId = res.lastID
    await db.run(
        `INSERT INTO class_teacher (classId, teacherId) 
        VALUES (?, ?)`,
        [classId, teacherId]
    );

    // Go through all students email first
    for (const email of students) {

        // Get their user info
        const user = await db.get(
            `SELECT userid FROM users WHERE email = ?`,
            [email]
        );

        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        // Insert into classes table using the info
        await db.run(
            `INSERT INTO class_student (classId, studentId) 
            VALUES (?, ?)`,
            [classId, user.userid]
        );
      }

    return { message: 'Students added' };
;
}