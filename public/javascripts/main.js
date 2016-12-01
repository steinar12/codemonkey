$(document).ready(function(){
	// Add in all the problem elements
	loadProblems();	
});

// Creates and returns a problem html element based on the problemInfo parameter.
// problemInfo: {difficulty: 'Easy', title: 'Red riding hood', highscores: [{rank: 1, name: bjarni, score: 43},...]};
function addProblem(problemInfo, replace){

	var problem = newDiv(['problem']);

	var problemSimple = newDiv(['problem-simple']);
	var problemExtension = newDiv(['problem-extension']);
	var problemDescription = newDiv(['problem-description']);
	var description = newDiv(['description']);
	var exitButton = newImg(['exit-button'], "http://totravelistolearn.in/wp-content/themes/travel/images/cross-512.png");
	var solveButton = newDiv(['solve-button']);
	solveButton.text('Solve');
	exitButton.hide();

	var problemDiff = newDiv(['problem-difficulty', problemInfo.difficulty.toLowerCase()]);
	var problemTitle = newDiv(['problem-title']);
	var problemRecord = newDiv(['problem-record']);
	var record = newDiv(['record']);
	var title = newDiv(['title']);

	var hsTable = generateHSTable(problemInfo.highscores);
	hsTable.hide();

	var myConsole = newDiv(['console']);
	myConsole.hide();

	var myCodeMirror;
	var codeMirrorWrapper = newDiv(['codemirror-wrapper']);
	var codeMirrorMenuBar = newDiv(['codemirror-menubar']);
	var codeMirrorSubmit = newDiv(['codemirror-btn', 'codemirror-submit-btn']);
	codeMirrorSubmit.text('Run');
	codeMirrorMenuBar.append(codeMirrorSubmit);

	problemDiff.text(problemInfo.difficulty);
	title.text(problemInfo.title);
	
	if(problemInfo.highscores[0]) record.text(problemInfo.highscores[0].score + " pts");
	else record.text("Unsolved");
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

	problemSimple.click(function(){
		if(problem.attr('editorMode') == 'true') return;

		var selected = problem.attr('selectedProblem');
		var duration = 400;

		if(selected == 'false'){
			problem.attr('selectedProblem', 'true');
			problem.animate({opacity: '1'}, duration);
			problemExtension.animate({height: '45vh'}, duration);
			problemRecord.animate({marginTop: '12vh', height: '45vh', width: '40%'}, duration);
			description.animate({marginTop: '3%', opacity: '1'}, duration);

			record.fadeOut(duration/2);
			setTimeout(function(){hsTable.fadeIn(duration/2);}, duration/2);

		} else {
			problem.attr('selectedProblem', 'false');
			problem.animate({opacity: '0.7'},duration);
			problemExtension.animate({height: '0vh'},duration);
			problemRecord.animate({marginTop: '0vh', height: '12vh', width: '15%'},duration);
			problemTitle.animate({width: '70%'},duration);
			description.animate({marginTop: '-5vh', opacity: '0'}, duration);

			hsTable.fadeOut(duration/2);
			setTimeout(function(){record.fadeIn(duration/2);}, duration/2);
		}
	});

	solveButton.click(function(){
		var duration = 600;
		var scrollTop = $(document).scrollTop();
		var distFromTop = problem.offset().top;
		var fixedPos = distFromTop - scrollTop;
		var fixedPosString = fixedPos.toString() + "px";

		problem.toggleClass('problem-fixed');
		problem.attr('editorMode', 'true');
		problem.css('top', fixedPosString);
		problem.animate({width: '100%', height: '100vh', top: '0px', left: '0px'}, duration*1.4);
		problemExtension.css('backgroundColor', '40,40,45');
		problemExtension.animate({height: '88%'});
		problemDescription.animate({width: '25%', backgroundColor: 'rgb(40,40,40)'}, duration);
		problemTitle.animate({width: '60%'}, duration);
		problemRecord.animate({height: '88vh', width: '25%', backgroundColor: 'rgb(40,40,40)'}, duration);

		hsTable.fadeOut(duration/2);
		setTimeout(function(){myConsole.fadeIn(duration/2);}, duration/2);


		description.animate({color: 'rgb(130,130,163)'}, duration);
		setTimeout(function(){exitButton.fadeIn();}, duration+100);

		myCodeMirror = CodeMirror(function(elt) {
			codeMirrorWrapper.append(elt);
			codeMirrorWrapper.append(codeMirrorMenuBar);
			codeMirrorWrapper.animate({width: '50%'}, duration);
		}, {mode:  "javascript", lineNumbers: true, theme: 'dracula'});

		solveButton.hide();

		$('body').css('overflow', 'hidden');
	});

	codeMirrorSubmit.click(function(){
		if(waitingForResponse) return;
		var solution = myCodeMirror.getValue();
		console.log("Submit button clicked!");
		runSolution(solution, problem, problemInfo, writeToConsole);
	});

	exitButton.click(function(){
		problem.replaceWith(addProblem(problemInfo, true));	
		$('body').css('overflow', 'auto');
	});

	problem.hover(function(){
		var problem = $(this);
		if(problem.attr('selectedProblem') == 'true') return;
		problem.css('opacity', '0.85');
		}, function(){
		var problem = $(this);
		if(problem.attr('selectedProblem') == 'true') return;
		problem.css('opacity', '0.7');
	});

	problemDescription.append(description);
	problemDescription.append(solveButton);
	problemExtension.append(problemDescription);
	problemExtension.append(codeMirrorWrapper);
	problem.append(problemSimple);
	problem.append(problemExtension);
	problem.append(exitButton);

	function writeToConsole(text){
		var consoleLine = newDiv(['console-line']);
		consoleLine.text(text);
		myConsole.append(consoleLine);
	}

	if(replace) return problem.hide().fadeIn(1200);
	else $('.problem-container').append(problem);
}

// Returns a new jquery div element with all the classes in classList.
function newDiv(classList){
	var div = $('<div></div>');

	for(var i = 0; i < classList.length; i++){
		div.addClass(classList[i]);
	}

	return div;
}

// Returns a new jquery img element with all the classes in classList.
function newImg(classList, src){
	var img = $('<img></img>');
	img.attr('src', src);

	for(var i = 0; i < classList.length; i++){
		img.addClass(classList[i]);
	}

	return img;
}

// Returns a new jquery input element with all the classes in classList.
function newInput(classList, placeholder){
	var input = $('<input></input>');
	input.attr('placeholder', placeholder);
	input.attr('maxlength', '12');

	for(var i = 0; i < classList.length; i++){
		input.addClass(classList[i]);
	}

	return input;
}

// Generates a new highscore table. (jquery elements)
function generateHSTable(highscores){

	var hsTable = newDiv(['highscore-table']);

	for(var i = 0; i < highscores.length; i++){

		var row = newDiv(['highscore-row']);
		var name = newDiv(['highscore-text']);
		var score = newDiv(['highscore-text', 'highscore-score']);
		var rank = newDiv(['highscore-text']);

		rank.text(highscores[i].rank + ".");
		name.text(highscores[i].name);
		score.text(highscores[i].score + "");

		row.append(rank);
		row.append(name);
		row.append(score);

		hsTable.append(row);
	}
	return hsTable;
}

// Asks the server to run the code that is currently in the editor
function runSolution(solution, problem, problemInfo, writeToConsole){
	waitingForResponse = true;
	var query = {solution: solution, title: problemInfo.title};
	$.post('/submit', query, function(resp) {
		handleResponse(resp, problem, problemInfo, writeToConsole);
  	});
}

// Tells the server that you want to submit your score, with the name Playername.
function submitScore(playerName, problemInfo){
	var query = {name: playerName, problem: problemInfo.title};
	console.log(query);
	$.post('/submitScore', query, function(resp) {
		console.log('Score submitted');
		console.log(resp);
  	});
}

// Handles different kinds of responses from the server. The responses are
// sent to the client whenever the client submits code to the server.
function handleResponse(response, problem, problemInfo, writeToConsole){

	waitingForResponse = false;

	// Ef að svarið er rétt, þá birtum við scorið
	if(response.type === "Rank") {
		writeToConsole("Correct!");
		addCorrectAnswerPopup(problem, problemInfo, response);
	}

	// Byrjum á að skrifa skilaboðin í console
	var consoleMessage = response.message;
	writeToConsole(consoleMessage);
}

// Temporary solution to a bug fix
var waitingForResponse = false;

// Creates a new CorrectAnswerPopup. (the one that pops up when you submit a correct solution)
function addCorrectAnswerPopup(problem, problemInfo, response){
	var popupWrapper = newDiv(['popup-wrapper']);
	var popupBackground = newDiv(['popup-background']);
	var popup = newDiv(['popup']);
	var popupTitle = newDiv(['popup-title']);
	popupTitle.text('Correct!');
	var popupScore = newDiv(['popup-text']);
	popupScore.text("Your score:        " + response.score);
	var popupRank = newDiv(['popup-text']);
	popupRank.text(response.message);
	var popupSubmitText = newDiv(['popup-text']);
	popupSubmitText.text("Type in your name and submit your score!");
	var popupInput = newInput(['popup-input'], 'Your name');
	var popupSubmitButton = newDiv(['popup-submit-button']);
	popupSubmitButton.text('Submit');
	var popupExitButton = newImg(['popup-exit-button'], "http://totravelistolearn.in/wp-content/themes/travel/images/cross-512.png");

	popupSubmitButton.click(function(){
		console.log('popupInput: ');
		console.log(popupInput[0].value);
		console.log(problemInfo);
		submitScore(popupInput[0].value, problemInfo);
		problem.replaceWith(addProblem(problemInfo, true));	
		$('body').css('overflow', 'auto');
	});

	popupExitButton.click(function(){
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

// Load all the problems from the server
function loadProblems(){
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/loadProblems',
    'success': function(response) {
    	console.log(response);
        insertProblems(response);
    }
  });
}

// inserts all the problems into the DOM
function insertProblems(problems){
	for(var i = 0; i < problems.length; i++){
		addProblem(problems[i]);
	}
}

