const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
}

const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;
  console.log(token, password);

  if (!token || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Se requiere tanto el token como la nueva contraseña." 
    });
  }

  try {
    // Encuentra el usuario por el token de email
    const usuario = await prisma.usuario.findFirst({ 
      where: { tokenEmail: token }
    });

    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: "Token no válido o expirado." 
      });
    }

    // Hashea la nueva contraseña
    const hashedPassword = await hashPassword(password);

    // Actualiza la contraseña del usuario y limpia el tokenEmail
    await prisma.usuario.update({
      where: { id: usuario.id }, // Asegúrate de que 'id' es la clave primaria en tu modelo
      data: {
        passhasheada: hashedPassword, // Asegúrate de que tu modelo Usuario tenga el campo password configurado para usar este valor
        tokenEmail: null // Limpia el token de email ya que el proceso ha terminado
      }
    });

    return res.status(200).json({ 
      success: true, 
      message: "Contraseña actualizada con éxito." 
    });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor al restablecer la contraseña." 
    });
  }
};

module.exports = resetPasswordController;