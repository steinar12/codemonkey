$(document).ready(function(){
	for(var i = 0; i < problems.length; i++){
		addProblem(problems[i]);
	}
});

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
		console.log(solveButton);

		if(selected == 'false'){
			problem.attr('selectedProblem', 'true');
			problem.animate({opacity: '1'},300);
			problemExtension.animate({height: '55vh'},300);
			problemRecord.animate({marginTop: '12vh', height: '55vh', width: '50%'},300);
			description.animate({marginTop: '2vh', opacity: '1'}, 300);
		} else {
			problem.attr('selectedProblem', 'false');
			problem.animate({opacity: '0.7'},300);
			problemExtension.animate({height: '0vh'},300);
			problemRecord.animate({marginTop: '0vh', height: '12vh', width: '15%'},300);
			description.animate({marginTop: '-5vh', opacity: '0'}, 300);
		}
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

function newDiv(classList){
	var div = $('<div></div>');

	for(var i = 0; i < classList.length; i++){
		div.addClass(classList[i]);
	}

	return div;
}

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