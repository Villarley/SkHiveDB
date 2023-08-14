// class.routes.ts
import { Router } from "express";
import { check } from "express-validator";
import { validateField } from "../middlewares/validatefields";
import {
  createClass,
  updateClass,
  deleteClass,
  getClasses,
  getClassById,
  addStudentToClass,
  getStudentsInClass,
  getClassesByProfessor,
} from "../controllers/class.controller"; // Functions

const router = Router();

// get All classes
router.get("/", getClasses);

// Obtain class by id
router.get("/:id", getClassById);

// Create a class
router.post(
  "/",
  [
    check("name", "El nombre de la clase es requerido").notEmpty(),
    // Validations
  ],
  validateField,
  createClass
);

// 
router.put(
  "/:id",
  [
    check("name", "El nombre de la clase es requerido").notEmpty(),
    // Validations
  ],
  validateField,
  updateClass
);

// Eliminating Class
router.delete("/:id", deleteClass);

// Adding a student to a class
router.post("/add-student", addStudentToClass);

// Getting all the students by class 
router.get("/students/:code", getStudentsInClass);
// Getting all the classes that remains to a professor
router.get("/professor/:email", getClassesByProfessor);

export default router;
