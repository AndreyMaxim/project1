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