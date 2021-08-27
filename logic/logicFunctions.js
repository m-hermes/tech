const dbClient = require('../config/database');

let globalCounter = 0;

function increaseCounter() {
  return new Promise(
    (resolve, reject) => {
      resolve(++globalCounter);
    }
  )
}

function getCounter() {
  return globalCounter;
}

async function updateAdressTable(newAdress) {

  try {
    await dbClient.query('begin');

    const insertQText =
      'insert into public.ip_adresses ' +
      '(adress) values ($1);';
    const insertQValue = [newAdress];

    await dbClient.query(insertQText, insertQValue);

    const selectQText =
      'select adress from public.ip_adresses ' +
      'order by id desc ' +
      'limit 10';

    const newList = dbClient.query({text: selectQText, rowMode: 'array'});

    await dbClient.query('COMMIT');

    return await newList;
  }
	catch (e) {
    await dbClient.query('ROLLBACK');
  }

}

function anonymizeIp(ip) {
  if (ip.length < 4) {
    return '???';
  } else {
		let newIp = ip.slice(0, ip.length-3) + '???';
		return newIp;
  }
}

module.exports = {
  increaseCounter,
  getCounter,
  updateAdressTable,
	anonymizeIp
}
