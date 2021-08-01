const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //REVISAR SI HAY ERRORES

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //extraer email and password

    const { email, password } = req.body;


    try {

        //REVISAR QUE EL EMAIL SEA UNICO


        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        //crea nuevo usuario
        usuario = new Usuario(req.body);

        //ENCRIPTAR EL PASSWORD

        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);


        //guarda nuevo usuario

        await usuario.save();

        //CRAR Y FIRMAR JASONWEBTOKEN
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        ///firmar el token

        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600//1hora

        }, (error, token) => {

            if (error) throw error;
            //mensaje confimacion
            res.json({ token });

        });



    } catch (error) {
        console.log(error);
        res.status(400).send('hubo un error');
    }
}