import { Request, Response } from "express";
import {Activity} from "../models/Classroom/Activity"; // Adjust the path to the Activity model
import {StudentClass} from "../models/Classroom/student_class";
import {ActivityClass} from "../models/Classroom/ActivityClass"; // Import your ActivityClass model
import sequelize from '../db/connection';
import {ActivityStudents} from "../models/Classroom/ActivityStudent";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
// Create a new activity with chatGPT
export const createAiActivity = async(req:Request, res:Response) =>{
  try {
    const prompt = req.body.messages[0].content;
    const max_tokens = req.body.max_tokens || 150;

    const openaiResponse = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
      prompt: prompt,
      max_tokens: max_tokens
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.openAiApi}`,
        'Content-Type': 'application/json'
      },
      responseType: 'stream' 
    });
    openaiResponse.data.pipe(res);

  } catch (error:any) {
    const errorMessage = error.response?.data?.error || error.message;
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({ error: errorMessage });
  }
}
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
    res.status(201).json({ newActivity, msg: "Actividad creada exitosamente" });
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
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
      return res.status(404).json({ msg: "Actividad no encontrada" });
    }

    // Update the activity with the provided data
    await activity.update({
      name,
      description,
      Skills,
      Time,
    });

    // Respond with a success msg
    res.json({ msg: "Actividad actualizada exitosamente" });
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
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
      return res.status(404).json({ msg: "Actividad no encontrada" });
    }

    // Delete the activity from the database
    await activity.destroy();

    // Respond with a success msg
    res.json({ msg: "Actividad eliminada exitosamente" });
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Get all activities
export const getActivities = async (req: Request, res: Response) => {
  try {
    // Retrieve all activities from the database
    const activities = await Activity.findAll();

    // Respond with the list of activities
    res.json({ activities, msg: "Actividades recuperadas exitosamente" });
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
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
      return res.status(404).json({ msg: "Actividad no encontrada" });
    }

    // Respond with the activity
    res.json({ activity, msg: "Actividad recuperada exitosamente" });
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
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
      await ActivityStudents.create(
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

    res.status(201).json({ existingActivity, msg: "Actividad creada y asignada exitosamente" });
  } catch (error) {
    await transaction.rollback(); // Revertir la transacción en caso de error
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
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
    res.json({ filteredActivitiesDetails, msg: "Actividades recuperadas exitosamente por ID de clase" });
  } catch (error) {
    // Handle any errors that may occur
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Update grades for a student in an activity
export const updateStudentGrades = async (req: Request, res: Response) => {
  const { ClassId, ActivityId, grade } = req.body;
  console.log(req.body)
  try {
    // Find the entry in ActivityStudents based on ClassId and ActivityId
    const activityStudent = await ActivityStudents.findOne({
      where: {
        ClassId,
        ActivityId,
      },
    });

    if (!activityStudent) {
      return res.status(404).json({ msg: "Estudiante en actividad no encontrado" });
    } 

    // Update the grade field with the provided grade data
    await activityStudent.update({ grade });

    res.json({ msg: "Calificaciones del estudiante actualizadas exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
