//RUTAS PARA autotifacar usuarios
const express = require('express');
const router = express.Router();
// const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');


//INICIAR SESION
//API USUARIO
router.post('/',
    
    authController.autenticarUsuario,
);
//OBTIENE EL USUARIO AUTENTICADO
router.get('/',

auth,
authController.usuarioAutenticado



);
module.exports = router;