this.Workouts = new Mongo.Collection("workouts");

this.Workouts.userCanInsert = function(userId, doc) {
	return true;
};

this.Workouts.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Workouts.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
