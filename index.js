'use strict';

// Inclusion of express (web framework for nodeJS)
const express = require('express');
const app = express();

// Inclusion of helmet for protection
// https://www.npmjs.com/package/helmet
const helmet = require('helmet');
app.use(helmet());

// Sets "Content-Security-Policy: script-src 'self'"
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      "default-src": helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
      "script-src": ["'self'"],
    },
  })
);

// Inclusion of expresWS, which brings in
// use of websockets
const expressWs = require('express-ws')(app);

// Inclusion of express handlebars,
// which is a view engine for express
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Functions for working with folder structures
const path = require('path');

// Inclusion of postgresql database
const dbClient = require('./config/database');
dbClient.connect()
  .then(() => console.log('Database connected ...'))
  .catch((error) => console.log(error));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Inclusion of functions needed for the app
const functs = require('./logic/logicFunctions');

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    globalCounter: functs.getCounter()
  });
});

// Sebsocket route
app.ws('/ws', async function(ws, req) {

  ws.on('message', async function(msg) {

    // Dealing with globalCounter
    if (msg === 'increaseGlobalCounter') {
      await functs.increaseCounter()
        // Sending new value to all clients
        .then(currentValue => {
          expressWs.getWss().clients.forEach(
            (client) => {
              client.send(JSON.stringify({
                'globalCounter': currentValue
              }));
            })
        });
    }

    // Dealing with new client
    // and its IP adress
    if (msg === 'hello') {
      // IP adress (no proxy)
      // let ipAdress = functs.anonymizeIp(req.socket.remoteAddress);

      // IP adress (proxy)
      let ipAdress = req.headers['x-forwarded-for'].split(',')[0].trim();

      // Update database and getting new list
      functs.updateAdressTable(ipAdress)
        // Sending new list to all clients
        .then(result =>
          expressWs.getWss().clients.forEach(
            (client) => {
              client.send(JSON.stringify({
                ipAdresses: result.rows
              }));
            })
        )
    }

  });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
