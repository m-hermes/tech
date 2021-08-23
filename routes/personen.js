'use strict';

const express = require('express');
const persRouter = express.Router();
const dbClient = require('../config/database');
const dbFunctions = require('./databaseFunctions');

persRouter.get('/', (req, res) => {
  dbFunctions.getAllPersons()
    .then((pageData) => {
      res.render('personen', { pageData })
		})
    .catch((e) => {
      console.log(e);
      res.redirect('error', {
        text: 'Personen konnten nicht gefunden werden.'
      });
    })

});




module.exports = persRouter;
