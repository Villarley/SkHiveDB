//dependencies
import { Request, Response, NextFunction } from 'express';
import bcryptjs from "bcrypt";
//models:
import {Person} from '../models/person';
import {Professor} from '../models/professor';
import {Student} from '../models/student';
//models;
//My functions
import { generateJWT } from '../helpers/generatorJWT';
import { googleVerify } from '../helpers/google-verify';
import { sendEmail } from '../utils/sendEmail';
import { capitalizeNameAndSurnames } from '../utils/capitalizeNameAndSurnames';
import { format } from 'sequelize/types/utils';
import { welcomeEmailTemplate } from '../utils/emailTemplates';
import jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    email?: string;
  }
}
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verify if there is an existing user
    const person = await Person.findByPk(email);

    if (!person) {
      return res.json({ msg: 'Email o contraseña incorrectos' });
    }

    // Verify if active
    if (!person.state) {
      return res.json({ msg: 'Usuario inactivo' });
    }

    // Verify password
    const validPassword = await bcryptjs.compare(password, person.password as string);

    if (!validPassword) {
      return res.json({ msg: 'Email o contraseña incorrectos' });
    }

    // Generar el token JWT
    const token = await generateJWT(person.email);

    res.json({
      person,
      token,
      msg: "Login exitoso"
    });
  } catch (err) {
    console.error('Error al hacer login:', err);
    return res.status(500).json({ msg: 'Hable con el administrador' });
  }
};
export const googleSignUp = async (req: Request, res: Response) => {
  const { id_token, role } = req.body;
  try {
    //deconstructing google's payload
    const { name, family_name, email }:any = await googleVerify(id_token);
    let person = await Person.findByPk(email);
    let firstName = name.split(" ")[0];
    firstName = capitalizeNameAndSurnames(firstName);
    if (!person) {
      const data = {
        email,
        name: firstName,
        surnames: family_name,
        password: '3.1415926',
        google: true,
        state: true
      };
      
      const newPerson = await Person.create(data);

      // Verifying 
      let newRole;
      if (role === 'student') {
        newRole = await Student.create({ email });
      } else if (role === 'professor') {
        newRole = await Professor.create({ email });
      }
      
      const token = await generateJWT(newPerson.email);
      const dataEmail = {
        email: newPerson.email,
        name: newPerson.name,
      }
      const formattedEmailTemplate = welcomeEmailTemplate(dataEmail);
      sendEmail(formattedEmailTemplate);
      res.json({
        person: newPerson,
        token,
        msg:"Usuario creado",
      });
    } else {
      //generate jwt
      const token = await generateJWT(person.email);

      res.json({
        msg: 'La cuenta ya existe',
        person,
        token
      });
    }
  } catch (err) {
    res.status(401).json({
      ok: false,
      msg: 'No se pudo validar el token'
    });
  }
};
export const googleSignIn = async (req: Request, res: Response) => {
  const { id_token } = req.body;
  const { email } = await googleVerify(id_token)
  try {
    // Verify if exists
    const person = await Person.findByPk(email);
    if (!person) {
      return res.json({ msg: 'El usuario no esta registrado' });
    }

    // Verify if active
    if (!person.state) {
      return res.json({ msg: 'Este usuario esta inactivo' });
    }
    if (!person.google) {
      return res.json({ msg: 'Este usuario no esta registrado con google' });
    }

    // Verificar la contraseña

    // Generar el token JWT
    const token = await generateJWT(person.email);

    res.json({
      person,
      token,
      msg: "Login exitoso"
    });
  } catch (err) {
    console.error('Error al hacer login:', err);
    return res.status(500).json({ msg: 'Hable con el administrador' });
  }
};


export const auth = async (req: Request, res: Response, next: NextFunction) => {
  //obtaining token from the header
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { email } = jwt.verify(token, process.env.SECRETORPRIVATEKEY!) as any;
          req.email = email; // Adjuntamos el email al objeto req
        next(); // Pasamos el control al siguiente middleware o función

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
};

// Función para buscar el usuario
export const getUser = async (req: Request, res: Response) => {
    const email = req.email;

    try {
        const person = await Person.findByPk(email);

        if (!person) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        res.json({ person });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener el usuario'
        });
    }
};
