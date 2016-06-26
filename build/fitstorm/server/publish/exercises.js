Meteor.publish("exercises", function(setId) {
	return Exercises.find({}, {});
});

Meteor.publish("exercise_details", function(exerciseId) {
	return Exercises.find({_id: exerciseId}, {});
});

Meteor.publish("new_exercise", function() {
	return Exercises.find({_id: null}, {});
});
