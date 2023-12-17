const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');

const port = process.env.PORT || 5000;

// Configura el middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: '*', // Permite conexiones desde cualquier origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Configura el motor de plantillas EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('inicio');
});

app.post('/example/:data', (req, res) => {
  const data = req.params.data;
  res.send(`${data}`);
});

// Ruta para recibir la petición y generar y descargar el PDF
app.post('/generar-pdf', async (req, res) => {
  const { datos } = req.body;  // Ajusta esto según cómo envías los datos

  try {
    // Renderiza la plantilla con los datos
    const html = await ejs.renderFile(path.join(__dirname, 'views', 'factura.ejs'), { datos });

    // Crea una instancia de Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Establece el contenido HTML en la página
    await page.setContent(html);

    // Genera el PDF directamente con Puppeteer
    const pdfBuffer = await page.pdf({ format: 'A4' });

    // Cierra la instancia de Puppeteer
    await browser.close();

    // Configura los encabezados de la respuesta para indicar que es un archivo PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=factura.pdf');

    // Envía el contenido del PDF directamente al cliente
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
