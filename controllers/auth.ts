//dependencies
import { Request, Response } from 'express';
import bcryptjs from "bcrypt";
//models:
import Person from '../models/person';
import Professor from '../models/professor';
import Student from '../models/student';
//models;
//My functions
import { generateJWT } from '../helpers/generatorJWT';
import { googleVerify } from '../helpers/google-verify';
import { sendEmail } from '../utils/sendEmail';
import { capitalizeNameAndSurnames } from '../utils/capitalizeNameAndSurnames';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el email existe
    const person = await Person.findByPk(email);

    if (!person) {
      return res.json({ msg: 'Email o contraseña incorrectos' });
    }

    // Verificar si el usuario está activo
    if (!person.state) {
      return res.json({ msg: 'Usuario inactivo' });
    }

    // Verificar la contraseña
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
    const { name, family_name, email }:any = await googleVerify(id_token);
    let person = await Person.findByPk(email);
    let firstName = name.split(" ")[0];
    firstName = capitalizeNameAndSurnames(firstName);
    if (!person) {
      const data = {
        email,
        name: firstName,
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
      const dataEmail = {
        email: newPerson.email||'',
        name: newPerson.name||'',
        surnames: family_name||''
      }
      sendEmail(dataEmail, "Welcome");
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
    // Verificar si el email existe
    const person = await Person.findByPk(email);
    console.log(person);
    if (!person) {
      return res.json({ msg: 'El usuario no esta registrado' });
    }

    // Verificar si el usuario está activo
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
