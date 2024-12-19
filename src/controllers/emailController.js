const { PrismaClient } = require('@prisma/client');
const { mailOptions, transporter } = require("../config/nodemailer");
require('dotenv').config(); 

const prisma = new PrismaClient();

// Función para generar el contenido del email con un enlace de recuperación
const generatePasswordResetContent = (resetLink) => {
  const htmlData = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Recuperación de Contraseña</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <style type="text/css">
      body, table, td, a{-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}
      table{border-collapse: collapse !important;}
      body{height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;}
      .reset-link {color: #007bff; text-decoration: none;}
    </style>
  </head>
  <body style="margin: 0 !important; padding: 0 !important; background: #fff">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td bgcolor="#ffffff" align="center" style="padding: 10px 15px 30px 15px">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px">
            <tr>
              <td>
                <h2>Recuperación de Contraseña</h2>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${resetLink}" class="reset-link">${resetLink}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

return {
  text: `Haz clic en este enlace para restablecer tu contraseña: ${resetLink}`,
  html: htmlData
};

};

// Modificación del controlador de email
const emailController = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Bad request: Email is required" });
  }

  try {
    // Verificar si el email existe en la tabla Usuarios
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ message: "Email inexistente en la base" });
    }

    // Generar el token para la recuperación de contraseña
    const resetToken = Math.random().toString(36).substring(7); // Esto es solo un ejemplo, usa un método más seguro en producción
    const resetLink = `${process.env.appUrl}reset-password?token=${resetToken}`;

    // Guardar el token en el campo tokenEmail de la tabla Usuarios
    await prisma.usuario.update({
      where: { email },
      data: { tokenEmail: resetToken }
    });

    // Enviar el email
    await transporter.sendMail({
      ...mailOptions,
      ...generatePasswordResetContent(resetLink),
      subject: 'Recuperación de Contraseña',
      to: email
    });

    return res.status(200).json({ success: true, message: "Email de recuperación enviado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al procesar la solicitud: " + err.message });
  }
};

module.exports = emailController;