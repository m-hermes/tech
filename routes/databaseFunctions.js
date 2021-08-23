'use strict';
const dbClient = require('../config/database');


function getSimpleDate(pgDate) {
  const [month, day, year]
		= [pgDate.getMonth(), pgDate.getDate(), pgDate.getFullYear()];
	return (day + '.' + month + '.' + year);
}

async function deleteImmo(id) {

	try {
		let intId = parseInt(id);

		await dbClient.query('begin');
		const deleteImmoText = 'delete from immobilien.immobilie ' +
			'where id = $1';
		await dbClient.query(deleteImmoText, [intId]);
		await dbClient.query('commit');
	} catch (e) {
		await dbClient.query('rollback');
		throw e;
	}

}


// Funktion, die alle Informationen zu einer Immobilie
// anhand der ID der Immobilie zurückgibt.
async function getImmoDetails(id) {

  // Initialisierung des Ergebnisobjekts
  let pageData = {
    immoAdress: {},
    eigentuemer: {},
    eigentuemerAdresse: {},
    immoDetails: {}
  };

  try {

    await dbClient.query('begin');

    let intId = parseInt(id);

    const immoAdressQueryText =
      'select a.id, a.strasse, a.hausnr, a.plz, a.stadt ' +
      'from immobilien.immobilie i ' +
      'join immobilien.adresse a on i.adress_id = a.id ' +
      'where i.id = $1;';

    let queryResult = await dbClient.query(immoAdressQueryText, [intId]);
    pageData.immoAdress = queryResult.rows[0];

    const immoEigentuemerQueryText =
      'select p.vorname, p.nachname, p.geb_datum, p.geb_ort ' +
      'from immobilien.person p ' +
      'join immobilien.immobilie i on i.eigentuemer_id = p.id ' +
      'where i.id = $1';

    queryResult = await dbClient.query(immoEigentuemerQueryText, [intId]);
    pageData.eigentuemer = queryResult.rows[0];

    // Umformen des Datums:
		pageData.eigentuemer.geb_datum
			= getSimpleDate(pageData.eigentuemer.geb_datum);

    const eigentuemerAdressQueryText =
      'select a.id, a.strasse, a.hausnr, a.plz, a.stadt ' +
      'from immobilien.immobilie i ' +
      'join immobilien.person p on i.eigentuemer_id = p.id ' +
      'join immobilien.adresse a on p.wohnsitz_id = a.id ' +
      'where i.id = $1;';

    queryResult = await dbClient.query(eigentuemerAdressQueryText, [intId]);
    pageData.eigentuemerAdresse = queryResult.rows[0];

		const immoDetailsQueryText =
			'select wohnungsanzahl ' +
			'from immobilien.immobilie ' +
			'where id = $1;';

		queryResult = await dbClient.query(immoDetailsQueryText, [intId]);
		pageData.immoDetails = queryResult.rows[0];

    await dbClient.query('commit');

    return await pageData;

  } catch (e) {

    await dbClient.query('rollback');
    throw e;

  }

}


// Funktion, die alle Informationen zu einer Immobilie
// anhand der ID der Immobilie zurückgibt.
async function getAllAdresses() {

  // Initialisierung des Ergebnisobjekts
  let pageData = {};

  try {

    await dbClient.query('begin');

    const adressQueryText =
      'select a.id, a.strasse, a.hausnr, a.plz, a.stadt ' +
      'from immobilien.adresse a;';

    let queryResult = await dbClient.query(adressQueryText);
    pageData = queryResult.rows;

    await dbClient.query('commit');

		console.log(pageData);

    return await pageData;

  } catch (e) {

    await dbClient.query('rollback');
    throw e;

  }

}


// Funktion, die alle Informationen zu einer Immobilie
// anhand der ID der Immobilie zurückgibt.
async function getAllPersons() {

  // Initialisierung des Ergebnisobjekts
  let pageData = {};

  try {

    await dbClient.query('begin');

    const personQueryText =
      'select p.vorname, p.nachname, p.geb_datum, p.geb_ort, ' +
			'a.strasse, a.hausnr, a.plz, a.stadt ' +
			'from immobilien.person p ' +
      'join immobilien.adresse a on p.wohnsitz_id = a.id';

    let queryResult = await dbClient.query(personQueryText);
    pageData = queryResult.rows;
		for (let person of pageData){
			person.geb_datum = getSimpleDate(person.geb_datum);
		}

    await dbClient.query('commit');

    return await pageData;

  } catch (e) {

    await dbClient.query('rollback');
    throw e;

  }

}


module.exports = {
	getSimpleDate,
	deleteImmo,
	getImmoDetails,
	getAllAdresses,
	getAllPersons
}
