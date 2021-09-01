'use strict';

let localCounter = 0;

document.addEventListener('DOMContentLoaded', () => {

  // Time button and display
  let timeResult = document.getElementById('timeResult');

  document.getElementById('timeButton')
    .addEventListener(
      'click',
      () => {
        let date = new Date(); // for now
        timeResult.value = date.toLocaleTimeString();
      },
      false
    );


  // Local counter and display
  let localCounterResult = document.getElementById('localCounterResult');

  document.getElementById('localCounterButton').addEventListener(
    'click',
    () => {
      localCounterResult.value = ++localCounter;
    },
    false
  );


  // Setup of websocket
  // required for global counter and ip adress list
  // basis found on https://fjolt.com/article/javascript-websockets
  const socketUrl = location.origin.replace(/^http/, 'ws') + '/ws/';
  let socket = new WebSocket(socketUrl);


  // Global counter and adressTable elements:
  let globalCounterResult = document.getElementById('globalCounterResult');
  let adressTable = document.getElementById('adressTable');


  // Sending "Hello" to the server to include
  // client's ip adress.
  socket.addEventListener(
    'open',
    () => socket.send('hello'),
    false
  );


  // Setting up the logic to deal with messages from the
  // server for global counter and ip adress change
  socket.addEventListener(
    'message',
    (msg) => {

      let msgData = JSON.parse(msg.data);

      // Dealing with the global counter
      if (msgData.hasOwnProperty('globalCounter')) {
        globalCounterResult.value = msgData.globalCounter;
      }

      // Dealing with the adresses
      if (msgData.hasOwnProperty('ipAdresses')) {
        // Clearing table at start:
        adressTable.innerHTML = '';

        // building table with current data
        msgData.ipAdresses.forEach((ipAdress) => {
          let row = adressTable.insertRow();
          let td = document.createElement('td');
          let content = document.createTextNode(ipAdress);
          td.appendChild(content);
          row.appendChild(td);
        });
      }
    },
    false
  )

  // Sending request for increase in global counter
  document.getElementById('globalCounterButton')
    .addEventListener(
      'click',
      () => socket.send('increaseGlobalCounter'),
      false
    );

  // Webworker to keep the websocket connection from timing out.
  const worker = new Worker('worker.js');
	worker.onmessage = (e) => {
		if (e.data === 'pingServer') {
			socket.send('ping');
		}
	}


});
