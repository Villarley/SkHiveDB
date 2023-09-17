import db from "../../db/connection"; // db connection

import { Activity, initModel as initActivity } from "./Activity";
import { ActivityClass, initModel as initActivityClass } from "./ActivityClass";
import {
  ActivityStudents,
  initModel as initActivityStudents,
} from "./ActivityStudent";
import { Class, initModel as initClass } from "./class";
import {
  ProfessorClass,
  initModel as initProfessorClass,
} from "./professor_class";
import { StudentClass, initModel as initStudentClass } from "./student_class";
import { Person, initModel as initPerson } from "../person";
import { Professor, initModel as initProfessor } from "../professor";
import { Student, initModel as initStudent } from "../student";
import { Reminder, initModel as initReminder } from "../reminder"; 
import { Notification, initModel as initNotification } from "../notification"; 

export const initializeModels = async () => {
  // Initialize all models
  try {
    await initPerson(db);
    await initProfessor(db);
    await initStudent(db);
    await initClass(db);
    await initActivity(db);
    await initActivityClass(db);
    await initActivityStudents(db);
    await initProfessorClass(db);
    await initStudentClass(db);
    await initReminder(db); 
    await initNotification(db);
  } catch (error) {
    console.log(error);
  }
};

export const configureAssociations = () => {
  // --- PERSON ASSOCIATIONS ---
  // A person can be a professor, so we associate the Person model with the Professor model.
  // The 'email' field is used as the unique identifier to establish this relationship.
  Person.hasOne(Professor, {
    foreignKey: "email",
    sourceKey: "email",
    as: "professorDetails",
  });

  // Similarly, a person can also be a student.
  // Again, the 'email' field is used to establish this relationship.
  Person.hasOne(Student, {
    foreignKey: "email",
    sourceKey: "email",
    as: "studentDetails",
  });

  // --- PROFESSOR ASSOCIATIONS ---
  // A professor is essentially a person, so we associate the Professor model back to the Person model.
  Professor.belongsTo(Person, {
    foreignKey: "email",
    targetKey: "email",
  });

  // A professor can teach multiple classes, so we establish a many-to-many relationship 
  // between the Professor and Class models using the ProfessorClass as the junction table.
  Professor.belongsToMany(Class, {
    through: ProfessorClass,
    foreignKey: "ProfessorEmail",
    otherKey: "ClassId",
  });

  // --- STUDENT ASSOCIATIONS ---
  // A student is also a person, so we associate the Student model back to the Person model.
  Student.belongsTo(Person, {
    foreignKey: "email",
    targetKey: "email",
  });

  // A student can enroll in multiple classes, so we establish a many-to-many relationship 
  // between the Student and Class models using the StudentClass as the junction table.
  Student.belongsToMany(Class, {
    through: StudentClass,
    foreignKey: "StudentEmail",
    otherKey: "ClassId",
  });

  // A student can have multiple class associations, so we link the Student model to the StudentClass model.
  Student.hasMany(StudentClass, {
    foreignKey: "StudentEmail",
    sourceKey: "email",
  });

  // Linking the StudentClass model back to the Student model.
  StudentClass.belongsTo(Student, {
    foreignKey: "StudentEmail",
    targetKey: "email",
    as: "Student",
  });

  // --- CLASS ASSOCIATIONS ---
  // A class can have multiple professors, so we establish the relationship.
  Class.belongsToMany(Professor, {
    through: ProfessorClass,
    foreignKey: "ClassId",
    otherKey: "ProfessorEmail",
  });

  // Similarly, a class can have multiple students.
  Class.belongsToMany(Student, {
    through: StudentClass,
    foreignKey: "ClassId",
    otherKey: "StudentEmail",
  });

  // A class can have multiple activities, so we link the Class model to the ActivityClass model.
  Class.hasMany(ActivityClass, {
    foreignKey: "ClassId",
    sourceKey: "id",
  });

  // --- ACTIVITY ASSOCIATIONS ---
  // An activity can be associated with multiple classes.
  Activity.hasMany(ActivityClass, {
    foreignKey: "ActivityId",
    sourceKey: "id",
  });

  // An activity can have multiple students.
  Activity.hasMany(ActivityStudents, {
    foreignKey: "ActivityId",
    sourceKey: "id",
  });

  // Linking the ActivityClass model back to the Activity and Class models.
  ActivityClass.belongsTo(Activity, {
    foreignKey: "ActivityId",
    targetKey: "id",
  });
  ActivityClass.belongsTo(Class, {
    foreignKey: "ClassId",
    targetKey: "id",
  });

  // Linking the ActivityStudents model to the Activity model and the StudentClass model.
  ActivityStudents.belongsTo(Activity, {
    foreignKey: "ActivityId",
    targetKey: "id",
  });
  ActivityStudents.belongsTo(StudentClass, {
    foreignKey: "ClassId",
    targetKey: "ClassId",
  });
    // A Person can have multiple reminders.
    Person.hasMany(Reminder, {
      foreignKey: "personEmail",
      sourceKey: "email",
    });
  
    // --- REMINDER ASSOCIATIONS ---
    Reminder.belongsTo(Person, {
      foreignKey: "personEmail",
      targetKey: "email",
    });
  
    // --- NOTIFICATION ASSOCIATIONS ---
    Notification.belongsTo(ActivityClass, {
      foreignKey: "ActivityClassId",
      targetKey: "id",
    });
  
    Notification.belongsTo(Reminder, {
      foreignKey: "ReminderId",
      targetKey: "id",
    });
    // --- ACTIVITY ASSOCIATIONS ---
    Activity.hasMany(ActivityClass, {
      foreignKey: "ActivityId",
      sourceKey: "id",
    });
  
    Activity.hasMany(ActivityStudents, {
      foreignKey: "ActivityId",
      sourceKey: "id",
    });
  
    ActivityClass.belongsTo(Activity, {
      foreignKey: "ActivityId",
      targetKey: "id",
    });
    ActivityClass.belongsTo(Class, {
      foreignKey: "ClassId",
      targetKey: "id",
    });
  
    ActivityStudents.belongsTo(Activity, {
      foreignKey: "ActivityId",
      targetKey: "id",
    });
    ActivityStudents.belongsTo(StudentClass, {
      foreignKey: "ClassId",
      targetKey: "ClassId",
    });
  
};


