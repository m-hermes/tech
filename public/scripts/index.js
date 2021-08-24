'use strict';

function getCurrentTime() {

}

let localCounter = 0;

document.addEventListener('DOMContentLoaded', () => {

  // Aufbau von Action-Button Obchildekten, auf die später EventListener
  // appliziert werden können.

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

});
