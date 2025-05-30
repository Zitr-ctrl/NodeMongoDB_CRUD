const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Producto = require('./models/Producto');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// 🔗 Conexión MongoDB local o Atlas
mongoose.connect('mongodb://127.0.0.1:27017/crud_mongo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rutas

// Listar
app.get('/', async (req, res) => {
  const productos = await Producto.find();
  res.render('lista', { productos });
});

// Crear
app.get('/crear', (req, res) => {
  res.render('crear');
});

app.post('/crear', async (req, res) => {
  const { nombre, descripcion, stock } = req.body;
  const errores = [];

  if (!nombre || /\d/.test(nombre)) {
    errores.push("El nombre es obligatorio y no debe contener números.");
  }

  if (!descripcion || descripcion.length < 5) {
    errores.push("La descripción debe tener al menos 5 caracteres.");
  }

  if (!stock || isNaN(stock) || parseInt(stock) <= 0) {
    errores.push("El stock debe ser un número entero positivo.");
  }

  if (errores.length > 0) {
    return res.render('crear', { errores, nombre, descripcion, stock });
  }

  await Producto.create({
    nombre,
    descripcion,
    stock: parseInt(stock)
  });

  res.redirect('/');
});

// Editar
app.get('/editar/:id', async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  res.render('editar', { producto });
});

app.post('/editar/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, stock } = req.body;
  const errores = [];

  if (!nombre || /\d/.test(nombre)) {
    errores.push("El nombre es obligatorio y no debe contener números.");
  }

  if (!descripcion || descripcion.length < 5) {
    errores.push("La descripción debe tener al menos 5 caracteres.");
  }

  if (!stock || isNaN(stock) || parseInt(stock) <= 0) {
    errores.push("El stock debe ser un número entero positivo.");
  }

  const producto = await Producto.findById(id);

  if (errores.length > 0) {
    return res.render('editar', {
      errores,
      producto,
      nombre,
      descripcion,
      stock
    });
  }

  await Producto.findByIdAndUpdate(id, {
    nombre,
    descripcion,
    stock: parseInt(stock)
  });

  res.redirect('/');
});


// Eliminar
app.get('/eliminar/:id', async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
