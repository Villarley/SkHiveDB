import { Model } from 'sequelize';

import Person from '../person';
import Professor from '../professor';
import Student from '../student';
import Class from './class';
import Activity from './Activity';
import ActivityClass from './ActivityClass';
import ActivityStudent from './ActivityStudent';
import ProfessorClass from './professor_class';
import StudentClass from './student_class';
import Reminder from '../reminder';
// import Notification from './notifications';

export const configureAssociations = () => {
    // Relaciones para Person
    Person.hasOne(Professor, {
        foreignKey: 'email',
        sourceKey: 'email',
        onDelete: 'CASCADE',
    });

    Person.hasOne(Student, {
        foreignKey: 'email',
        sourceKey: 'email',
        onDelete: 'CASCADE',
    });

    Person.hasMany(Reminder, {
        foreignKey: 'PersonEmail',
        sourceKey: 'email',
        onDelete: 'CASCADE',
    });

    // Person.hasMany(Notification, {
    //     foreignKey: 'PersonEmail',
    //     sourceKey: 'email',
    //     onDelete: 'CASCADE',
    // });

    // Relaciones para Class
    Class.hasMany(ActivityClass, {
        foreignKey: 'ClassId',
        sourceKey: 'id',
        onDelete: 'CASCADE',
    });

    Class.belongsToMany(Professor, {
        through: ProfessorClass,
        foreignKey: 'ClassId',
    });

    Class.belongsToMany(Student, {
        through: StudentClass,
        foreignKey: 'ClassId',
    });

    // Relaciones para Activity
    Activity.hasMany(ActivityClass, {
        foreignKey: 'ActivityId',
        sourceKey: 'id',
        onDelete: 'CASCADE',
    });

    Activity.hasMany(ActivityStudent, {
        foreignKey: 'ActivityId',
        sourceKey: 'id',
        onDelete: 'CASCADE',
    });

    // Relaciones para ActivityClass y Reminder
    // ActivityClass.hasMany(Notification, {
    //     foreignKey: 'ActivityClassId',
    //     sourceKey: 'id',
    //     onDelete: 'CASCADE',
    // });

    // Reminder.hasMany(Notification, {
    //     foreignKey: 'ReminderId',
    //     sourceKey: 'id',
    //     onDelete: 'CASCADE',
    // });
};

