import { Request, Response } from "express";
import Activity from "../models/Classroom/Activity"; // Adjust the path to the Activity model
import StudentClass from "../models/Classroom/student_class";
import ActivityClass from "../models/Classroom/ActivityClass"; // Import your ActivityClass model
import ActivityStudent from "../models/Classroom/ActivityStudent";
import sequelize from '../db/connection';
import ActivityStudents from "../models/Classroom/ActivityStudent";
// Create a new activity
export const createActivity = async (req: Request, res: Response) => {
  try {
    // Extract necessary data from the request body
    const { name, description, Skills, Time } = req.body;

    // Create a new activity using the provided data
    const newActivity = await Activity.create({
      name,
      description,
      Skills,
      Time,
    });

    // Respond with the newly created activity
    res.status(201).json(newActivity);
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing activity by its ID
export const updateActivity = async (req: Request, res: Response) => {
  const activityId = req.params.id;

  try {
    // Extract data from the request body
    const { name, description, Skills, Time } = req.body;

    // Find the activity by its ID
    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      // If activity is not found, respond with a 404 error
      return res.status(404).json({ message: "Activity not found" });
    }

    // Update the activity with the provided data
    await activity.update({
      name,
      description,
      Skills,
      Time,
    });

    // Respond with a success message
    res.json({ message: "Activity updated successfully" });
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an activity by its ID
export const deleteActivity = async (req: Request, res: Response) => {
  const activityId = req.params.id;

  try {
    // Find the activity by its ID
    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      // If activity is not found, respond with a 404 error
      return res.status(404).json({ message: "Activity not found" });
    }

    // Delete the activity from the database
    await activity.destroy();

    // Respond with a success message
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all activities
export const getActivities = async (req: Request, res: Response) => {
  try {
    // Retrieve all activities from the database
    const activities = await Activity.findAll();

    // Respond with the list of activities
    res.json(activities);
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get an activity by its ID
export const getActivityById = async (req: Request, res: Response) => {
  const activityId = req.params.id;

  try {
    // Find the activity by its ID
    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      // If activity is not found, respond with a 404 error
      return res.status(404).json({ message: "Activity not found" });
    }

    // Respond with the activity
    res.json(activity);
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const createActivityWithAssignment = async (req: Request, res: Response) => {
  const { id, name, description, Skills, Time, DateToComplete, classId } = req.body;

  const transaction = await sequelize.transaction(); // Iniciar una transacción

  try {
    let existingActivity: any;

    // Comprobar si ya existe una actividad existente
    if (id) {
      existingActivity = await Activity.findByPk(id);
    }

    if (!existingActivity) {
      // Si no existe, crear una nueva actividad
      existingActivity = await Activity.create(
        {
          name,
          description,
          Skills,
          Time,
          DateToComplete,
        },
        { transaction } // Especificar la transacción
      );
    }

    // Comprobar si la actividad ya está asignada a la clase
    const isAssigned = await ActivityClass.findOne({
      where: {
        ActivityId: existingActivity.id,
        ClassId: classId,
      },
      transaction, // Especificar la transacción
    });

    if (!isAssigned) {
      // Si la actividad no está asignada a la clase, crear una entrada en ActivityClass
      await ActivityClass.create(
        {
          ActivityId: existingActivity.id,
          ClassId: classId,
          DateToComplete,
        },
        { transaction } // Especificar la transacción
      );
    }

    // Obtener estudiantes en la clase desde ActivityClass
    const studentsInClass = await StudentClass.findAll({
      where: {
        ClassId: classId,
      },
      transaction, // Especificar la transacción
    });
    // Crear entradas en ActivityStudent para cada estudiante
    const studentActivityPromises = studentsInClass.map(async (student) => {
      console.log(student.ClassId);
      await ActivityStudent.create(
        {
          ActivityId: existingActivity.id,
          ClassId: student.ClassId,
          grade: null,
        },
        { transaction } // Especificar la transacción
      );
    });

    // Ejecutar todas las promesas de studentActivityPromises concurrentemente
    await Promise.all(studentActivityPromises);

    await transaction.commit(); // Confirmar la transacción

    res.status(201).json(existingActivity);
  } catch (error) {
    await transaction.rollback(); // Revertir la transacción en caso de error
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Get activities by class ID
export const getActivitiesByClassId = async (req: Request, res: Response) => {
  const classId = req.params.id;
  console.log(classId);
  try {
    // Find all activities associated with the class
    const activities = await ActivityClass.findAll({
      where: { ClassId: classId }, 
    });
  
    const activitiesDetails = await Promise.all(
      activities.map(async (activity) => {
        const activityDetails = await Activity.findByPk(activity.ActivityId);
        if (activityDetails) {
          return {
            ...activityDetails.toJSON(),
            DateToComplete: activity.DateToComplete
          };
        }
        return null; // O cualquier valor predeterminado que desees para actividades no encontradas
      })
    );
  
    const filteredActivitiesDetails = activitiesDetails.filter(activity => activity !== null);
  
    // Respond with the list of activities with DateToComplete
    res.json(filteredActivitiesDetails);
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
  

};
// Update grades for a student in an activity
export const updateStudentGrades = async (req: Request, res: Response) => {
  const { ClassId, ActivityId, grade } = req.body;
  console.log(req.body)
  try {
    // Find the entry in ActivityStudents based on ClassId and ActivityId
    const activityStudent = await ActivityStudent.findOne({
      where: {
        ClassId,
        ActivityId,
      },
    });

    if (!activityStudent) {
      return res.status(404).json({ message: "Activity student not found" });
    }

    // Update the grade field with the provided grade data
    await activityStudent.update({ grade });

    res.json({ message: "Student grades updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



