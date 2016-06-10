Meteor.publish("set_list", function() {
	return Sets.publishJoinedCursors(Sets.find({ownerId:this.userId}, {sort:[["setName","desc"]]}));
});

Meteor.publish("sets_empty", function() {
	return Sets.publishJoinedCursors(Sets.find({_id:null,ownerId:this.userId}, {}));
});

Meteor.publish("set_details", function(setId) {
	return Sets.publishJoinedCursors(Sets.find({_id:setId,ownerId:this.userId}, {}));
});

Meteor.publish("workout_sets", function(workoutId) {
	return Sets.publishJoinedCursors(Sets.find({workoutId:workoutId,ownerId:this.userId}, {}));
});

