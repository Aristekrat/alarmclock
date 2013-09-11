$(document).ready(function() {

/*** Alarm Clock Abstraction ***/ 
function getCurrentValue() {
	var currentVal = $("#alarmclock h1").html();
	return Number(currentVal);
}	

function incrementAlarmValue(getCurrentValue, incValue) {
	if(getCurrentValue < 250) { 
		var incrementedValue = getCurrentValue + incValue; 
		$("#alarmclock h1").html(incrementedValue); 
	}
}

function decrementAlarmValue(getCurrentValue, decValue) {
	if(getCurrentValue > 0) {
		var decrementedValue = getCurrentValue - decValue; 
		$("#alarmclock h1").html(decrementedValue); 
	}
}

var minHourSwitch = true; 

function changeToMin(getCurrentValue) {
	if(minHourSwitch === false) {
	var outputValue = Math.round(getCurrentValue * 60);
	$("#alarmclock h1").html(outputValue); 
	$("#alarmclock h3").html("MIN"); 
	minHourSwitch = true; 
	}
}

function changeToHour(getCurrentValue) {
	if(minHourSwitch === true) {
	var outputValue = (getCurrentValue / 60).toFixed(2);
	$("#alarmclock h1").html(outputValue); 
	$("#alarmclock h3").html("HOUR"); 
	minHourSwitch = false; 
	}
}

function getSliderValue() {
	var sliderValue = $("#alarmSliderContainer div").slider("values", 0); 
}

/*** Alarm Clock Implementation ***/ 

$("#alarmSliderContainer div").slider({
	max: 250, 
	min: 0,
	step: 1,
	value: 100,
	animate: "fast"
}); 

$("#alarmUpButton").click(function() {
	incrementAlarmValue(getCurrentValue(), 1); 
}); 

$("#alarmDownButton").click(function() {
	decrementAlarmValue(getCurrentValue(), 1); 
}); 


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

$("#alarmPowerButton").click(function() {
	$("#alarmclock h1, #alarmclock h3").toggle();
	$("#alarmLED").toggleClass(); 
});  //Bug: other functions still operate when the power is 'off'.  
	
});

