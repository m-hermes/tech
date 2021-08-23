'use strict';

document.addEventListener('DOMContentLoaded', () => {

  let newAdressContainer = document.getElementById('newAdress');
  let adressSelect = document.getElementById('address_id');

  let newEigentuemerContainer = document.getElementById('newEigentuemer');
  let eigentuemerSelect = document.getElementById('eigentuemer_id');

  adressSelect.addEventListener('input', () => {
    if (adressSelect.value == -1){
      newAdressContainer.hidden = false;
    }
    else {
      newAdressContainer.hidden = true;
    }
  }, false);

  eigentuemerSelect.addEventListener('input', () => {
    if (eigentuemerSelect.value == -1){
      newEigentuemerContainer.hidden = false;
    }
    else {
      newEigentuemerContainer.hidden = true;
    }
  }, false);

});
