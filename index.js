'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

// Database
const dbClient = require('./config/database');
//Test DB
dbClient.connect()
.then(() => console.log('Database connected ...'))
.catch((error) => console.log(error));

const app = express();

// Inclusion of Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => { res.render('index'); });
app.use('/adressen', require('./routes/adressen'));
app.use('/immobilien', require('./routes/immobilien'));
app.use('/personen', require('./routes/personen'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
