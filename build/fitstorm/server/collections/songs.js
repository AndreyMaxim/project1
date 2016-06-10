Songs.allow({
	insert: function (userId, doc) {
		return Songs.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Songs.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Songs.userCanRemove(userId, doc);
	},

	download: function (userId, doc) {
		return Songs.userCanDownload(userId, doc);
	}
});
