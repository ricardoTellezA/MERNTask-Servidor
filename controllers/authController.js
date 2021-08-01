const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.autenticarUsuario = async (req, res) => {
    

    //REVISAR SI HAY ERRORES

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }



    //extraer email y pass

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });
        

        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: "La contraseña es incorrecta" });
        }


        const payload = {
            usuario: {
                id: usuario.id
            }
        };

       
        ///firmar el token

        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 36000 //1hora

        }, (error, token) => {

            if (error) throw error;
            //mensaje confimacion
            res.json({ token });

        });
    } catch (error) {
        console.log(error);

    }



}

//obtiene usuario autenticado

exports.usuarioAutenticado = async (req, res) => {
   
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }

}
