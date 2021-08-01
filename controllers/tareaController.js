const Tarea = require('../models/Tarea');
const Proyectos = require('../models/Proyectos');
const { validationResult } = require('express-validator');


exports.crearTarea = async (req, res) => {

    //revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    //extraer el proyecto y comprobar que exist
    try {
        const { proyecto } = req.body;

        const proyectoExist = await Proyectos.findById(proyecto);

        if (!proyectoExist) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //REVISAR SI EL PROYECTO ACTUAL PERTENECE AL USUARIO AUTENTICADO
        //creador del proyecto

        if (proyectoExist.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //CREAR TAREA
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');

    }



}


//OBTENER TAREAS POR PROYECTO

exports.obtenerTareas = async (req, res) => {
    //extraer proyecto

    try {
        const { proyecto } = req.query;


        const proyectoExist = await Proyectos.findById(proyecto);

        if (!proyectoExist) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //REVISAR SI EL PROYECTO ACTUAL PERTENECE AL USUARIO AUTENTICADO
        //creador del proyecto

        if (proyectoExist.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas });
    } catch (error) {
        console.log(error);

        res.status(500).send('Hubo un error');
    }
}



//ACTUALIZAR UNA TAREA

exports.actualizarTarea = async (req, res) => {

    try {
        const { proyecto, nombre, estado } = req.body;

        //SI LA TAREA EXISTE O NO

        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: 'No existe la tarea' });
        }



        //extraer proyecto
        const proyectoExist = await Proyectos.findById(proyecto);



        //REVISAR SI EL PROYECTO ACTUAL PERTENECE AL USUARIO AUTENTICADO
        //creador del proyecto

        if (proyectoExist.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }
        //crear objeto

        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;


        //guardar tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });

        res.json({ tarea });



    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }



}


//ELIMINA UNA TAREA
exports.eliminarTarea = async (req, res) => {

    try {
        const { proyecto } = req.query;

        //SI LA TAREA EXISTE O NO

        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: 'No existe la tarea' });
        }



        //extraer proyecto
        const proyectoExist = await Proyectos.findById(proyecto);



        //REVISAR SI EL PROYECTO ACTUAL PERTENECE AL USUARIO AUTENTICADO
        //creador del proyecto

        if (proyectoExist.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //ELIMINAR TAREA
        await Tarea.findByIdAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea eliminada' });




    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
