'use strict';

const express = require('express');
const immoRouter = express.Router();
const dbClient = require('../config/database');
const dbFunctions = require('./databaseFunctions');

// Anzeigen der vorhanden Immobilien
immoRouter.get('/', (req, res) => {

	const immoQuery = 'select ' +
	'i.id, a.strasse, a.hausnr, a.stadt ' +
	'from immobilien.immobilie as i ' +
	'join immobilien.adresse as a ' +
	'on i.adress_id = a.id;';

	dbClient
	.query(immoQuery)
	.then(result => {
		let immoData = result.rows;
		res.render('immo', {
			immoData
		});
	})
	.catch(e => console.log(e))

});

// Formular für neue Immobilien
immoRouter.get('/add', (req, res) => {

	const addressQuery = 'select ' +
	'id, strasse, hausnr, plz, stadt ' +
	'from immobilien.adresse ' +
	'order by stadt, plz, strasse, hausnr;';

	const eigentuemerQuery = 'select ' +
	'id, vorname, nachname, geb_datum, geb_ort ' +
	'from immobilien.person;';

	let pageData = {
		adressData: {},
		eigentuemerData: {}
	};

	dbClient
	.query(addressQuery + ' ' + eigentuemerQuery)
	.then(result => {
		pageData.adressData = result[0].rows;
		pageData.eigentuemerData = result[1].rows;
		res.render('immoAdd', {
			pageData
		});
	})

});

// Hinzufügen neuer Immobilien
immoRouter.post('/add', (req, res) => {
	insertImmo(req, res)
	.then(() => res.redirect('/'))
	.catch((e) => {
		console.error(e);
		res.render('error', {
			text: 'Hinzufügen einer neuen Immobilie schlug fehl.'
		});
	})

	async function insertImmo(req, res) {

		try {

			await dbClient.query('begin');

			if (req.body.adress_id == -1) {
				// Neue Adresse erforderlich
				const adressQueryText = 'insert into immobilien.adresse ' +
				'(strasse, hausnr, plz, stadt) values ' +
				'($1, $2, $3, $4);';
				const adressQueryValues = [
					req.body.strasse,
					req.body.hausnr,
					req.body.plz,
					req.body.stadt
				];

				await dbClient.query(adressQueryText, adressQueryValues);

				// Bestimmen der neuen ID:
				const queryResultAdressID = await dbClient.query("select currval('immobilien.adresse_id_seq')")
				req.body.adress_id = queryResultAdressID.rows[0].currval;

			}

			if (req.body.eigentuemer_id == -1) {
				// Neuer Eigentümer erforderlich
				const eigentuemerQueryText = 'insert into immobilien.person ' +
				'(vorname, nachname, geb_datum, geb_ort) values ' +
				'($1, $2, $3, $4);';
				const eigentuemerQueryValue = [
					req.body.vorname,
					req.body.nachname,
					req.body.geb_datum,
					req.body.geb_ort
				];
				await dbClient.query(eigentuemerQueryText, eigentuemerQueryValue);

				// Bestimmen der neuen ID:
				const queryResultPersonID = await dbClient.query("select currval('immobilien.person_id_seq')");
				req.body.eigentuemer_id = queryResultPersonID.rows[0].currval;

			}

			// Neue Immobilie
			const immoQueryText = 'insert into immobilien.immobilie ' +
			'(adress_id, eigentuemer_id, wohnungsanzahl) values ' +
			'($1, $2, $3)';
			const immoQueryValues = [
				req.body.adress_id,
				req.body.eigentuemer_id,
				req.body.wohnungsanzahl
			];

			await dbClient.query(immoQueryText, immoQueryValues);

			await dbClient.query('COMMIT');

		} catch (e) {
			await dbClient.query('ROLLBACK');
			throw e;
		}

	}

});

// Darstellen der Immobiliendetails
immoRouter.get('/details', (req, res) => {

	dbFunctions.getImmoDetails(req.query.id)
	.then((pageData) => res.render('immoDetails', {
		pageData
	}))
	.catch((e) => {
		res.render('error', { text: 'Keine Daten zum Anzeigen gefunden.' })
		console.log(e);
	})

});




// Löschen von Immobilien
immoRouter.post('/delete', (req, res) => {

	dbFunctions.deleteImmo(req.body.id)
	.then(res.redirect('/immobilien/'))
	.catch((e) => {
		console.error(e);
		res.render('error', {
			text: 'Löschen einer Immobilie schlug fehl.'
		});
	});

});

module.exports = immoRouter;
