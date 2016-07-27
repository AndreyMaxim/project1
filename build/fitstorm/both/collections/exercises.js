// this.Exercises = new Mongo.Collection("exercises");
// var exercises = new Mongo.Collection("exercises");
this.Exercises = new Ground.Collection('exercises');

this.Exercises.userCanInsert = function(userId, doc) {
	return true;
};

this.Exercises.userCanUpdate = function(userId, doc) {
	return true;
};

this.Exercises.userCanRemove = function(userId, doc) {
	return Users.isAdmin(userId) || (userId && doc.ownerId == userId);
};
