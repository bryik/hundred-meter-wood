/* Handles voice control.
 * Code is heavily based on the color change example from MDN
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
 */
window.onload = function () {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

  var grammar = '#JSGF V1.0; grammar colors; public <command> = ground | sky | random | disk | reset ;'
  var recognition = new SpeechRecognition();
  // Setting continuous to true prevents recognition from ending
  recognition.continuous = 'true';
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;

  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  console.log('Ready to receive command.');

  /* Result are added to an array.
   * Get the last result, trim whitespace (" sky" -> "sky"),
   * and send to event switchboard (in main.js) through the window.
   */
  recognition.onresult = function(event) {
    var lastElementIndex = event.results.length - 1;
    var command = event.results[lastElementIndex][0].transcript.trim();
    console.log('Result: ' + command);
    console.log('Confidence: ' + event.results[0][0].confidence);

    window.click(command)
  };

  recognition.onerror = function (event) {
    console.log('Error occurred in recognition: ' + event.error);
  };
};
