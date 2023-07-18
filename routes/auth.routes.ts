import { Router } from "express";
import { check } from "express-validator";
import { googleSignIn, googleSignUp, login } from "../controllers/auth";
import { validateField } from "../middlewares/validatefields";
const router = Router();

router.post("/login", [
    check('email', 'Correo no es válido').isEmail(), 
    // check('password', 'La contraseña debe tener 6 caractéres').isLength({ min: 6}), 
    validateField
]        ,login);
router.post("/google", [
    check('id_token', 'token de google es necesario').not().isEmpty(),  
    validateField
]        ,googleSignUp);
router.post("/loginGoogle", [
    check('id_token', 'token de google es necesario').not().isEmpty(),  
    validateField
]        ,googleSignIn);
export default router;
