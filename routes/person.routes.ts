import { Router } from "express";
import { check } from "express-validator";
import { validateField, validateJWT } from "../middlewares";
import {
  getPerson,
  getPersons,
  postPerson,
  deletePerson,
  putPerson,
  deactivatePerson,
  createStudents,
} from "../controllers/person.controller";

const router = Router();

router.get("/:id", validateJWT, getPerson);
router.get("/", validateJWT, getPersons);

router.post("/", [
  check('email', 'El correo no es válido').isEmail(),
  check('name', 'El nombre es requerido').notEmpty(),
  check('surnames', 'Los apellidos son requeridos').notEmpty(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  validateField
], postPerson);

router.put("/:id", [
  validateJWT,
  check('email', 'El correo no es válido').isEmail(),
  check('name', 'El nombre es requerido').notEmpty(),
  check('surnames', 'Los apellidos son requeridos').notEmpty(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  validateField
], putPerson);

router.delete(
  "/:id",
  [
    validateJWT,
    check("id", "No es un email válido").isEmail(),
    validateField,
  ],
  deactivatePerson
);

router.post("/createStudents", createStudents);

export default router;
// Ruta para obtener una persona por su ID:

// GET http://localhost:8880/api/person/:id
// Ruta para obtener todas las personas:

// GET http://localhost:8880/api/person
// Ruta para crear una nueva persona:

// POST http://localhost:8880/api/person
// Ruta para actualizar una persona existente:

// PUT http://localhost:8880/api/person/:id
// Ruta para eliminar una persona completamente:

// DELETE http://localhost:8880/api/person/:id