'use strict';

(function () {

  let pollListNode = document.querySelector('#polls > ul');
  let apiUrl = appUrl + '/api/polls';

  function updatePollList (data) {
    if (!data) {
      return;
    }

    let polls = JSON.parse(data);
    for (let i = 0; i < polls.length; ++i) {
      let pollLink = document.createElement('a');
      pollLink.href = '/polls/' + polls[i]._id;
      pollLink.textContent = polls[i].question + ' by ' + polls[i].creator.github.displayName;

      let pollNode = document.createElement('li');
      pollNode.appendChild(pollLink);
      pollListNode.appendChild(pollNode);
    }
 }

 ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePollList));

})();
