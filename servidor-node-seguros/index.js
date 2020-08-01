const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const { salvarSeguro, listarSeguros } = require('./seguro-service');
const webpush = require('web-push');

// VAPID keys should only be generated only once.
const vapidKeys = {
    publicKey: 'BARF1allHQr_azfaWIRbFUDnaj1wMwEHUlu9mP-tsNelmMq1N3DYhThmS-mefsiRDhKb0i8tRsQMsMoFZqseO7Q',
    privateKey: 'pdQWC1YwNiav93jeDgBWS5oeec50lTheMfqogmB1HiY'
}

webpush.setVapidDetails(
    'teste@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

app.route('/api/seguros').post(salvarSeguro);
app.route('/api/seguros').get(listarSeguros);

const HOST = 'localhost';
const PORT = 9000;

const httpServer = app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
})