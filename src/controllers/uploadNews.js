const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const uploadNews = async (req, res) => {
  // Extrae el contenido HTML del cuerpo de la solicitud
  console.log(req.body);
  const content = req.body.content;

  // Expresión regular para buscar URLs de imágenes en el contenido HTML
  const imgRegex = /<img.*?src=['"](.*?)['"]/;
  const match = content.match(imgRegex);

  let imageUrl = '';
  if (match && match[1]) {
    imageUrl = match[1]; // Si se encuentra una imagen, guarda la URL
  }

  // Prepara el objeto noticia
  const noticia = {
    title: req.body.title,
    date: new Date(), // Esto establece la fecha y hora actual
    description: content,
    image: imageUrl, // Solo si se encontró una imagen en el contenido
    likes: 0,
    usuarioId: req.body.usuarioId,
  };

  try {
    await prisma.noticia.create({
      data: noticia
    });
    res.send({ status: true });
  } catch (error) {
    console.error('Error al crear la noticia:', error);
    res.status(500).send({ status: false, error: 'Error al guardar la noticia' });
  }
};

module.exports = uploadNews;