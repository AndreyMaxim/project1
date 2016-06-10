Sets.allow({
	insert: function (userId, doc) {
		return Sets.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Sets.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Sets.userCanRemove(userId, doc);
	}
});

Sets.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
if(!doc.setDuration) doc.setDuration = 0;
});

Sets.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Sets.before.remove(function(userId, doc) {
	
});

Sets.after.insert(function(userId, doc) {
	
});

Sets.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Sets.after.remove(function(userId, doc) {
	
});
