Meteor.publish("song_list", function() {
	return Songs.find({}, {});
});