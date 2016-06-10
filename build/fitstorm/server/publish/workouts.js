Meteor.publish("workout_list", function() {
	return Workouts.find({}, {transform:function(doc) { var sum = 0, set_ids = _.pluck(doc.sets, '_id'); Sets.find({ _id: {$in: set_ids} }).map(function(item) { if(item.setDuration) sum += item.setDuration; }); doc.workoutDuration = sum; return doc; },sort:["name"]});
});

Meteor.publish("workouts_empty", function() {
	return Workouts.find({_id:null}, {});
});

Meteor.publish("workout_details", function(workoutId) {
	return Workouts.find({_id:workoutId}, {transform:function(doc) { var sum = 0, set_ids = _.pluck(doc.sets, '_id'); Sets.find({ _id: {$in: set_ids} }).map(function(item) { if(item.setDuration) sum += item.setDuration; }); doc.workoutDuration = sum; return doc; }});
});

