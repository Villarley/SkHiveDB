import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Person from "../models/person";
import { Model } from "sequelize";

interface CustomRequest extends Request {
  email?: string | null | undefined;
  Person?: Model<any, any> | null | undefined;
}

export const validateJWT = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header('x-token');
  if (!token) {
    return res.status(401).json({ msg: 'No hay token en la petición' });
  }
  try {
    const { email } = jwt.verify(token as string, process.env.SECRETORPRIVATEKEY as string) as JwtPayload;

    const person = await Person.findByPk(email);

    if (!person) {
      return res.status(401).json({ msg: 'Persona no encontrada' });
    }

    req.email = email;
    req.Person = person;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: 'Token no válido' });
  }
};
