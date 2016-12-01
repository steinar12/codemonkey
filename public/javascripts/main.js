// Load all the problems from the server
function loadProblems() {
  const query = '';
  $.post('/loadProblems', query, (resp) => {
    insertProblems(resp);
  });
}

$(document).ready(() => {
  // Add in all the problem elements
  loadProblems();
});


// Returns a new jquery div element with all the classes in classList.
function newDiv(classList) {
  const div = $('<div></div>');

  for (let i = 0; i < classList.length; i++) {
    div.addClass(classList[i]);
  }

  return div;
}

// Returns a new jquery img element with all the classes in classList.
function newImg(classList, src) {
  const img = $('<img></img>');
  img.attr('src', src);

  for (let i = 0; i < classList.length; i++) {
    img.addClass(classList[i]);
  }

  return img;
}

// Returns a new jquery input element with all the classes in classList.
function newInput(classList, placeholder) {
  const input = $('<input></input>');
  input.attr('placeholder', placeholder);
  input.attr('maxlength', '6');

  for (let i = 0; i < classList.length; i++) {
    input.addClass(classList[i]);
  }

  return input;
}

// Returns a new spinner
function newSpinner(targetID){
  var opts = {
    lines: 13 // The number of lines to draw
    , length: 28 // The length of each line
    , width: 14 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 0.25 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#FFF' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'relative' // Element positioning
  }
  var target = document.getElementById(targetID);
  console.log(targetID);
  console.log(target);
  var spinner = new Spinner(opts).spin(target);
  return spinner;
}


// Creates and returns a problem html element based on the problemInfo parameter.
// problemInfo: {difficulty: 'Easy', title: 'Red riding hood', highscores: [{rank: 1, name: bjarni, score: 43},...]};
function addProblem(problemInfo, replace, id) {
  const problem = newDiv(['problem']);

  const placeholder = problemInfo.title.indexOf('Placeholder') !== -1;

  const problemSimple = newDiv(['problem-simple']);
  const problemExtension = newDiv(['problem-extension']);
  const problemDescription = newDiv(['problem-description']);
  const description = newDiv(['description']);
  const exitButton = newImg(['exit-button'],
    'http://totravelistolearn.in/wp-content/themes/travel/images/cross-512.png');
  const solveButton = newDiv(['solve-button']);
  solveButton.text('Solve');
  exitButton.hide();

  const problemDiff = newDiv(['problem-difficulty',
    problemInfo.difficulty.toLowerCase()]);
  const problemTitle = newDiv(['problem-title']);
  const problemRecord = newDiv(['problem-record']);
  const record = newDiv(['record']);
  const title = newDiv(['title']);

  const hsTable = generateHSTable(problemInfo.highscores);
  hsTable.hide();

  const myConsole = newDiv(['console']);
  myConsole.hide();

  let myCodeMirror;
  const codeMirrorWrapper = newDiv(['codemirror-wrapper']);
  const codeMirrorMenuBar = newDiv(['codemirror-menubar']);
  const codeMirrorSubmit = newDiv(['codemirror-btn',
    'codemirror-submit-btn']);
  codeMirrorSubmit.text('Run');
  codeMirrorSubmit.attr('id', 'submit' + id);
  codeMirrorMenuBar.append(codeMirrorSubmit);

  problemDiff.text(problemInfo.difficulty);
  title.text(problemInfo.title);

  if (problemInfo.highscores[0]) record.text(`${problemInfo.highscores[0].score} pts`);
  else record.text('Unsolved');
  problemRecord.append(record);
  problemRecord.append(hsTable);
  problemRecord.append(myConsole);

  problemSimple.append(problemDiff);
  problemTitle.append(title);
  problemSimple.append(problemTitle);
  problemSimple.append(problemRecord);
  description.text(problemInfo.description);

  problem.attr('selectedProblem', 'false');
  problem.attr('editorMode', 'false');

  problemSimple.click(() => {
    if (problem.attr('editorMode') == 'true') return;

    const selected = problem.attr('selectedProblem');
    const duration = 400;

    if (selected == 'false') {
      problem.attr('selectedProblem', 'true');
      problem.animate({
        opacity: '1',
      }, duration);
      problemExtension.animate({
        height: '45vh',
      }, duration);
      problemRecord.animate({
        marginTop: '12vh',
        height: '45vh',
        width: '40%',
      }, duration);
      description.animate({
        marginTop: '3%',
        opacity: '1',
      }, duration);

      record.fadeOut(duration / 2);
      setTimeout(() => {
        hsTable.fadeIn(duration / 2);
      }, duration / 2);
    } else {
      problem.attr('selectedProblem', 'false');
      problem.animate({
        opacity: '0.7',
      }, duration);
      problemExtension.animate({
        height: '0vh',
      }, duration);
      problemRecord.animate({
        marginTop: '0vh',
        height: '12vh',
        width: '15%',
      }, duration);
      problemTitle.animate({
        width: '70%',
      }, duration);
      description.animate({
        marginTop: '-5vh',
        opacity: '0',
      }, duration);

      hsTable.fadeOut(duration / 2);
      setTimeout(() => {
        record.fadeIn(duration / 2);
      }, duration / 2);
    }
  });

  solveButton.click(() => {
    const duration = 600;
    const scrollTop = $(document).scrollTop();
    const distFromTop = problem.offset().top;
    const fixedPos = distFromTop - scrollTop;
    const fixedPosString = `${fixedPos.toString()}px`;

    problem.toggleClass('problem-fixed');
    problem.attr('editorMode', 'true');
    problem.css('top', fixedPosString);
    problem.animate({
      width: '100%',
      height: '100vh',
      top: '0px',
      left: '0px',
    }, duration * 1.4);
    problemExtension.css('backgroundColor', '40,40,45');
    problemExtension.animate({
      height: '88%',
    });
    problemDescription.animate({
      width: '25%',
      backgroundColor: 'rgb(40,40,40)',
    }, duration);
    problemTitle.animate({
      width: '60%',
    }, duration);
    problemRecord.animate({
      height: '88vh',
      width: '25%',
      backgroundColor: 'rgb(40,40,40)',
    }, duration);

    hsTable.fadeOut(duration / 2);
    setTimeout(() => {
      myConsole.fadeIn(duration / 2);
    }, duration / 2);


    description.animate({
      color: 'rgb(130,130,163)',
    }, duration);
    setTimeout(() => {
      exitButton.fadeIn();
    }, duration + 100);

    myCodeMirror = CodeMirror((elt) => {
      codeMirrorWrapper.append(elt);
      codeMirrorWrapper.append(codeMirrorMenuBar);
      codeMirrorWrapper.animate({
        width: '50%',
      }, duration);
    }, {
      mode: 'javascript',
      lineNumbers: true,
      theme: 'dracula',
    });

    solveButton.hide();

    $('body').css('overflow', 'hidden');
  });

  codeMirrorSubmit.click(() => {
    if (waitingForResponse || placeholder) return;
    codeMirrorSubmit.text('');
    const spinner = newSpinner("submit" + id);
    const solution = myCodeMirror.getValue();
    runSolution(solution, problem, problemInfo, writeToConsole, spinner, codeMirrorSubmit);
  });

  exitButton.click(() => {
    problem.replaceWith(addProblem(problemInfo, true));
    $('body').css('overflow', 'auto');
  });

  problem.hover(function () {
    const problem = $(this);
    if (problem.attr('selectedProblem') == 'true') return;
    problem.css('opacity', '0.85');
  }, function () {
    const problem = $(this);
    if (problem.attr('selectedProblem') == 'true') return;
    problem.css('opacity', '0.7');
  });

  problemDescription.append(description);
  problemDescription.append(solveButton);
  problemExtension.append(problemDescription);
  problemExtension.append(codeMirrorWrapper);
  problem.append(problemSimple);
  problem.append(problemExtension);
  problem.append(exitButton);

  function writeToConsole(text) {
    const consoleLine = newDiv(['console-line']);
    consoleLine.text(text);
    myConsole.append(consoleLine);
  }

  if (replace) return problem.hide().fadeIn(1200);
  else $('.problem-container').append(problem);
}

// inserts all the problems into the DOM
function insertProblems(problems) {
  for (let i = 0; i < problems.length; i++) {
    addProblem(problems[i], false, i);
  }
}

// Generates a new highscore table. (jquery elements)
function generateHSTable(highscores) {
  const hsTable = newDiv(['highscore-table']);

  for (let i = 0; i < highscores.length; i++) {
    const row = newDiv(['highscore-row']);
    const name = newDiv(['highscore-text']);
    const score = newDiv(['highscore-text', 'highscore-score']);
    const rank = newDiv(['highscore-text']);

    rank.text(`${highscores[i].rank}.`);
    name.text(highscores[i].name);
    score.text(`${highscores[i].score}`);

    row.append(rank);
    row.append(name);
    row.append(score);

    hsTable.append(row);
  }
  return hsTable;
}

// Tells the server that you want to submit your score, with the name Playername.
function submitScore(playerName, problemInfo) {
  const query = {
    name: playerName,
    problem: problemInfo.title,
  };

  $.post('/submitScore', query, (resp) => {

  });
}

// Handles different kinds of responses from the server. The responses are
// sent to the client whenever the client submits code to the server.
function handleResponse(response, problem, problemInfo, writeToConsole) {
  waitingForResponse = false;

  // Ef að svarið er rétt, þá birtum við scorið
  if (response.type === 'Rank') {
    writeToConsole('Correct!');
    addCorrectAnswerPopup(problem, problemInfo, response);
  }

  // Byrjum á að skrifa skilaboðin í console
  const consoleMessage = response.message;
  writeToConsole(consoleMessage);
}

// Temporary solution to a bug fix
let waitingForResponse = false;

// Creates a new CorrectAnswerPopup. (the one that pops up when you submit a correct solution)
function addCorrectAnswerPopup(problem, problemInfo, response) {
  const popupWrapper = newDiv(['popup-wrapper']);
  const popupBackground = newDiv(['popup-background']);
  const popup = newDiv(['popup']);
  const popupTitle = newDiv(['popup-title']);
  popupTitle.text('Correct!');
  const popupScore = newDiv(['popup-text']);
  popupScore.text(`Your score:        ${response.score}`);
  const popupRank = newDiv(['popup-text']);
  popupRank.text(response.message);
  const popupSubmitText = newDiv(['popup-text']);
  popupSubmitText.text('Type in your name and submit your score!');
  const popupInput = newInput(['popup-input'], 'Your name');
  const popupSubmitButton = newDiv(['popup-submit-button']);
  popupSubmitButton.text('Submit');
  const popupExitButton = newImg(['popup-exit-button'],
    'http://totravelistolearn.in/wp-content/themes/travel/images/cross-512.png');

  popupSubmitButton.click(() => {
    submitScore(popupInput[0].value, problemInfo);
    problem.replaceWith(addProblem(problemInfo, true));
    $('body').css('overflow', 'auto');
  });

  popupExitButton.click(() => {
    popupWrapper.remove();
  });

  popup.append(popupTitle);
  popup.append(popupScore);
  popup.append(popupRank);
  popup.append(popupSubmitText);
  popup.append(popupInput);
  popup.append(popupSubmitButton);
  popup.append(popupExitButton);
  popupWrapper.append(popupBackground);
  popupWrapper.append(popup);
  problem.append(popupWrapper);
}

// Asks the server to run the code that is currently in the editor
function runSolution(solution, problem, problemInfo, writeToConsole, spinner, submitButton) {
  waitingForResponse = true;
  const query = {
    solution,
    title: problemInfo.title,
  };
  $.post('/submit', query, (resp) => {
    spinner.stop();
    submitButton.text("Run");
    handleResponse(resp, problem, problemInfo, writeToConsole);
  });
}

