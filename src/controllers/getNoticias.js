const { prisma } = require("../../db.js");

const getNoticias = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Número de noticias por página
    const skip = (page - 1) * limit; // Prisma usa 'skip' en lugar de 'offset'

    if (id) {
      // Si se proporciona un id, busca una noticia específica
      const noticia = await prisma.noticia.findUnique({
        where: { id: parseInt(id) },
        include: {
          autor: true // 'author' es el nombre del campo en tu modelo Prisma para la relación con Usuario
        }
      });

      if (noticia) {
        res.json({ article: noticia });
      } else {
        res.status(404).json({ error: 'Noticia no encontrada' });
      }
    } else {
      // Si no se proporciona un id, busca todas las noticias con paginación
      const count = await prisma.noticia.count({
           });

      const noticias = await prisma.noticia.findMany({
        skip,
        take: limit,
        orderBy: {
          date: 'desc'
        },
        include: {
          autor: true
        }
      });

      res.json({
        articles: noticias,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      });
    }
  } catch (error) {
    console.error('Error fetching noticias:', error);
    res.status(500).json({ error: 'Error fetching noticias' });
  }
};

module.exports = getNoticias;