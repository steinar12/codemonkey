$(document).ready(function(){
	// Add in all the problem elements
	for(var i = 0; i < problems.length; i++){
		addProblem(problems[i]);
	}
});

// Creates and returns a problem html element based on the problemInfo parameter.
// problemInfo: {difficulty: 'Easy', title: 'Red riding hood', record: '43ms'};
function addProblem(problemInfo){

	var problem = newDiv(['problem']);

	var problemSimple = newDiv(['problem-simple']);
	var problemExtension = newDiv(['problem-extension']);
	var problemDescription = newDiv(['problem-description']);
	var description = newDiv(['description']);
	var solveButton = newDiv(['solve-button']);
	solveButton.text('Solve');

	var problemDiff = newDiv(['problem-difficulty', problemInfo.difficulty.toLowerCase()]);
	var problemTitle = newDiv(['problem-title']);
	var problemRecord = newDiv(['problem-record']);
	var title = newDiv(['title']);

	var codeMirrorWrapper = newDiv(['codemirror-wrapper']);

	problemDiff.text(problemInfo.difficulty);
	title.text(problemInfo.title);
	problemRecord.text(problemInfo.record);

	problemSimple.append(problemDiff);
	problemTitle.append(title);
	problemSimple.append(problemTitle);
	problemSimple.append(problemRecord);
	description.text(problemInfo.description);

	problem.attr('selectedProblem', 'false');

	problemSimple.click(function(){
		var selected = problem.attr('selectedProblem');
		var duration = 300;

		if(selected == 'false'){
			problem.attr('selectedProblem', 'true');
			problem.animate({opacity: '1'},duration);
			problemExtension.animate({height: '55vh'},duration);
			problemRecord.animate({marginTop: '12vh', height: '55vh', width: '25vw'},duration);
			description.animate({marginTop: '2vh', opacity: '1'}, duration);
		} else {
			problem.attr('selectedProblem', 'false');
			problem.animate({opacity: '0.7'},duration);
			problemExtension.animate({height: '0vh'},duration);
			problemRecord.animate({marginTop: '0vh', height: '12vh', width: '15%'},duration);
			description.animate({marginTop: '-5vh', opacity: '0'}, duration);
		}
	});

	solveButton.click(function(){
		var scrollTop = $(document).scrollTop();
		var distFromTop = problem.offset().top;
		var fixedPos = distFromTop - scrollTop;
		var fixedPosString = fixedPos.toString() + "px";

		problem.toggleClass('problem-fixed');
		problem.css('top', fixedPosString);
		problem.animate({width: '100vw', height: '100vh', top: '0px', left: '0px'}, 300);
		problemExtension.animate({height: '88vh', backgroundColor: 'rgb(40,40,40)'});

		var myCodeMirror = CodeMirror(function(elt) {
			codeMirrorWrapper.append(elt);
  			problemDescription.hide();
  			problemExtension.append(codeMirrorWrapper);
		}, {mode:  "javascript", lineNumbers: true, theme: 'night'});

		problemRecord.animate({height: '88vh', opacity: '0.3'});
		solveButton.hide();
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
	problemExtension.append(problemDescription);
	problemExtension.append(solveButton);
	problem.append(problemSimple);
	problem.append(problemExtension);
	$('.problem-container').append(problem);
}

// Created and returns a highscore table element based on the highscoreInfo parameter.
// highscoreInfo: [ {name: 'tom', score: '43'}, {...}, ... ];
/*function addHighscoreTable(highscoreInfo){

	// The wrapper
	var wrapper = newDiv(['hst-wrapper']);

	// Create 10 lines in the table
	for(var i = 0; i < 10; i++){

		//var number = 
		//var placement = newDiv().text(i+1;
		var name = newDiv().text(highscoreInfo.name);
		var score = newDiv().text(highscoreInfo.time);

		var line = newDiv(['hs-line']);

		line.append()

	}
}*/

// Returns a new jquery div element with all the classes in classList.
function newDiv(classList){
	var div = $('<div></div>');

	for(var i = 0; i < classList.length; i++){
		div.addClass(classList[i]);
	}

	return div;
}

// Temporary database.
var problems = [
	{
		difficulty: 'Easy',
		title: 'The traveling salesman',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Easy',
		title: 'Snow white and the huntsman',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Easy',
		title: 'Trouble in paradise',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Easy',
		title: 'One million grasshoppers',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Easy',
		title: 'Romeo is looking for a lover',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Medium',
		title: 'Trees in a graveyard',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Medium',
		title: 'Banking gone wrong',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Medium',
		title: 'Cowboys and wizards',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Medium',
		title: 'Which soup is the coldest?',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Medium',
		title: 'Love and racketball',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Hard',
		title: 'Prince of Russia',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Hard',
		title: 'Three golden coins and a goat',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Hard',
		title: 'Day at the zoo',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Hard',
		title: 'Counting raindrops',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	},
	{
		difficulty: 'Hard',
		title: 'Circus of death',
		record: '43ms',
		description: 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
	}
]