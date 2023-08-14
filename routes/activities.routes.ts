import { Router } from "express";
import { check } from "express-validator";
import { validateField } from "../middlewares/validatefields";
import {
  createActivity,
  updateActivity,
  deleteActivity,
  getActivities,
  getActivityById,
  // Add other controller functions as needed
} from "../controllers/activity.controller"; // Import your controller functions

const router = Router();

// Get All activities
router.get("/", getActivities);

// Obtain activity by id
router.get("/:id", getActivityById);

// Create an activity
router.post(
  "/",
  [
    check("name", "Activity name is required").notEmpty(),
    // Add other validations as needed
  ],
  validateField,
  createActivity
);

// Update an activity
router.put(
  "/:id",
  [
    check("name", "Activity name is required").notEmpty(),
    // Add other validations as needed
  ],
  validateField,
  updateActivity
);

// Delete an activity
router.delete("/:id", deleteActivity);

// Add more routes here as needed

export default router;
