import { transport } from "../config/nodemailer";

type EmailType = {
  name: string;
  email: string;
  token: string;
};

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    const email = await transport.sendMail({
      from: "Cashtrackr <admin@cashtrackr.com>",
      to: user.email,
      subject: "Confirma tu cuenta en Cashtrackr",
      html: `<p> Hola ${user.name}, has creado tu cuenta en Cashtrackr,ya esta casi lista</p>
             <p>Visita el siguiente enlace:</p>
             <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
             <p>e ingresa el codigo : <b>${user.token}</b> </p>`,
    });
  };
  static sendPasswordResetToken = async (user: EmailType) => {
    const email = await transport.sendMail({
      from: "Cashtrackr <admin@cashtrackr.com>",
      to: user.email,
      subject: "Cashtrackr - Restablecer tu contraseña",
      html: `<p> Hola ${user.name}, has solicitado restablecer tu contraseña</p>
             <p>Visita el siguiente enlace:</p>
             <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer Contraseña</a>
             <p>e ingresa el codigo : <b>${user.token}</b> </p>`,
    });
  };
}
