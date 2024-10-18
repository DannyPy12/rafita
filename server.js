const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

// Habilitar CORS
app.use(cors({
  origin: '*', // Cambia esto al dominio donde se hospeda tu frontend
  methods: ['GET', 'POST']
}));
app.use(express.json());

// Configuración de conexión a la base de datos
const pool = mysql.createPool({
  connectionLimit: 10, // número máximo de conexiones simultáneas
  host: 'rafadetallado.neuroseeq.com',
  user: 'u475816193_rafa',
  password: 'Danny9710',
  database: 'u475816193_rafadetallado'
});

// Función para manejar errores de conexión
pool.on('error', (err) => {
  console.error('Error en el pool de conexiones MySQL:', err);
});

// Endpoint de login de administrador
app.post('/api/admin-login', (req, res) => {
  const { username, password } = req.body;

  pool.query('SELECT * FROM admins WHERE username = ?', [username], (error, results) => {
    if (error) {
      console.error('Error en la consulta SQL:', error);
      return res.status(500).send('Error en el servidor.');
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado.' });
    }

    const admin = results[0];
    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ success: false, message: 'Contraseña incorrecta.' });
      }
      res.json({ success: true });
    });
  });
});

// Endpoint para guardar reportes
app.post('/api/reportes', (req, res) => {
    const { service, date, price, received, change } = req.body;
  
    // Verifica que todos los datos necesarios están presentes
    if (!service || !date || price === undefined || received === undefined || change === undefined) {
      return res.status(400).json({ success: false, message: 'Faltan datos necesarios.' });
    }
  
    const query = 'INSERT INTO reportes (service, date, price, received, change) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [service, date, price, received, change], (err, result) => {
      if (err) {
        console.error('Error al guardar el reporte:', err);
        return res.status(500).send('Error al guardar el reporte');
      }
      res.status(201).send('Reporte guardado con éxito');
    });
  });
  

// Cerrar el pool de conexiones al finalizar el servidor
process.on('SIGINT', () => {
  pool.end((err) => {
    if (err) {
      console.error('Error al cerrar el pool de conexiones', err);
    } else {
      console.log('Pool de conexiones cerrado.');
    }
    process.exit();
  });
});

// Escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
