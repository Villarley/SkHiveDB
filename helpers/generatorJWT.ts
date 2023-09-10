import jwt from 'jsonwebtoken';
export const generateJWT = (email: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      //deconstructing the payload to get the email and asociating que jwt
      const payload = { email };
      //this function will build JWT
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
            //sending the token as a string
            resolve(token as string);
          }
        }
      );
    });
  };
  