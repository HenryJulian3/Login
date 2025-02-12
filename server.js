const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Asegura que sirva archivos estáticos

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Ruta para servir index.html en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,  
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // 👈 Agregar esto si AWS requiere SSL
});

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        console.log("Solicitud de registro recibida:", req.body); // <-- Agregado para depuración

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id',
            [username, hashedPassword, email]
        );

        console.log("Usuario registrado con ID:", result.rows[0].id); // <-- Agregado para verificar éxito

        res.status(201).json({ message: 'Usuario registrado', userId: result.rows[0].id });
    } catch (err) {
        console.error("Error en /register:", err); // <-- Esto mostrará el error exacto
        res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
    }
});


// Probar conexión
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error conectando a PostgreSQL:', err);
    } else {
        console.log('✅ Conexión exitosa a PostgreSQL:', res.rows[0].now);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login exitoso', token });
    } catch (err) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
