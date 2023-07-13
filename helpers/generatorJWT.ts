import jwt from 'jsonwebtoken';
export const generateJWT = (email: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const payload = { email };
  
      jwt.sign(
        payload,
        process.env.SECRETORPRIVATEKEY as string,
        {
          expiresIn: '4h',
        },
        (err, token) => {
          if (err) {
            console.error(err);
            reject('No se pudo generar el token');
          } else {
            resolve(token as string);
          }
        }
      );
    });
  };
  