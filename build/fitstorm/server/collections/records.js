Records.allow({
	insert: function (userId, doc) {
		return Records.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Records.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Records.userCanRemove(userId, doc);
	},

	download: function (userId, doc) {
		return Records.userCanDownload(userId, doc);
	}
});
