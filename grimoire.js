// The Guitar Fretboard Grimoire
// a script for procedurally generating fretboard diagrams 
// of various intervals, chords, and scales.

const fs = require('fs');

var echoLog = [];
function echo(params) {
	// render directly to console:
	// Function.apply.call(console.log, console, arguments);
	// push into the log, to be rendered later in flush()
	echoLog.push.apply(echoLog, arguments);
}

// the tuning of the guitar

var standard_tuning = "EADGBE";//
var all_fourths_tuning = "EADGCF";//.split('');

var tuning = standard_tuning.split();

var allTunings = [
	{t: standard_tuning, n: "Standard Tuning"},
	{t: all_fourths_tuning, n: "All-fourths Tuning"} 
];

// alphabetical formulaIntervals expressed as flats
var notesAsFlats = "A,Bb,B,C,Db,D,Eb,E,F,Fb,G,Ab".split(',');
// two octaves of intervals, expressed as both sharps and flats
var intervalsAsFlats = "1,b2,2,b3,3,4,b5,5,b6,6,b7,7,8,b9,9,b10,10,11,b12,12,b13,13,b14,14,15".split(',');
var intervalsAsSharps = "1,#1,2,#2,3,4,#4,5,#5,6,#6,7,8,#8,9,#9,10,11,#11,12,#12,13,#13,14,15".split(',');

var endl = "\n\r";

var MaxFret = 12;

var intervalFormulas = [
	{ f: "1", n : "Unison"},
	{ f: "1 b2", n : "Minor Second"},
	{ f: "1 2", n : "Second"},
	{ f: "1 b3", n : "Minor Third"},
	{ f: "1 3", n : "Major Third"},
	{ f: "1 4", n : "Fourth"},
	{ f: "1 b5", n : "Diminished Fifth"},
	{ f: "1 5", n : "Fifth"},
	{ f: "1 b6", n : "Minor Sixth"},
	{ f: "1 6", n : "Sixth"},
	{ f: "1 b7", n : "Minor Seventh"},
	{ f: "1 7", n : "Seventh"},
	{ f: "1 b9", n : "Minor Ninth"},
	{ f: "1 b9", n : "Ninth"},
	{ f: "1 b10", n : "Minor Tenth"},
	{ f: "1 10", n : "Tenth"},
	{ f: "1 11", n : "Eleventh"},
	{ f: "1 b12", n : "Diminished Twelfth"},
	{ f: "1 12", n : "Twelfth"},
	{ f: "1 b13", n : "Minor Thirteenth"},
	{ f: "1 13", n : "Thirteenth"},
	{ f: "1 b14", n : "Minor Fourteenth"},
	{ f: "1 14", n : "Fourteenth"},
];

var chords = [
	{ f: "1 5", n : "Power Chord"},
	{ f: "1 5 9", n : "Power Chord 9"}, // not supported yet (above 7)
	{ f: "1 3 5", n : "Major" },
	{ f: "1 b3 5", n : "Minor"},
	{ f: "1 3 5 7", n : "Major Seventh"},
	{ f: "1 b3 5 b7", n : "Minor Seventh"},
	{ f: "1 3 5 b7", n : "Dominant Seventh"},
	{ f: "1 b3 5 7", n : "Minor/Major Seventh"},	
	{ f: "1 b3 5 7 9", n : "Minor/Major Ninth"},
];

var scales = [
	{ f: "1 2 3 5 6", n : "Major Pentatonic"},
	{ f: "1 b3 4 5 b7", n : "Minor Pentatonic"},
	{ f: "1 b3 4 b5 5 b7", n : "Blues Scale (Hexatonic)"},
	{ f: "1 2 b3 4 b5 6 b7", n : "Blues Scale (Heptatonic)"},
	{ f: "1 2 b3 3 4 5 6 b7 7", n : "Blues Scale (Nonatonic)"},
	{ f: "1 2 3 4 5 6 7", n : "Major"},
	{ f: "1 2 b3 4 5 b6 b7", n : "Minor"},	
	{ f: "1 2 3 4 5 6 7", n : "Ionian"},
	{ f: "1 2 b3 4 5 6 b7", n : "Dorian"},
	{ f: "1 b2 b3 4 5 b6 b7", n : "Phrygian"},
	{ f: "1 2 3 #4 5 6 7", n : "Lydian"},
	{ f: "1 2 3 4 5 6 b7 8", n : "Mixolydian"},
	{ f: "1 2 b3 4 5 b6 b7 8", n : "Aolian"},
	{ f: "1 b2 b3 4 b5 b6 b7 8", n : "Locrian"},
	{ f: "1 2 b3 4 5 6 7", n : "Melodic Minor"},	
	{ f: "1 b2 b3 4 5 6 b7", n : "Dorian b2 (Melodic Minor, Mode 2)"},	
	{ f:  "1 2 3 #4 #5 6 7", n : "Lydian #5 (Lydian Augmented) (Melodic Minor, Mode 3)"},	
	{ f: "1 2 3 #4 5 6 b7", n : "Lydian Dominant (Melodic Minor, Mode 4)"},	
	{ f: "1 2 3 4 5 b6 b7", n : "Mixolydian b6 (Hindu Scale) (Melodic Minor, Mode 5)"},	
	{ f: "1 2 b3 4 b5 b6 b7", n : "Aeolian b5 (Melodic Minor, Mode 6)"},	
	{ f: "1 b9 #9 3 b5 #5 b7", n : "Altered (Melodic Minor, Mode 7)"},
	{ f: "1 b2 #2 3 b5 #5 b7", n : "Altered (One octave) (Melodic Minor, Mode 7)"},
	{ f: "1 b2 b3 3 b5 b6 b7", n : "Altered (One octave B) (Melodic Minor, Mode 7)"}	
];

(function main() {

	// retune(all_fourths_tuning);
	//printEntireGrimoire();
	//flush();	

	printAndSaveAllTunings();

})();

function printAndSaveAllTunings() {
	for (let i = 0; i < allTunings.length; i++) {
		const tuning = allTunings[i];
		retune(tuning.t);
		printEntireGrimoire();
		var text = flush(false);
		var filename = "The Guitar Fretboared Grimoire - " + tuning.n + ".md";
		fs.writeFileSync(filename, text);
	}
}

function printEntireGrimoire(variantName) {
	
	var title = "# The Guitar Fretboared Grimoire";
	if (variantName) {
		title += " (" + variantName + ")"
	}

	echo(title);
	echo(endl);
	echo("## Intervals");
	echo(endl);
	printFormulasToFretboard(intervalFormulas);
	echo(endl);
	echo("## Chords");
	echo(endl);
	printFormulasToFretboard(chords);	
	echo(endl);
	echo("## Scales");
	echo(endl);
	printFormulasToFretboard(scales);	
	printAppendix();
}

function retune(t) {
	// console.log("tuning: ", t);
	tuning = t.split('');
}

function flush(logToConsole) {
	var logToConsole = (typeof logToConsole !== 'undefined') ? logToConsole : true;
	// render the final output string
	var finalText = echoLog.join('\n');
	if (logToConsole) console.log(finalText);
	echoLog.length = 0;
	return finalText;
}

function buildChordFingerings(formula) {
	var intervals = formula.split(" ");
	if (intervals[0] != "1") {
		console.log("Error, chord must have 1 as root", formula);
		return;
	}
	var fretboard = buildFretboardData(formula, MaxFret);
	console.log(fretboard);
}

function printAppendix() {
	echo("## Appendix");
	echo(endl);
	echo("#### Notes");
	echo(endl);
	echo(notesAsFlats);
	echo(endl);
	echo("#### Intervals");
	echo(endl);
	echo(intervalsAsFlats);
	echo(endl);
	echo(intervalsAsSharps);
	echo(endl);
	printFormulasAsData(intervalFormulas);
	echo(endl);
	echo("#### Chords");
	echo(endl);
	printFormulasAsData(chords);
	echo(endl);
	echo("#### Scales");
	echo(endl);
	printFormulasAsData(scales);
	echo(endl);
}

function printFormulasAsData(formulas) {
	for (let i = 0; i < formulas.length; i++) {
		const f = formulas[i];
		echo(f.f + " - " + f.n) + "  ";
	}
}

function printFormulasToFretboard(formulas) {
	for (let i = 0; i < formulas.length; i++) {
		const chord = formulas[i];
		printFormulaToFretboard(chord.f, chord.n);
	}
}

// get interval index (ie number of semitones) of an interval (with sharps or flats)
function getIntervalSemitone(interval) {
	var intervalIndex = intervalsAsFlats.indexOf(interval);
	if (intervalIndex == -1) intervalIndex = intervalsAsSharps.indexOf(interval);
	if (intervalIndex == -1) {
		console.log("Unknown interval:", interval);
		return -1;
	}
	return intervalIndex;
}

// get interval index (ie number of semitones) of an interval, 
// wrapped within a range of one octave (12 semitones)
function getBaseIntervalSemitone(interval) {
	var intervalIndex = getIntervalSemitone(interval);
	if (intervalIndex == -1) return -1;
	return intervalIndex % 12;
}

function printFormulaToFretboard(formula, name) {
	var fretboard = buildFretboardData(formula);
	// print the formula title
	var name = name == null ? "Formula: " : name + " - ";
	echo("### " + name + formula.replace(',', ' ') + endl);
	echo("```");
	printFretboard(fretboard);
	echo("```");
	echo(endl);
}

function buildFretboardData(formula, maximumFret) {
	maximumFret = maximumFret || MaxFret;
	// data representation of the fretboard
	var fretboardData = [];
	var formulaIntervals = formula.split(' ');
	var formulaIntervalsAsSemitones = [];
	for (let i = 0; i < formulaIntervals.length; i++) {
		const interval = formulaIntervals[i];
		formulaIntervalsAsSemitones.push(getBaseIntervalSemitone(interval));
	}
	// print the fretboard with formula intervals marked
	for (var i = tuning.length - 1; i >= 0; i--) {
		var stringRoot = tuning[i];
		// get the index of the root note in the note name lookup
		var noteRootIndex = notesAsFlats.indexOf(stringRoot);
		// data representation of the string
		var stringData = [];
		fretboardData.push(stringData);
		// loop over all frets and label as either blank or containing a formula interval
		for (var fi = 0; fi < maximumFret; fi++) {
			// get the interval name of the current fret
			intervalName = intervalsAsFlats[(noteRootIndex + fi) % 12];
			// see if the current note is in the formula...
			// get the interval as semitones (within the base octave)
			var baseSemitone = getBaseIntervalSemitone(intervalName);
			var formulaNoteIndex = formulaIntervalsAsSemitones.indexOf(baseSemitone);		
			if (formulaNoteIndex >= 0) {
				// using the note index, write out the name of the formula
				stringData.push(formulaIntervals[formulaNoteIndex])
			} else {
				stringData.push('')
			}	
		}
	}
	return fretboardData;
}

function printFretboard(fretBoard) {
	for (var i = 0; i < fretBoard.length; i++) {
		var frets = ['	'];
		var stringData = fretBoard[i];
		for (var fi = 0; fi < stringData.length; fi++) {
			frets.push('|--');
			frets.push(padString(stringData[fi]));
		}
		frets.push('|');
		echo(frets.join(''));
	}
}

// this prints a single row of intervals to visualise the horizontal relationships.
function printIntervals(intervals) {
	var line = [];
	for (let i = 0; i < intervals.length; i++) {
		const interval = intervals[i];
		var fret = 
			(interval.indexOf("b") != -1)
			|| (interval.indexOf("#") != -1)
				? "|---" : "|-" + interval + "-"; 
		line.push(fret);
	}
	line.push('|');
	echo(line.join(''));
}

function padString(s, depth) {
	depth = depth || 3;
	var s2 = "" + s;
	var requiredPad = depth - s.length;
	if (requiredPad <= 0) return s2;
	for (var i = 0; i < depth - s.length; i++) {
		s2 += "-";
	}
	return s2;
}
