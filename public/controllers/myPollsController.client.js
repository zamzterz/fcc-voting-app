'use strict';

(function () {

  let pollListNode = document.querySelector('#polls > ul');
  let apiUrl = appUrl + '/api/my-polls';

  function updatePollList (data) {
    if (!data) {
      return;
    }
    pollListNode.innerHTML = '';

    let polls = JSON.parse(data);
    for (let i = 0; i < polls.length; ++i) {
      let pollLink = document.createElement('a');
      pollLink.href = '/polls/' + polls[i]._id;
      pollLink.textContent = polls[i].question + ' by ' + polls[i].creator.github.displayName;

      let deleteBtn = document.createElement('button');
      deleteBtn.onclick = (e) => {
        ajaxFunctions.ajaxRequest('DELETE', appUrl + '/api/polls/' + polls[i]._id, ()=>{});
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePollList));
      }

      deleteBtn.textContent = 'x';
      deleteBtn.className = 'btn btn-delete';

      let numberOfVotes = polls[i].answers
                                .map((ans) => {return ans.frequency})
                                .reduce((a, b) => {return a + b});
      let statsNode = document.createElement('span');
      statsNode.textContent = numberOfVotes + ' votes so far';

      let pollNode = document.createElement('li');
      pollNode.appendChild(pollLink);
      pollNode.appendChild(deleteBtn);
      pollNode.appendChild(statsNode);
      pollListNode.appendChild(pollNode);
    }
 }

 ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePollList));

})();
