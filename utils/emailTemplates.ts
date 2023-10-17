import { capitalizeNameAndSurnames } from "./capitalizeNameAndSurnames";
import ProfessorService from "../services/professor.service"

interface WelcomeEmailData {
    email: string;
    name: string;
}
interface notificationData {
    personEmail: string;
    description: string;
    title: string;
}
interface notificationAssignmentData{
  personEmail: string;
  professorEmail: string;
  classs:string;
  title:string;
  date:Date;
  professorInfo:{
    name:string,
  }
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
export const notificationEmailTemplate = (data: notificationData) => {
  const { personEmail, description, title } = data;
  
  return {
      to: personEmail,
      subject: `Notificación: ${title}`,
      html: `<body style="font-family: Arial, sans-serif; background-color: #f6f5f7; text-align: center;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);">
        <tr>
          <td style="padding: 20px;">                
            <h1 style="color: #6F3BFF;">${title}</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">${description}</p>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Haz clic en el botón a continuación para acceder a tu panel de control:</p>
            <a href="http://localhost:3000/dashboard" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #6F3BFF; border-radius: 5px; text-decoration: none;">Ir al Dashboard</a>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 20px;">Atentamente,</p>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">El equipo de Skhive</p>
          </td>
        </tr>
      </table>
    </body>`
  };
};
export const notificationAssignmentTemplate = (data: notificationAssignmentData) => {
  const { personEmail, professorEmail, classs, title, date } = data;
  const professorInfo:any = ProfessorService.getProfessorInfo(professorEmail);
  console.log(professorInfo);
  return {
    to: personEmail,
    subject: `Se ha añadido una nueva actividad a la clase ${title}`,
    html: `<body style="font-family: Arial, sans-serif; background-color: #f6f5f7; text-align: center;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);">
      <tr>
        <td style="padding: 20px;">                
          <h1 style="color: #6F3BFF;">${title}</h1>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">Fecha de entrega: ${date}</p>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">Profesor: ${professorInfo.name} (${professorEmail})</p>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">Clase: ${classs}</p>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">Haz clic en el botón a continuación para acceder a tu panel de control:</p>
          <a href="http://localhost:3000/dashboard" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #6F3BFF; border-radius: 5px; text-decoration: none;">Ir al Dashboard</a>
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 20px;">Atentamente,</p>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">El equipo de Skhive</p>
        </td>
      </tr>
    </table>
  </body>`
  };
}



