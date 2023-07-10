import { Request, Response } from 'express';
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
      const { email, name, surnames, password } = req.body;
  
      // Crear la persona
      const newPerson = await Person.create({ email, name, surnames, password });
  
      // Verificar si se debe crear un estudiante o un profesor
      let newRole;
      if (req.body.role === 'student') {
        newRole = await Student.create({ email });
      } else if (req.body.role === 'professor') {
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
    const { email, name, surnames, password } = req.body;
    const person = await Person.findByPk(id);
    
    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    
    person.email = email;
    person.name = name;
    person.surnames = surnames;
    person.password = password;
    await person.save();
    
    res.json(person);
  } catch (error) {
    console.error('Error al actualizar la persona:', error);
    res.status(500).json({ error: 'Error al actualizar la persona' });
  }
};

// Eliminar una persona existente
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
