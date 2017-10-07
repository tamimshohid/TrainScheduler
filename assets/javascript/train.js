// This information initializes Firebase
  var config = {
    apiKey: "AIzaSyD6u0xoRuTD_zPmtGdHs-C7JqVljwMR-N8",
    authDomain: "trainschedule-6c39d.firebaseapp.com",
    databaseURL: "https://trainschedule-6c39d.firebaseio.com",
    storageBucket: "trainschedule-6c39d.appspot.com",
  };
  firebase.initializeApp(config);

// Set variable database to firebase database
var database = firebase.database();


// Add train button
$("#addTrainButton").on("click", function(){

	// Captures user input
	var trainName = $("#trainNameInput").val().trim();
	var traindestination = $("#destinationInput").val().trim();
	var trainStart = moment($("#startInput").val().trim(), "HH:mm").format("X");
	var trainFrequency = $("#frequencyInput").val().trim();

	// For holding train data
	var newtrain = {
		name:  trainName,
		destination: traindestination,
		start: trainStart,
		frequency: trainFrequency
	}

	// Adds to a list of data in the database
	database.ref().push(newtrain);


	// Clears all of the text-boxes
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#startInput").val("");
	$("#frequencyInput").val("");

	// Prevents moving to new page
	return false;
});


// The firebase event Child Added will be triggered once for each initial train
// and it will be triggered again every time a new train is added
// For ordering purposes it is passed a second argument: prevChildKey
database.ref().on("child_added", function(childSnapshot, prevChildKey){

	// Console log childSnapshot and extract its content as a javascript object using val()
	console.log(childSnapshot.val());

	// Store into a variable
	var trainName = childSnapshot.val().name;
	var traindestination = childSnapshot.val().destination;
	var trainStart = childSnapshot.val().start;
	console.log(trainStart);
	var trainFrequency = childSnapshot.val().frequency;

	// First Time (pushed back 1 year to make sure it comes 
	//before current time)
	var trainStartConverted = moment(trainStart, "X").subtract(1, "years");
	console.log(trainStartConverted);

	// Current Time
	var currentTime = moment();
	console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

	// Difference between the times
	var diffTime = moment().diff(moment(trainStartConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	// Time apart (remainder)
	var tRemainder = diffTime % trainFrequency;
	console.log(tRemainder);

	// Minutes until train arrives
	var tMinutesTillTrain = trainFrequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	// Next Train
	var nextTrain = moment().add(tMinutesTillTrain, "minutes")
	console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
	nextTrainLegible = moment(nextTrain).format("hh:mm A");

	// Train information
	console.log(trainName);
	console.log(traindestination);
	console.log(trainStartConverted);
	console.log(trainFrequency);

	// Transform (make legible) unix timestamp - train start
	var trainStartLegible = moment.unix(trainStartConverted).format("HH:mm");

	// Add train data to table
	$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + traindestination + "</td><td>" + trainFrequency + "</td><td>" + nextTrainLegible + "</td><td>" + tMinutesTillTrain);

});