import { Request, Response } from 'express';
import Person from '../models/person';
import bcryptjs from "bcrypt";
import { generateJWT } from '../helpers/generatorJWT';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el email existe
    const person = await Person.findByPk(email);

    if (!person) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    // Verificar si el usuario está activo
    if (!person.state) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos - Estado false' });
    }

    // Verificar la contraseña
    const validPassword = await bcryptjs.compare(password, person.password as string);

    if (!validPassword) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    // Generar el token JWT
    const token = await generateJWT(person.email);

    res.json({
      person,
      token
    });
  } catch (err) {
    console.error('Error al hacer login:', err);
    return res.status(500).json({ msg: 'Hable con el administrador' });
  }
};
