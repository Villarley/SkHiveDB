import { Router } from "express";
import { check } from "express-validator";
import { validateField } from "../middlewares/validatefields";
import {
  createActivity,
  updateActivity,
  deleteActivity,
  getActivities,
  getActivityById,
  createActivityWithAssignment,
  getActivitiesByClassId,
  updateStudentGrades,
  createAiActivity,
} from "../controllers/activity.controller"; 

const router = Router();

// Get All activities
router.get("/", getActivities);

// Obtain activity by id
router.get("/:id", getActivityById);

// Create an activity with gpt model
router.post("/Davinci", createAiActivity);
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

router.post("/assign", createActivityWithAssignment);
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
router.get("/ClassId/:id", getActivitiesByClassId);
//update grade
router.post("/ActivityStudent", updateStudentGrades);
// Delete an activity
router.delete("/:id", deleteActivity);



export default router;
