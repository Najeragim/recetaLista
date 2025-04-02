const express = require('express'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const User = require('./user.model');
const app = express(); 
app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://myrilingui:myriam@cluster0.pqsyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body; 

  try {
    const newUser = new User({ username, password, email });
    await newUser.save(); 
    console.log('Usuario registrado:', newUser);
    res.status(200).json({ message: 'Usuario registrado' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).json({
        message: 'Login exitoso',
        username: user.username, 
        email: user.email 
      });
    } else {
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
