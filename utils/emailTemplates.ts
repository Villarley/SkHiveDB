import { capitalizeNameAndSurnames } from "./capitalizeNameAndSurnames";

interface WelcomeEmailData {
    email: string;
    name: string;
}
export const welcomeEmailTemplate = (data: WelcomeEmailData) => {
    const { email, name } = data;
    const formattedName = capitalizeNameAndSurnames(name);
    
    return {
        to: email,
        subject: "Bienvenido a Skhive",
        html: `<body style="font-family: Arial, sans-serif; background-color: #f6f5f7; text-align: center;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);">
          <tr>
            <td style="padding: 20px;">                
              <h1 style="color: #6F3BFF;">¡Bienvenido a Skhive!</h1>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Estimado , ${formattedName}</p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Gracias por unirte a Skhive, la plataforma líder en habilidades blandas.</p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Esperamos que disfrutes de todas las características y beneficios que tenemos para ofrecerte.</p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">¡Gracias por ser parte de la comunidad Skhive!</p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Atentamente,</p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">El equipo de Skhive</p>
            </td>
          </tr>
        </table>
      </body>`
    };
};

