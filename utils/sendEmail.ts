import nodeMailer from "nodemailer";

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (emailData: EmailData) => {
  try {
    const { to, subject, html } = emailData;
    // Create transporter
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "skhivedb@gmail.com",
        pass: "kfvdovuyiedsymdy",
      },
    });

    // Message object
    const message = {
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(message);
    console.log("Message sent", info.messageId);
  } catch (error) {
    console.log(error);
    throw new Error("El email no se pudo enviar");
  }
};
