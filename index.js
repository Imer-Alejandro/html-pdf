const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const util = require('util');
const htmlToPdf = require('html-pdf');
const bodyParser = require('body-parser'); 
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: '*', // Permite conexiones desde cualquier origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


app.use(bodyParser.json());



app.get('/',(req,res)=>{
    res.send('inicio')
})

app.post('/example/:data',(req,res)=>{
  const data = req.params.data
  res.send(`${data}`)
})

//rutas para general el pdf de las facturas

const createPdf = async (html, pdfOptions) => {
  return new Promise((resolve, reject) => {
    htmlToPdf.create(html, pdfOptions).toBuffer((err, buffer) => {
      if (err) {
        console.error('Error al generar el PDF:', err);
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};

// Ruta para recibir la plantilla HTML y generar el PDF
// Ruta para recibir la plantilla HTML y generar el PDF
app.post('/generar-pdf', async (req, res) => {
  try {
    const { html } = req.body;
    const pdfOptions = { format: 'Letter' };

    const pdfBuffer = await createPdf(html, pdfOptions);

    // Configura los encabezados de la respuesta para indicar que es un archivo PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=factura.pdf');

    // Log del tamaño del buffer
    console.log('PDF generado:', pdfBuffer.length, 'bytes');

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