$(document).ready(function() {

/*** Alarm Clock Abstraction ***/ 
function getCurrentValue() {
	var currentVal = $("#alarmclock h1").html(); // This value is initialized in the html. 
	return Number(currentVal);
}	

var minHourSwitch = "minutes"; 
/* This variable switch is used in many of the functions below.
* The variable is the mechanism that tells the application 
* whether it is parsing minutes or hours. I intentionally used
* a semantic string rather than a boolean as its value. 
*/ 
// Hour / Min Conversion Functions
function changeToMin(getCurrentValue) {
	if(minHourSwitch === "hours") {
	var outputValue = Math.round(getCurrentValue * 60);
	$("#alarmclock h1").html(outputValue); 
	$("#alarmclock h3").html("MIN"); 
	minHourSwitch = "minutes"; 
	}
}

function changeToHour(getCurrentValue) {
	if(minHourSwitch === "minutes") {
	var outputValue = Math.round((getCurrentValue / 60) * 100) / 100;
	$("#alarmclock h1").html(outputValue);
	$("#alarmclock h3").html("HOUR");
	unroundedHourValue.unshift(outputValue); // Used in the slider function. 
	minHourSwitch = "hours"; 
	}
} 

// Increment & Decrement Functions for the Right Panel Buttons
function setAlarmFloor() {
	$("#alarmclock h1").html(0); 
}	

function setHourCeiling() {
	$("#alarmclock h1").html(5);  
}	

function incrementAlarmWithButton(getCurrentValue, incValue) {
	var incValue, 
		incrementedValue,
		sliderValue = $("#alarmSliderContainer div").slider("value");
	function basicIncrement() {
		incrementedValue = getCurrentValue + incValue; 
		$("#alarmclock h1").html(incrementedValue); 
	}
	if(minHourSwitch === "minutes" && getCurrentValue < 300) {
		basicIncrement();
		$("#alarmSliderContainer div").slider("value", (sliderValue + 1));
	} else if(minHourSwitch === "hours") {
		if(getCurrentValue < 4) {
			basicIncrement();  
			$("#alarmSliderContainer div").slider("value", (sliderValue + 60));
		} else if(getCurrentValue >= 4 && getCurrentValue < 5) {
			setHourCeiling(); 
			$("#alarmSliderContainer div").slider("value", 300);			
		}
	}
}
	
function decrementAlarmWithButton(getCurrentValue, decValue) {
	var decrementedValue, 
		sliderValue = $("#alarmSliderContainer div").slider("value");
	if(getCurrentValue > 1) {
		decrementedValue = (getCurrentValue - decValue); 
		if(minHourSwitch === "hours") { 
			decrementedValue = decrementedValue.toFixed(2);
			$("#alarmSliderContainer div").slider("value", (sliderValue - 60));
		} else {
			$("#alarmSliderContainer div").slider("value", (sliderValue - 1));
		}
		$("#alarmclock h1").html(decrementedValue); 
	} else if(getCurrentValue === 1 || getCurrentValue > 0 && getCurrentValue < 1) {
		setAlarmFloor(); 
		$("#alarmSliderContainer div").slider("value", 0);
	}
}

// Increment & Decrement for the Moving Slider
//	Function Explanation: This function returns the current slider value and the old slider value in an array.
//	The current slider value is first. 
var sliderValueArray = [100]; 
var getSliderValue = $("#alarmSliderContainer div").on("slide", function(event, ui) {
	function addToBeginning() { sliderValueArray.unshift(ui.value); }; 
	if(sliderValueArray.length < 2) {
		addToBeginning(); 
	} else if(sliderValueArray.length === 2) {
		addToBeginning();  
		sliderValueArray.pop(); 
	}
}); 

/* Slider / Alarm facts: 
* 60 notches total on the slider. 
* Increment / Decrement by 5 in minutes
* Increment / Decrement by .083 in hours
* 300 Minutes Max
* 5 Hours Max
*/ 
var unroundedHourValue = [];
function calculateSliderChange(getCurrentValue) { 
	var hourValue = 0.01666, 
		minValue = 1,
		newValue,
		valueChange,
		addedValue,
		unroundedValue;  
	
	function setAlarmValue() { $("#alarmclock h1").html(newValue); }
	function getAccurateHourValues() {
		unroundedHourValue.unshift(unroundedValue);
		unroundedHourValue.pop();
		newValue = unroundedValue.toFixed(2); 
	}	// Explanation for getAccurateHourValues: this function helps decrease calculation errors that come from regularly rounding the hour value to two decimals. 
	
	// This is the increment function.
	if(sliderValueArray[0] > sliderValueArray[1]) {  
		valueChange = sliderValueArray[0] - sliderValueArray[1]; 
		if(minHourSwitch === "hours") {
			addedValue = valueChange * hourValue; 
			unroundedValue = unroundedHourValue[0] + addedValue; 
			getAccurateHourValues(); 
			setAlarmValue(); 
		} else {
			addedValue = valueChange * minValue; 
			newValue = getCurrentValue + addedValue; 
			setAlarmValue(); 
		}
	} // The decrement function.
	else if(sliderValueArray[0] < sliderValueArray[1]) {
		valueChange = sliderValueArray[1] - sliderValueArray[0];
		if(minHourSwitch === "hours") {
			subtractedValue = valueChange * hourValue;
			unroundedValue = unroundedHourValue[0] - subtractedValue; 
			getAccurateHourValues();			
			setAlarmValue(); 
		} else {
			subtractedValue = valueChange * minValue; 
			newValue = getCurrentValue - subtractedValue;
			setAlarmValue(); 
		}
	}
}

function setSliderBackground(transitionSpeed) {
	var sliderValue = $("#alarmSliderContainer div").slider("value"),
		blueValue = sliderValue * .55, 
		transitionSpeed;
	$(".blueBackground").css("width", blueValue); 
	$(".blueBackground").css("transition", transitionSpeed); 
}

/*** Alarm Clock Implementation ***/ 

	/***Min Hour Switch***/
$("#alarmMinHourContainer div").slider({
	max: 1,
	min: 0,
	step: 1,
	value: 0,
	animate: "fast"
});

$("#alarmMinHourContainer div").on("slidechange", function(event, ui) {
	if(ui.value === 0) {
		changeToMin(getCurrentValue()); 
	} else {
		changeToHour(getCurrentValue()); 
	}
}); 

	/***Large Slider***/
$("#alarmSliderContainer div").slider({
	max: 300, 
	min: 0,
	step: 1,
	value: 100,
	animate: "fast"
}); 

$("#alarmSliderContainer div").on("slide", function(event, ui) {
	calculateSliderChange(getCurrentValue());
}); 

$("#alarmSliderContainer div").on("slidechange", function(event, ui) {
	setSliderBackground('0');
}); 

	/***Up and Down buttons in the top right***/
$("#alarmUpButton").click(function() {
	incrementAlarmWithButton(getCurrentValue(), 1);
	setSliderBackground('200ms');
}); 

$("#alarmDownButton").click(function() {
	decrementAlarmWithButton(getCurrentValue(), 1); 
	setSliderBackground('200ms'); 
}); 
	
	/***Power Button***/
$("#alarmPowerButton").click(function() {
	$("#alarmclock h1, #alarmclock h3").toggle();
	$("#alarmLED").toggleClass(); 
	$(".blueBackground").toggle();
});  //Slight bug: other functions still operate when the power is 'off'.  

	/***Countdown***/ 
// This function counts down the clock every minute, together with its worker friend. 	
var countdown = new Worker('js/countdown.js');
countdown.addEventListener("message", function (e) {
	if(minHourSwitch === "minutes") {
		decrementAlarmWithButton(getCurrentValue(), 1); 
	} else {
		decrementAlarmWithButton(getCurrentValue(), .02); // Note: this calculation is currently inaccurate. The correct value is .0166666666. 
	}
}, false); 
countdown.postMessage();
	
});

