import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Person from '../models/person';
import Student from '../models/student';
import Professor from '../models/professor';

// Obtener una persona por su ID
export const getPerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const person = await Person.findByPk(id);

    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    res.json(person);
  } catch (error) {
    console.error('Error al obtener la persona:', error);
    res.status(500).json({ error: 'Error al obtener la persona' });
  }
};

// Obtener todas las personas
export const getPersons = async (req: Request, res: Response) => {
  try {
    const persons = await Person.findAll();
    res.json(persons);
  } catch (error) {
    console.error('Error al obtener las personas:', error);
    res.status(500).json({ error: 'Error al obtener las personas' });
  }
};

// Crear una nueva persona
export const postPerson = async (req: Request, res: Response) => {
  try {
    const { email, name, surnames, password, role } = req.body;

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear la persona
    const newPerson = await Person.create({ email, name, surnames, password: hashedPassword, state: true });

    // Verificar si se debe crear un estudiante o un profesor
    let newRole;
    if (role === 'student') {
      newRole = await Student.create({ email });
    } else if (role === 'professor') {
      newRole = await Professor.create({ email });
    }

    res.status(201).json({ person: newPerson, role: newRole });
  } catch (error) {
    console.error('Error al crear la persona:', error);
    res.status(500).json({ error: 'Error al crear la persona' });
  }
};

// Actualizar una persona existente
export const putPerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, name, surnames, password, state } = req.body;
    const person = await Person.findByPk(id);

    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    person.email = email;
    person.name = name;
    person.surnames = surnames;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      person.password = hashedPassword;
    }

    person.state = state;
    await person.save();

    res.json(person);
  } catch (error) {
    console.error('Error al actualizar la persona:', error);
    res.status(500).json({ error: 'Error al actualizar la persona' });
  }
};

// Eliminar una persona completamente
export const deletePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const person = await Person.findByPk(id);

    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    await person.destroy();

    res.json({ message: 'Persona eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la persona:', error);
    res.status(500).json({ error: 'Error al eliminar la persona' });
  }
};

// Cambiar el estado de una persona a false
export const deactivatePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const person = await Person.findByPk(id);

    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    person.state = false;
    await person.save();

    res.json({person});
  } catch (error) {
    console.error('Error al desactivar la persona:', error);
    res.status(500).json({ error: 'Error al desactivar la persona' });
  }
};
