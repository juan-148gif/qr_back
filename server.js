const express = require('express');
const mysql = require('mysql'); // Usar solo mysql2
const cors = require('cors');
const bodyParser = require('body-parser')
const mysql2 = require('mysql2/promise')

const app = express();
const PORT = 3307; 


app.use(cors());
app.use(bodyParser.json())

const DB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'P8AG2)tbWee0zKOI',
    database: 'dbproyecto'
});

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'P8AG2)tbWee0zKOI',
    database: 'dbproyecto'
});


DB.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        process.exit(1); 
    }
    console.log('Conexión exitosa a la base de datos');
});

app.get('/usuarios', (req, res) => {
    const SQL_QUERY = 'SELECT * FROM usuarios';
    DB.query(SQL_QUERY, (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error al ejecutar la consulta' });
            return;
        }
        res.json(result);
    });
});

app.post( '/post/usuarios', async (req, res) =>{
    const { nombre, equipo, integrantes } = req.body;

    if ( !nombre || !equipo || !integrantes) {
        return res.status(400).json({ error: ' Falta nombre o email' });
    }

    try {
        const [rows] = await pool.execute('INSERT INTO usuarios (nombre, equipo, integrantes) VALUES (?, ?, ?)', [nombre, equipo, integrantes]);
        res.status(201).json({ message: 'Usuario creado exitosamente', id: rows.insertId });
    } catch (error) {
        console.error('Error al insertar usuario:', error);
        res.status(500).json({ error: 'Error al insertar usuario' });
    }
})

app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ error: 'Error inesperado' });
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}` );
});