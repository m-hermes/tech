'use strict';

let localCounter = 0;

document.addEventListener('DOMContentLoaded', () => {

  let timeButton = document.getElementById('timeButton');
  let timeResult = document.getElementById('timeResult');

  timeButton.addEventListener(
    'click',
    () => {
      let date = new Date(); // for now
      timeResult.value = date.toLocaleTimeString();
    },
    false
  );

  let localCounterButton = document.getElementById('localCounterButton');
  let localCounterResult = document.getElementById('localCounterResult');

  localCounterButton.addEventListener(
    'click',
    () => {
      localCounterResult.value = ++localCounter;
    },
    false
  );

  let globalCounterButton = document.getElementById('globalCounterButton');
  let globalCounterResult = document.getElementById('globalCounterResult');

  // Update global counter to current value upon page loading:
  fetch('/api/counter')
    .then(res => res.json())
    .then(data => globalCounterResult.value = data);

  globalCounterButton.addEventListener(
    'click',
    () => {
      fetch('/api/counter/increment')
        .then(res => res.json())
        .then(data => globalCounterResult.value = data)
    },
    false
  );

  // @connect
  // Connect to the websocket
  // found on https://fjolt.com/article/javascript-websockets

  let socket;

	const connect = function() {
    return new Promise((resolve, reject) => {
      const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
      const port = 5000;
      const socketUrl = `${socketProtocol}//${window.location.hostname}:${port}/ws/`

      // Define socket
      socket = new WebSocket(socketUrl);

      socket.onopen = (e) => {
        // Send a little test data, which we can use on the server if we want
        socket.send(JSON.stringify({
          "loaded": true
        }));
        // Resolve the promise - we are connected
        resolve();
      }

      socket.onmessage = (msg) => {
        console.log('Websocket message received');
        console.log(JSON.parse(msg.data));
        // Any data from the server can be manipulated here.
        /*
        let parsedData = JSON.parse(data.data);
        if (parsedData.append === true) {
          const newEl = document.createElement('p');
          newEl.textContent = parsedData.returnText;
          document.getElementById('websocket-returns').appendChild(newEl);
        }
				*/
      }

      socket.onerror = (e) => {
        // Return an error if any occurs
        console.log(e);
        resolve();
        // Try to connect again
        connect();
      }
    });
  }

  // @isOpen
  // check if a websocket is open
  const isOpen = function(ws) {
    return ws.readyState === ws.OPEN
  }

  connect();

  // And add our event listeners
  document.getElementById('websocket-button')
    .addEventListener(
      'click',
      function(e) {
        if (isOpen(socket)) {
          socket.send(JSON.stringify({
            "data": "this is our data to send",
            "other": "this can be in any format"
          }))
        }
      });

});
