const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//crear servidor

const app = express();

//CONECTAR A LA BASE DE DATOS
conectarDB();

//HABILITAR CORS

app.use(cors());

//Hablitirar express.json
app.use(express.json({ extended: true }));

//PUERTO DE LA APP

const port = process.env.port || 4000;

//IMPORT RUTAS

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyecto', require('./routes/proyecto'));
app.use('/api/tareas', require('./routes/tareas'));


// //DEFINIR PAG PRINCIPAL
// app.get('/',(req,res) => {
//    res.send('Hola mundo');
// })

//ARRANCAR LA APP
app.listen(port, '0.0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})