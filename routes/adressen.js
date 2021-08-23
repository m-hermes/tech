'use strict';

const express = require('express');
const addrRouter = express.Router();
const dbClient = require('../config/database');
const dbFunctions = require('./databaseFunctions');

addrRouter.get('/', (req, res) => {
	dbFunctions.getAllAdresses()
	.then((pageData) => res.render('adressen', {pageData}))
	.catch((e) => {
		console.log(e);
		res.redirect('error', {text: 'Adressen konnten nicht gefunden werden.'});
	})

});


module.exports = addrRouter;
