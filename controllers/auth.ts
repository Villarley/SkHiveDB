import { Request, Response } from 'express';
import Person from '../models/person';
import bcryptjs from "bcrypt";
import { generateJWT } from '../helpers/generatorJWT';
import { googleVerify } from '../helpers/google-verify';
import Student from '../models/student';
import Professor from '../models/professor';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el email existe
    const person = await Person.findByPk(email);

    if (!person) {
      return res.json({ message: 'Email o contraseña incorrectos' });
    }

    // Verificar si el usuario está activo
    if (!person.state) {
      return res.json({ message: 'Email o contraseña incorrectos - Estado false' });
    }

    // Verificar la contraseña
    const validPassword = await bcryptjs.compare(password, person.password as string);

    if (!validPassword) {
      return res.json({ message: 'Email o contraseña incorrectos' });
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
    const { name, family_name, email } = await googleVerify(id_token);

    let person = await Person.findByPk(email);

    
    if (!person) {
      console.log(role);
      const data = {
        email,
        name,
        surnames: family_name,
        password: ':P',
        google: true,
        state: true
      };
      
      const newPerson = await Person.create(data);
      console.log(newPerson);

      // Verificar si se debe crear un estudiante o un profesor
      let newRole;
      if (role === 'student') {
        newRole = await Student.create({ email });
      } else if (role === 'professor') {
        newRole = await Professor.create({ email });
      }
      
      const token = await generateJWT(newPerson.email);
      
      res.json({
        newPerson,
        token
      });
    } else {

      const token = await generateJWT(person.email);

      res.json({
        msg: 'account already exists',
        person,
        token
      });
    }
  } catch (err) {
    res.status(400).json({
      ok: false,
      msg: 'No se pudo validar el token'
    });
  }
};
export const googleSignIn = async (req: Request, res: Response) => {
  const { id_token } = req.body;
  const { email } = await googleVerify(id_token)
  console.log(req.body);
  try {
    // Verificar si el email existe
    const person = await Person.findByPk(email);
    console.log(person);
    if (!person) {
      return res.json({ message: 'El usuario no esta registrado' });
    }

    // Verificar si el usuario está activo
    if (!person.state) {
      return res.json({ message: 'Este usuario esta inactivo' });
    }
    if (!person.google) {
      return res.json({ message: 'Este usuario no esta registrado con google' });
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
