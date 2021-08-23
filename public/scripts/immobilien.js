'use strict';

// Bestimmung der Aktionsknöpfe aus dem DOM
function getActionButtons(tableBody) {

  // Initialisierung
  let actionButtons = {
    show: [],
    delete: []
  };

  for (let row = 0; row < tableBody.children.length; row++) {

    // Letzte Spalte ist die, die die Action Buttons enthält:
    let actionCell = tableBody.children[row].lastElementChild;

    // Iteration über die Buttons innerhalb der Spalte
    for (let child = 0; child < actionCell.children.length; child++) {

      if (actionCell.children[child].dataset.actionType == "delete") {
        actionButtons.delete.push({
          id: actionCell.children[child].dataset.immoId,
          button: actionCell.children[child]
        });
      } else if (actionCell.children[child].dataset.actionType == "show") {
        actionButtons.show.push({
          id: actionCell.children[child].dataset.immoId,
          button: actionCell.children[child]
        });
      }
    }
  }

  return actionButtons;
}


// Erstellt Warnhinweis, ob die Immobilie mit der gegebenen Id gelöscht
// werden soll.
function confirmDeletion(immoId) {
  if (window.confirm(`Sicher, dass Immobilie mit der ID ${immoId} gelöscht werden soll?`)){
		jsRequest('/immobilien/delete', {id: immoId});
	}
}

// Gefunden auf
// "https://stackoverflow.com/questions/133925/javascript-post-request-like-a-form-submit"
/**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the parameters to add to the url
 * @param {string} [method=post] the method to use on the form
 */

function jsRequest(path, params, method='post') {

  // The rest of this code assumes you are not using a library.
  // It can be made less verbose if you use one.
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

document.addEventListener('DOMContentLoaded', () => {

  // Aufbau von Action-Button Obchildekten, auf die später EventListener
  // appliziert werden können.

  let estateTable = document.getElementById('estateTable');
  let actionButtons = getActionButtons(estateTable);

  actionButtons.delete.forEach(deleteButton => {
  	deleteButton.button.addEventListener(
  		'click',
			// Hier eine anonyme Funktion, da Übergaben von Parametern
			// als EventListener nicht möglich sind.
			() => confirmDeletion(deleteButton.id),
  		false
  	);
  });

	actionButtons.show.forEach(showButton => {
		showButton.button.addEventListener(
			'click',
			() => jsRequest('/immobilien/details', {id: showButton.id}, 'get'),
			false
		);
	});

});
