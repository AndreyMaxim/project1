// this.Sets = new Mongo.Collection("sets");
// var sets  = new Mongo.Collection("sets");
this.Sets = new Ground.Collection('sets');

this.Sets.userCanInsert = function(userId, doc) {
	return true;
};

this.Sets.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Sets.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
