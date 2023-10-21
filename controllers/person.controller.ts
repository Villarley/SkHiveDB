//
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {Person} from "../models/person";
import {Student} from "../models/student";
import {Professor} from "../models/professor";
import { sendEmail } from "../utils/sendEmail";
import { welcomeEmailTemplate } from "../utils/emailTemplates";
import personService from "../services/person.service";


export const generateCodeAndSendEmail = async (req: Request, res: Response) => {
  try {
      const { email } = req.body;
      if (!email) {
          return res.status(400).json({ error: "El correo electrónico es requerido" });
      }
      await personService.generateAndSendVerificationCode(email);
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
      if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          person.password = hashedPassword;
      }
      person.state = state;
      person.google = google;
      await person.save();

      return res.status(200).json({ message: "Perfil actualizado con éxito" });
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