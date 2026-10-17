require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/salud', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS estatus FROM estatus_orden'
    );

    res.json({
      ok: true,
      estatus: rows[0].estatus
    });
  } catch (error) {
    console.error('Error de conexión:', error.message);

    res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar la base de datos'
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API en http://localhost:${PORT}`);
});