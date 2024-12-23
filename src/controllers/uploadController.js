// controllers/uploadController.js
const path = require('path');
require('dotenv').config(); 
console.log("file name:",req.file.filename,"URL:",process.env.REACT_APP_API_URL  )
const uploadFile = (req, res) => {
  // Asumiendo que `req.file` es manejado por Multer o una librería similar para el upload de archivos
  console.log(req.file.filename)
  const imageUrl = `${process.env.REACT_APP_API_URL}uploaded/${req.file.filename}`;
  console.log("URL de la imagen:", imageUrl);
  res.json({ url: imageUrl });
};

module.exports = uploadFile;
