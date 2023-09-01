import db from '../../db/connection'; // Adjust this path to your actual db config file

import { Activity, initModel as initActivity } from "./Activity";
import { ActivityClass, initModel as initActivityClass } from "./ActivityClass";
import { ActivityStudents, initModel as initActivityStudents } from "./ActivityStudent";
import { Class, initModel as initClass } from "./class";
import { ProfessorClass, initModel as initProfessorClass } from "./professor_class";
import { StudentClass, initModel as initStudentClass } from "./student_class";
import { Person, initModel as initPerson } from "../person";
import { Professor, initModel as initProfessor } from "../professor";
import { Student, initModel as initStudent } from "../student";
import { Reminder, initModel as initReminder } from "../reminder"; // Adjust the path
import { Notification, initModel as initNotification } from "../notification"; // Adjust the path

export const initializeModels = async() => {
    // Initialize all models
    try {
        console.log("1");
        await initPerson(db);
        await initProfessor(db);
        await initStudent(db);
        await initClass(db);
        await initActivity(db);
        await initActivityClass(db);
        await initActivityStudents(db);
        await initProfessorClass(db);
        await initStudentClass(db);
        await initReminder(db);  // Initialize Reminder model
        await initNotification(db);  // Initialize Notification model
    } catch (error) {
        console.log(error);
    }

};

export const configureAssociations = () => {
    // Associations for Person
    Person.hasOne(Professor, {
        foreignKey: 'email',
        sourceKey: 'email',
        as: 'professorDetails'
    });

    Person.hasOne(Student, {
        foreignKey: 'email',
        sourceKey: 'email',
        as: 'studentDetails'
    });

    // Associations for Professor
    Professor.belongsTo(Person, {
        foreignKey: 'email',
        targetKey: 'email'
    });

    Professor.belongsToMany(Class, {
        through: ProfessorClass,
        foreignKey: 'ProfessorEmail',
        otherKey: 'ClassId'
    });

    // Associations for Student
    Student.belongsTo(Person, {
        foreignKey: 'email',
        targetKey: 'email'
    });

    Student.belongsToMany(Class, {
        through: StudentClass,
        foreignKey: 'StudentEmail',
        otherKey: 'ClassId'
    });

    // Associations for Class
    Class.belongsToMany(Professor, {
        through: ProfessorClass,
        foreignKey: 'ClassId',
        otherKey: 'ProfessorEmail'
    });

    Class.belongsToMany(Student, {
        through: StudentClass,
        foreignKey: 'ClassId',
        otherKey: 'StudentEmail'
    });

    Class.hasMany(ActivityClass, {
        foreignKey: 'ClassId',
        sourceKey: 'id'
    });

    // Associations for Activity
    Activity.hasMany(ActivityClass, {
        foreignKey: 'ActivityId',
        sourceKey: 'id'
    });

    Activity.hasMany(ActivityStudents, {
        foreignKey: 'ActivityId',
        sourceKey: 'id'
    });

    // Associations for ActivityClass
    ActivityClass.belongsTo(Activity, {
        foreignKey: 'ActivityId',
        targetKey: 'id'
    });

    ActivityClass.belongsTo(Class, {
        foreignKey: 'ClassId',
        targetKey: 'id'
    });

    // Associations for ActivityStudents
    ActivityStudents.belongsTo(Activity, {
        foreignKey: 'ActivityId',
        targetKey: 'id'
    });

    ActivityStudents.belongsTo(StudentClass, {
        foreignKey: 'ClassId',
        targetKey: 'ClassId'
    });

    // Add associations for Reminders and Notifications if they have relationships with other tables
};

// You can then call `initializeModels` before `configureAssociations` in your server setup.
