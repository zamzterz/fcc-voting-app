'use strict';

(function () {

  function addAnswer () {
    let answersDiv = document.getElementById('answers');
    let answerInput = document.createElement('input');
    answerInput.name = 'answer';
    answerInput.type = 'text';
    answersDiv.insertBefore(answerInput, document.getElementById('add'));
 }

 document.getElementById('add').onclick = addAnswer;
})();
