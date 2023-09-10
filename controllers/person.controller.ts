//
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {Person} from "../models/person";
import {Student} from "../models/student";
import {Professor} from "../models/professor";
import { sendEmail } from "../utils/sendEmail";
import { welcomeEmailTemplate } from "../utils/emailTemplates";

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
export const putPerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, name, surnames, password, state, google } = req.body;
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

    res.json(person);
  } catch (error) {
    console.error("Error al actualizar la persona:", error);
    res.status(500).json({ error: "Error al actualizar la persona" });
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
