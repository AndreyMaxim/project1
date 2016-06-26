Meteor.publish("records", function(setId) {
	return Records.find({}, {});
});

Meteor.publish("exercise_records", function(exerciseId)
{
	return Records.find({exerciseId: exerciseId}, {});
});