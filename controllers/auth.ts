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
import activityService from '../services/activity.service';
import { generateRandomCode } from '../utils/generateCode';

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
    const activities = [
      {
        name: "Presentación por parejas",
        description: "El primer día de clases, el docente asignará parejas aleatorias. Cada pareja tendrá 5 minutos para conversar entre ellos y luego presentarán a su compañero ante la clase, destacando 3 cosas interesantes que hayan aprendido sobre él.",
        Skills: ["Escucha activa", "Comunicación efectiva", "Adaptabilidad", "Respeto"],
        Time: "10 minutos",
        createdBy: email,
        generatedActivity: "Descripción adicional si es necesario"
      },
      {
        name: "Canasta revuelta",
        description: "Todos los estudiantes se formarán en un círculo. Uno de ellos iniciará diciendo su nombre y mostrando una seña particular (ej. tocar la nariz). El siguiente estudiante dirá el nombre del anterior, hará su seña y añadirá la suya, y así sucesivamente. El objetivo es recordar todas las señas anteriores.",
        Skills: ["Concentración", "Comunicación", "Trabajo en equipo", "Gestión de presión"],
        Time: "15 minutos",
        createdBy: email,
        generatedActivity: "Descripción adicional si es necesario"
      },
      {
        name: "Alto y Siga",
        description: "Se divide al grupo en 4 grupos, cada uno con una actividad diferente. A la señal, todos comienzan a realizar su actividad. Cuando el docente grita '¡Alto!', todos se detienen y escuchan. A la siguiente señal '¡Siga!', los estudiantes rotan a la siguiente actividad.",
        Skills: ["Trabajo en equipo", "Toma de decisiones", "Orientación a resultados", "Adaptabilidad"],
        Time: "20 minutos",
        createdBy: email,
        generatedActivity: "Descripción adicional si es necesario"
      },
      {
        name: "La entrevista",
        description: "Se divide al grupo en parejas. Una persona es el entrevistador y la otra es el entrevistado. El entrevistador tiene 5 minutos para aprender todo lo que puede sobre el entrevistado. Luego, se invierten los roles. Al final, cada entrevistador presenta a su pareja al grupo.",
        Skills: ["Escucha activa", "Comunicación", "Adaptabilidad", "Empatía"],
        Time: "15 minutos",
        createdBy: email,
        generatedActivity: "Descripción adicional si es necesario"
      },
      {
        name: "Construye una historia",
        description: "Cada estudiante dice una frase para construir una historia. Por ejemplo, el primero dice 'Había una vez un dragón que vivía en un castillo'. El siguiente podría decir 'Este dragón amaba coleccionar zapatos'. Y así sucesivamente. El objetivo es construir una historia cohesiva y creativa.",
        Skills: ["Creatividad", "Escucha activa", "Trabajo en equipo", "Comunicación"],
        Time: "15 minutos",
        createdBy: email,
        generatedActivity: "Descripción adicional si es necesario"
      },
      // ... Continúa con las demás actividades
    ];
    let person = await Person.findByPk(email);
    let firstName = name.split(" ")[0];
    firstName = capitalizeNameAndSurnames(firstName);
    if (!person) {
      const password = generateRandomCode();
      const hashedPassword = await bcryptjs.hash(password, 10);
      const data = {
        email,
        name: firstName,
        surnames: family_name,
        password: hashedPassword  ,
        google: true,
        state: true
      };
      
      const newPerson = await Person.create(data);

      // Verifying 
      let newRole;
      if (role === 'student') {
        newRole = await Student.create({ email });
      } else if (role === 'professor') {
        activities.map((activity)=>(
          activityService.createActivity(activity)
        ))
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
  const { id_token, role } = req.body;
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
    // const isStudent = await Student.findByPk(email)
    // const isProfessor = await Professor.findByPk(email)
    // const userRole = isStudent ? "student" : "professor";
    // if(userRole != role){
    //   res.status(401).json({msg:"ya hay otro rol asociado a esta cuenta"})
    // }
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
