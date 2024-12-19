const express = require('express');
const multer = require('multer');
const path = require('path');
const  uploadFile  = require('./src/controllers/uploadController');
const  uploadNews  = require('./src/controllers/uploadNews.js');
const  getNoticias  = require('./src/controllers/getNoticias.js');
const validarUsuario = require('./src/controllers/validarUsuario.js');
const nuevoUsuario = require('./src/controllers/nuevoUsuario.js');
const actualizarLikes = require('./src/controllers/actualizarLikes.js');
const emailController = require('./src/controllers/emailController.js');
const verifyTokenController = require('./src/controllers/verifyToken.js');
const resetPasswordController = require('./src/controllers/resetPassword.js');
const router = express.Router();

const uploadsDir = path.join(__dirname, 'uploaded');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Rutas
router.post('/upload', upload.single('file'), uploadFile);
router.post('/data',  uploadNews);
router.get('/news',  getNoticias);
router.get('/news/:id', getNoticias);
router.get('/usuarios/', validarUsuario);
router.post('/usuarios/', validarUsuario);
router.post('/nuevousuario/', nuevoUsuario);
router.post('/reset-password/', resetPasswordController);
router.post('/likes/:id', actualizarLikes);
router.post("/emails", emailController);
router.get('/verify-token/', verifyTokenController);


module.exports = router;