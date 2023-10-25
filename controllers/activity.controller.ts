import { Request, Response } from "express";
import {Activity} from "../models/Classroom/Activity"; // Adjust the path to the Activity model
import {StudentClass} from "../models/Classroom/student_class";
import {ActivityClass} from "../models/Classroom/ActivityClass"; // Import your ActivityClass model
import {ActivityStudents} from "../models/Classroom/ActivityStudent";
import sequelize from '../db/connection';
import axios from "axios";  
import OpenAI from "openai";
import dotenv from "dotenv";
import { where } from "sequelize";
import { Person } from "../models/person";
import ActivitieService from "../services/activity.service"

dotenv.config();
// Create a new activity with chatGPT
export const createAiActivity = async (req: Request, res: Response) => {
  const openai = new OpenAI({
      apiKey: process.env.openAiApi,
  });

  try {
      const { content } = req.body.messages[0];

      if (!content || content.trim() === '') {
          return res.status(400).json({ error: "El campo 'content' es requerido y no puede estar vacío." });
      }

      const stream = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: content }],
          stream: true,
      });

      // Usar Server Sent Events (SSE) para enviar respuestas en streaming al frontend
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const part of stream) {
          const messageContent = part.choices[0]?.delta?.content || '';
          res.write(`${ messageContent }`); // Enviar datos en formato SSE
      }

      res.end();

  } catch (error:any) {
      if (error instanceof OpenAI.APIError) {
          res.json({ error: error.message });
      } else {
          res.status(500).json({ error: error.message });
      }
      console.error(error);
  }
};

// Create a new activity
export const createActivity = async (req: Request, res: Response) => {
  try {
    // Extract necessary data from the request body
    const { name, description, Skills, Time, generatedActivity, professorEmail } = req.body;
    // Create a new activity using the provided data
    const newActivity = await Activity.create({
      name,
      description,
      Skills,
      Time,
      generatedActivity,
      createdBy:professorEmail,
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
  const { id:activityId, professorEmail } = req.params;
  console.log(professorEmail);
  try {
    // Find the activity by its ID
    const activity = await Activity.findByPk(activityId);
    const remainToProfessor = professorEmail == activity?.createdBy;
    if(!remainToProfessor){
      return res.status(404).json({ msg: "Actividad no encontrada" });
    }
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
  const { classId, ...activityData } = req.body;
  console.log(classId)
  try {
    const activityPromises = classId.map((id: string) => ActivitieService.createAndAssignActivity(activityData, id));
    const activities = await Promise.all(activityPromises);

    res.status(201).json({ activities, msg: "Actividad creada y asignada exitosamente" });
  } catch (error) {
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
  const { activityStudentId } = req.params;
  const { grade, feedBack } = req.body;
  try {
    // Find the entry in ActivityStudents based on ClassId and ActivityId
    const activityStudent:any = await ActivityStudents.findByPk(activityStudentId);

    if (!activityStudent) {
      return res.status(404).json({ msg: "Estudiante en actividad no encontrado" });
    } 

    // Update the grade field with the provided grade data
    await activityStudent.update({ grade, feedBack });
    console.log(activityStudent);

    res.json({ msg: "Calificaciones del estudiante actualizadas exitosamente",  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
export const getStudentActivityById = async(req:Request, res:Response) =>{
  const { activityId, classId } = req.params;
  // console.log("hola")
  try {
    const studentClasses = await StudentClass.findOne({where: {ActivityId: activityId, ClassId: classId}});
    console.log(studentClasses);
    res.json(studentClasses);
  } catch (error) {
    res.json({msg:"No fue posible encontrar los estudiantes de esta clase"})
    console.error(error);
  }

}
export const getActivityStudentsByActivityId = async(req: Request, res: Response) => {
  const { activityId } = req.params;
  
  try {
    const allActivityStudents = await ActivityStudents.findAll({
      where: {ActivityId: activityId},
    });

    // Mapear a través de los ActivityStudents y obtener el StudentEmail asociado
    const activityStudentsWithAssociatedEmails = await Promise.all(allActivityStudents.map(async (activityStudent: any) => {
      const studentDetails = await Person.findByPk(activityStudent.StudentEmail, {
        //excluding unnecessary info
        attributes: { exclude: ['google', 'state', 'password'] }
      });
      return {
        ...activityStudent.get(),  // Esto obtendrá todos los atributos del modelo como un objeto plano
        studentDetails  // Esto adjunta el correo electrónico asociado
      };
    }));
    
    res.json(activityStudentsWithAssociatedEmails);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export const getActivitiesByProfessor = async (req: Request, res: Response) => {
  const { professorEmail } = req.params;
  try {
      const activities = await ActivitieService.getActivitiesByProfessor(professorEmail);
      res.json({ activities, msg: "Actividades recuperadas exitosamente por" });
  } catch (error) {
    console.error(error);
    console.error(professorEmail); 
      res.status(500).json({ msg: "Error del servidor" });
  }
};
export const getActivitiesByStudentClass = async(req:Request, res:Response) => {
  const { classId, email } = req.params;
  try {
    const activities = await ActivityStudents.findAll({
        where: { StudentEmail: email },
        include: [
            {
                model: Activity,
                as: "Activity",
                include: [
                    {
                        model: ActivityClass,
                        where: { ClassId: classId },
                        required: true
                    }
                ]
            }
        ]
    });

    res.json(activities);
  } catch (error) {
    console.error("Error obteniendo actividades por estudiante y clase:", error);
    res.status(500).json({ msg: "Error obteniendo actividades por estudiante y clase" });
  }
}
export const getStudentActivityByEmail = async(req:Request, res:Response) => {
  const { StudentEmail, ActivityId } = req.params;
  try {
    const studentActivity = await ActivityStudents.findOne({where: { StudentEmail, ActivityId}, include: [Activity]});
    res.json(studentActivity);
  } catch (error) {
    console.error(error)
    res.sendStatus(500).json({msg:"Ocurrio un error al obtener la actividad de este usuario."})
  }
}
  
