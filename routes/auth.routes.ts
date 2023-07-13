import { Router } from "express";
import { check } from "express-validator";
import { login } from "../controllers/auth";
import { validateField } from "../middlewares/validatefields";
const router = Router();

router.post("/login", [
    check('email', 'Correo no es válido').isEmail(), 
    check('password', 'La contraseña debe tener 6 caractéres').isLength({ min: 6}), 
    validateField
]        ,login);
router.post("/google", [
    check('email', 'Correo no es válido').isEmail(), 
    check('password', 'La contraseña debe tener 6 caractéres').isLength({ min: 6}), 
    validateField
]        ,login);

export default router;
