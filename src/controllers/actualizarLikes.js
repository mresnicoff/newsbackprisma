const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const actualizarLikes = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { id } = req.params;
      const { action } = req.body;

      // Buscamos la noticia por su id
      const noticia = await prisma.noticia.findUnique({
        where: { id: parseInt(id) } // Asegúrate de convertir 'id' a número si es necesario
      });

      if (!noticia) {
        return res.status(404).json({ message: "Noticia no encontrada" });
      }

      // Determinamos si incrementamos o decrementamos los likes
      let likesActualizados;
      if (action === 'increment') {
        likesActualizados = noticia.likes + 1;
      } else if (action === 'decrement') {
        likesActualizados = Math.max(noticia.likes - 1, 0); // Aseguramos que no bajemos de 0 likes
      } else {
        return res.status(400).json({ message: "Acción no válida" });
      }

      // Actualizamos el número de likes en la base de datos
      await prisma.noticia.update({
        where: { id: noticia.id },
        data: { likes: likesActualizados }
      });

      res.json({
        success: true,
        message: "Likes actualizados",
        likes: likesActualizados
      });
    } catch (error) {
      console.error('Error al actualizar likes:', error);
      res.status(500).json({ message: "Error del servidor al actualizar likes" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" }); // Solo permitimos POST para esta ruta
  }
};

module.exports = actualizarLikes;