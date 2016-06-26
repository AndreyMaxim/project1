this.Exercises = new Mongo.Collection("exercises");

this.Exercises.userCanInsert = function(userId, doc) {
	return true;
};

this.Exercises.userCanUpdate = function(userId, doc) {
	return true;
};

this.Exercises.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
