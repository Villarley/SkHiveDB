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
} from "../controllers/class.controller"; // Suponemos que tienes los controladores para las diferentes operaciones

const router = Router();

// Ruta para obtener todas las clases
router.get("/classes", getClasses);

// Ruta para obtener detalles de una clase por su ID
router.get("/classes/:id", getClassById);

// Ruta para crear una nueva clase
router.post(
  "/classes",
  [
    check("name", "El nombre de la clase es requerido").notEmpty(),
    // Otras validaciones según tus requerimientos
  ],
  validateField,
  createClass
);

// Ruta para modificar una clase existente por su ID
router.put(
  "/classes/:id",
  [
    check("name", "El nombre de la clase es requerido").notEmpty(),
    // Otras validaciones según tus requerimientos
  ],
  validateField,
  updateClass
);

// Ruta para eliminar una clase por su ID
router.delete("/classes/:id", deleteClass);


// Ruta para agregar un estudiante a una clase
router.post("/classes/:id/add-student", addStudentToClass);

// Otras rutas relacionadas con las clases, si es necesario

export default router;
