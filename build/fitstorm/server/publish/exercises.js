Meteor.publish("exercises", function(setId) {
	return Exercises.find({}, {});
});
