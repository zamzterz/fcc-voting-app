'use strict';

(function () {

  const pollChart = document.getElementById('pollChart');
  const answerOptions = document.getElementById('answers');
  const questionHeader = document.getElementById('question');
  const voteBtn = document.getElementById('voteBtn');
  const newAnswerBtn = document.getElementById('newAnswerBtn');

  const apiUrl = appUrl + '/api/polls/' + window.location.href.split('/').pop();

  function updatePoll (data) {
    if (!data) {
      return;
    }
    let pollData = JSON.parse(data);

    questionHeader.textContent = pollData.question;

    answerOptions.innerHTML = '';
    for (let i = 0; i < pollData.answers.length; ++i) {
      let answerOption = document.createElement('option');
      answerOption.value = pollData.answers[i]._id;
      answerOption.textContent = pollData.answers[i].answer;
      answerOptions.appendChild(answerOption);
    }

    let numberOfAnswers = pollData.answers
                            .map((ans) => {return ans.frequency})
                            .reduce((a, b) => {return a + b});
    if (numberOfAnswers === 0) {
      pollData.answers = [{answer: 'No data', frequency: 1e-10}];
    }

    let myChart = new Chart(pollChart, {
      type: 'pie',
      data: {
        labels: pollData.answers.map((ans) => {return ans.answer}),
        datasets: [{
          backgroundColor: palette('tol-dv', pollData.answers.length).map((hex) => {return '#' + hex}),
          data: pollData.answers.map((ans) => {return ans.frequency})
        }]
      },
      options: {
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              if (!pollData.answers[tooltipItem.index].creator) {
                return '';
              }

              return 'by ' + pollData.answers[tooltipItem.index].creator.github.displayName;
            },
            title: function(tooltipItem, data) {
              let i = tooltipItem[0].index;

              if (pollData.answers[i].frequency < 1 && pollData.answers[i].frequency !== 0) {
                return 'No data';
              }

              return pollData.answers[i].answer + ': ' + pollData.answers[i].frequency;
            }
          }
        },
      }
    });
 }

 voteBtn.onclick = (e) => {
   $.ajax({
     type: 'POST',
     url: document.location.href,
     data: $('#vote').serialize(),
     success: (resp) => {
       ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePoll));
     },
   });
 }


 if (newAnswerBtn) {
   newAnswerBtn.onclick = (e) => {
     $.ajax({
       type: 'POST',
       url: document.location.href,
       data: $('#createNewAnswer').serialize(),
       success: (resp) => {
         ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePoll));
       },
     });
   }
 }

 ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePoll));
})();
