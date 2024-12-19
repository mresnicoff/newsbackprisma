const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const validarUsuario = async (req, res) => {
  console.log("Hola")
  if (req.method === "POST") {
    try {
      const datos = req.body;

      if (datos.email && datos.password) {
        // Buscar usuario por email
        const user = await prisma.usuario.findUnique({
          where: { email: datos.email },
        });

        if (user) {
          // Comparar la contraseña proporcionada con la almacenada
          if (await bcrypt.compare(datos.password, user.passhasheada)) {
            res.json({
              success: true,
              message: "Operación exitosa. Redirigiendo a la sección de noticias"
            });
          } else {
            res.status(200).json({ success: false, message: "La clave no coincide" });
          }
        } else {
          res.status(422).json({ message: "Usuario no registrado" });
        }
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    // Manejo de GET para buscar usuario por email
    const email = req.query.email;
    if (email) {
      const user = await prisma.usuario.findUnique({
        where: { email: email },
      });
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "Email no proporcionado en la consulta" });
    }
  }
};

module.exports = validarUsuario;