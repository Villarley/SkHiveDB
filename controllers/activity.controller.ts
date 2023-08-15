import { Request, Response } from "express";
import Activity from "../models/Classroom/Activity"; // Adjust the path to the Activity model
import ActivityClass from "../models/Classroom/ActivityClass"; // Import your ActivityClass model
import ActivityStudent from "../models/Classroom/ActivityStudent";
import StudentClass from "../models/Classroom/student_class";
import sequelize from '../db/connection';
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

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    let existingActivity:any;

    // Check if the user already has an existing activity
    if (id) {
      existingActivity = await Activity.findByPk(id);
    }

    if (!existingActivity) {
      // If no existing activity, create a new one
      existingActivity = await Activity.create(
        {
          name,
          description,
          Skills,
          Time,
          DateToComplete,
        },
        { transaction } // Specify the transaction
      );
    }

    // Check if the existing activity is already assigned to the class
    const isAssigned = await ActivityClass.findOne({
      where: {
        ActivityId: existingActivity.id,
        ClassId: classId,
      },
    });

    if (!isAssigned) {
      // If the activity is not assigned to the class, create an ActivityClass entry
      await ActivityClass.create(
        {
          ActivityId: existingActivity.id,
          ClassId: classId,
          DateToComplete,
        },
        { transaction } // Specify the transaction
      );
    }

    // Fetch students in the class from StudentClass
    const studentsInClass = await StudentClass.findAll({
      where: {
        ClassId: classId,
      },
    });

    // Create ActivityStudent entries for each student
    const studentActivityPromises = studentsInClass.map(async (student) => {
      await ActivityStudent.create(
        {
          ActivityId: existingActivity.id,
          StudentEmail: student.StudentEmail,
        },
        { transaction } // Specify the transaction
      );
    });

    // Execute all studentActivityPromises concurrently
    await Promise.all(studentActivityPromises);

    await transaction.commit(); // Commit the transaction

    res.status(201).json(existingActivity);
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction on error
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
