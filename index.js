'use strict';

// Inclusion of express (web framework for nodeJS)
const express = require('express');
const app = express();

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

// Body Parser helps with parsing
// the content from reqests into JSON
// format
const bodyParser = require('body-parser');
app.use(express.urlencoded({
  extended: false
}));

// Functions for working with folder
// structures
const path = require('path');

// Inclusion of postgresql database
const dbClient = require('./config/database');
dbClient.connect()
  .then(() => console.log('Database connected ...'))
  .catch((error) => console.log(error));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api')); // For data calls

// Simple websockets route
app.ws('/ws', async function(ws, req) {
  ws.on('message', async function(msg) {
    console.log('Websocket received message');
    console.log(JSON.parse(msg));
		console.log(req.socket.remoteAddress);
    // Send back some data
    ws.send(JSON.stringify({
      "append": true,
      "returnText": "I am using websockets!"
    }));
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
