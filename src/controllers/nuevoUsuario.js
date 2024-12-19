const { prisma } = require("../../db.js");
const bcrypt = require("bcrypt");

const nuevoUsuario = async (req, res) => {
    if (req.method === "POST") {
        try {
            const hashPassword = async (plaintextPassword) => {
                return await bcrypt.hash(plaintextPassword, 10);
            };

            const { nombre, email, password, avatar, puedeescribir, linkautor } = req.body;

            // Verificar si el email ya está registrado
            const emailRegistrado = await prisma.usuario.findUnique({
                where: { email: email }
            });

            if (emailRegistrado === null) {
                const usuarioData = {
                    nombre: nombre,
                    email: email,
                    passhasheada: await hashPassword(password),
                    avatar: avatar,
                    puedeescribir: puedeescribir,
                    linkautor: linkautor || null  // Si linkautor no se proporciona, se establecerá como null
                };

                console.log(usuarioData);

                // Crear el usuario con Prisma
                await prisma.usuario.create({
                    data: usuarioData
                });

                res.json({
                    success: true,
                    message: "Operación exitosa. Redirigiendo al login"
                });
            } else {
                console.log("entró al else");
                res.status(422).json({ message: "El email ya está registrado" });
            }
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            res.status(500).json({ message: "Server no disponible" });
        }
    } else {
        res.status(405).json({ message: "Método no permitido" });
    }
};

module.exports = nuevoUsuario;