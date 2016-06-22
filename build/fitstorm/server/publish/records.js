Meteor.publish("records", function(setId) {
	return Records.find({}, {});
});
