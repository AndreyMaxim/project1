Meteor.publish("set_exercises", function(setId) {
	return SetExercises.find({setId:setId}, {});
});

Meteor.publish("exercises_empty", function() {
	return SetExercises.find({_id:null}, {});
});

Meteor.publish("set_item", function(itemId) {
	return SetExercises.find({_id:itemId}, {});
});

Meteor.publish("exercises_all", function() {
	return SetExercises.find({}, {});
});