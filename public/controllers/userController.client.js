'use strict';

(function () {

  const displayName = document.querySelector('#display-name');
  const apiUrl = appUrl + '/api/current-user';

  function updateHtmlElement (data, element, userProperty) {
    element.innerHTML = ' ' + data[userProperty];
  }

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
    if (!data) {
     return;
    }

    let userObject = JSON.parse(data);

    if (userObject.displayName !== null) {
      updateHtmlElement(userObject, displayName, 'displayName');
    } else {
      updateHtmlElement(userObject, displayName, 'username');
    }
  }));
})();
