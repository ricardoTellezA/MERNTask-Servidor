const mongoose = require('mongoose');



const ProyectoShema = mongoose.Schema({

    nombre: {
        type:String,
        require: true,
        trim: true
    },

    creador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario'
    },
    creado:{
        type:Date,
        default:Date.now(),
    }
});

module.exports = mongoose.model('Proyecto',ProyectoShema); 