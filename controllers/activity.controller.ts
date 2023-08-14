import { Request, Response } from "express";
import Activity from "../models/Classroom/Activity"; // Adjust the path to your Activity model

// Create a new activity
export const createActivity = async (req: Request, res: Response) => {
  try {
    // Extract necessary data from the request body
    const { name, description, Skills, Time, DateToComplete, ClassId } = req.body;

    // Create a new activity using the provided data
    const newActivity = await Activity.create({
      name,
      description,
      Skills,
      Time,
      DateToComplete,
      ClassId
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
    const { name, description, Skills, Time, DateToComplete, ClassId } = req.body;

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
      DateToComplete,
      ClassId
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
