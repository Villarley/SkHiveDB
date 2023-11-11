//
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {Person} from "../models/person";
import {Student} from "../models/student";
import {Professor} from "../models/professor";
import { sendEmail } from "../utils/sendEmail";
import { welcomeEmailTemplate } from "../utils/emailTemplates";
import personService from "../services/person.service";
import activityService from "../services/activity.service";

export const generateCodeAndSendEmail = async (req: Request, res: Response) => {
  try {
      const { email } = req.body;
      if (!email) {
          return res.status(400).json({ error: "El correo electrónico es requerido" });
      }
      const generatedCode = await personService.generateAndSendVerificationCode(email);
      if (!generatedCode){
        return res.status(404).json({message:"Usuario no encontrado"})
      }
      return res.status(200).json({ message: "Código de verificación enviado. Por favor, verifica tu correo." });
  } catch (error) {
      console.error("Error al generar y enviar el código de verificación:", error);
      res.status(500).json({ error: "Error al generar y enviar el código de verificación" });
  }
};

// Obtener una persona por su ID
export const getPerson = async (req: Request, res: Response, data: any) => {
  try {
    const { id } = req.params;
    const person = await Person.findByPk(id);

    if (!person) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }

    res.json(person);
  } catch (error) {
    console.error("Error al obtener la persona:", error);
    res.status(500).json({ error: "Error al obtener la persona" });
  }
};

// Obtener todas las personas
export const getPersons = async (req: Request, res: Response) => {
  try {
    const persons = await Person.findAll();
    res.json(persons);
  } catch (error) {
    console.error("Error al obtener las personas:", error);
    res.status(500).json({ error: "Error al obtener las personas" });
  }
};

// Crear una nueva persona
export const postPerson = async (req: Request, res: Response) => {
  try {
    const { email, name, surnames, password, role, google } = req.body;
    const activities = [
      {
        name: "Presentación por parejas",
        description: "El primer día de clases, el docente asignará parejas aleatorias. Cada pareja tendrá 5 minutos para conversar entre ellos y luego presentarán a su compañero ante la clase, destacando 3 cosas interesantes que hayan aprendido sobre él.",
        Skills: ["Escucha activa", "Comunicación efectiva", "Adaptabilidad",],
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

    

    const existingPerson = await Person.findByPk(email);
    if(!existingPerson) {
      // Encrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      //Creating person
      const newPerson = await Person.create({
        email,
        name,
        surnames,
        password: hashedPassword,
        state: true,
        google,
      });
  
      // Verificar si se debe crear un estudiante o un profesor
      let newRole;
      if (role === "student") {
        newRole = await Student.create({ email });
      } else if (role === "professor" || role ===undefined || role ===null  ) {
        activities.map((activity)=>(
          activityService.createActivity(activity)
        ))
        newRole = await Professor.create({ email });
      }
      const dataEmail = {
        email: newPerson.email,
        name: newPerson.name,
      }
      const formattedEmailTemplate = welcomeEmailTemplate(dataEmail);
      sendEmail(formattedEmailTemplate);
      res
        .status(201)
        .json({ person: newPerson, msg: "Perfil creado correctamente" });
    }
    else{
      res.json({msg: "Email asociado a una cuenta"});
    }
  } catch (error) {
    console.error("Error al crear la persona:", error);
    res.status(500).json({ error: "Error al crear la persona" });
  }
};

// Actualizar una persona existente
export const updatePersonWithCodeVerification = async (req: Request, res: Response) => {
  try {
      const  { id } = req.params;
      const { email, name, surnames, password, state, google, verificationCode } = req.body;

      // Verificar el código
      const isValid = personService.verifyCode(email, verificationCode);
      if (!isValid) {
          return res.status(400).json({ error: "Código de verificación incorrecto" });
      }

      // Actualizar el perfil del usuario
      const person = await Person.findByPk(id);
      if (!person) {
          return res.status(404).json({ error: "Persona no encontrada" });
      }

      person.email = email;
      person.name = name;
      person.surnames = surnames;
      if (password && password.trim().length > 0) {
        if (password.trim().length < 6) {
            return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        person.password = hashedPassword;
    }    
      person.state = state;
      person.google = google;
      await person.save();
      const updatedPerson = {
        name,
        email,
        surnames,
      }

      return res.status(200).json({ updatedPerson, message: "Perfil actualizado con éxito" });
  } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      res.status(500).json({ error: "Error al actualizar el perfil" });
  }
};

// Eliminar una persona completamente
export const deletePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const person = await Person.findByPk(id);

    if (!person) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }

    await person.destroy();

    res.json({ msg: "Persona eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la persona:", error);
    res.status(500).json({ error: "Error al eliminar la persona" });
  }
};

// Cambiar el estado de una persona a false
export const deactivatePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const person = await Person.findByPk(id);

    if (!person) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }

    person.state = false;
    await person.save();

    res.json({ person });
  } catch (error) {
    console.error("Error al desactivar la persona:", error);
    res.status(500).json({ error: "Error al desactivar la persona" });
  }
};
export const createStudents = async(req:Request, res: Response) => {
  const students = req.body;
  console.log(students);
  try {
    if(students && students.length > 0){
      const formattedStudents = [];
      const createdPerson = await Person.bulkCreate(students);
      const createdStudents = await Student.bulkCreate(students);
      res.json({data:createdStudents});
    }else{
      res.json({msg:"No hay estudiantes para añadir"});
    }
    
  } catch (error) {
    console.error("Error al añadir los estudiantes", error)
  }
}