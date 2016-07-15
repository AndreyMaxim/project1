Exercises.allow({
	insert: function (userId, doc) {
		return Exercises.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Exercises.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Exercises.userCanRemove(userId, doc);
	}
});


Exercises.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});