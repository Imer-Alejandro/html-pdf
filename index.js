const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const util = require('util');
const htmlToPdf = require('html-pdf');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

app.use(cors());

const createPdf = util.promisify(htmlToPdf.create);
app.use(bodyParser.json());

// Configuración CORS para Express
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // Puedes ajustar esto según tus necesidades
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// Ruta para recibir la plantilla HTML y generar el PDF
app.post('/generar-pdf', (req, res) => {
    const { html } = req.body;
   
    const pdfOptions = { format: 'Letter' };
  
    htmlToPdf.create(html, pdfOptions).toFile('factura.pdf', (err, pdfPath) => {
      if (err) {
        console.error('Error al generar el PDF:', err);
        res.status(500).send('Error al generar el PDF',err,pdfPath);
      } else {
        console.log('PDF generado:', pdfPath);
  
        // Envía el archivo PDF al cliente para su descarga
        res.download(pdfPath.filename, 'factura.pdf', err => {
          if (err) {
            console.error('Error al descargar el PDF:', err);
          }
                  // Elimina el archivo PDF después de descargarlo
          // (Opcional: puedes optar por no eliminarlo si deseas conservar copias)
          fs.unlinkSync(pdfPath.filename);
        });
      }
    });
  });
  

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });