const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const verifyTokenController = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ 
      success: false, 
      message: "Token de recuperación no proporcionado." 
    });
  }

  try {
    // Buscar el usuario con el token proporcionado
    const usuario = await prisma.usuario.findFirst({ where: { tokenEmail: token } });

    if (!usuario) {
      // No se encontró un usuario con ese token
      return res.status(404).json({ 
        success: false, 
        message: "Token no válido o expirado." 
      });
    }

    // Token encontrado, es válido
    return res.status(200).json({ 
      success: true, 
      message: "Token válido.", 
      userId: usuario.id // O cualquier otra información que quieras devolver
    });
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor." 
    });
  }
};

module.exports = verifyTokenController;