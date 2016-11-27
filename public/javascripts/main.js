$(document).ready(function(){
	// Add in all the problem elements
	for(var i = 0; i < problems.length; i++){
		addProblem(problems[i]);
	}
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
	var codeMirrorTest = newDiv(['codemirror-btn', 'codemirror-test-btn']);
	codeMirrorSubmit.text('Submit');
	codeMirrorTest.text('Test code');
	codeMirrorMenuBar.append(codeMirrorSubmit);
	codeMirrorMenuBar.append(codeMirrorTest);

	problemDiff.text(problemInfo.difficulty);
	title.text(problemInfo.title);
	record.text(problemInfo.highscores[0].score + "ms");
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
	});

	codeMirrorSubmit.click(function(){
		var solution = myCodeMirror.getValue();
		submitSolution(solution);
	});

	exitButton.click(function(){
		problem.replaceWith(addProblem(problemInfo, true));	
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

	writeToConsole("console texti");
	writeToConsole("fuck niggers");

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

		hsTable.prepend(row);
	}
	return hsTable;
}

function submitSolution(solution){
	var query = {solution};
	$.post('/submit', query, function(resp) {
		console.log('Solution submitted');
		console.log(resp);
		handleResponse(resp);
  	});
}

function handleResponse(response){

}

// Temporary database.
var description = 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies! This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
var problems = [
	{
		difficulty: 'Easy',
		title: 'The traveling salesman',
		highscores: [{rank: 1, name: 'Arnold', score: 43}, {rank: 1, name: 'Sly', score: 42}, {rank: 1, name: 'Bono', score: 44}, {rank: 1, name: 'Arnold', score: 43}, {rank: 1, name: 'Sly', score: 42}, {rank: 1, name: 'Bono', score: 44}, {rank: 1, name: 'Arnold', score: 43}, {rank: 1, name: 'Sly', score: 42}, {rank: 1, name: 'Bono', score: 44}],
		description: description
	},
	{
		difficulty: 'Easy',
		title: 'Snow white and the huntsman',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Easy',
		title: 'Trouble in paradise',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Easy',
		title: 'One million grasshoppers',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Easy',
		title: 'Romeo is looking for a lover',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Medium',
		title: 'Trees in a graveyard',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Medium',
		title: 'Banking gone wrong',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Medium',
		title: 'Cowboys and wizards',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Medium',
		title: 'Which soup is the coldest?',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Medium',
		title: 'Love and racketball',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Hard',
		title: 'Prince of Russia',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Hard',
		title: 'Three golden coins and a goat',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Hard',
		title: 'Day at the zoo',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Hard',
		title: 'Counting raindrops',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	},
	{
		difficulty: 'Hard',
		title: 'Circus of death',
		highscores: [{rank: 1, name: 'Arnold', score: 43}],
		description: description
	}
]