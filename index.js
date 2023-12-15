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

const createPdf = util.promisify(htmlToPdf.create);
app.use(bodyParser.json());



app.get('/',(req,res)=>{
    res.send('inicio')
})

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