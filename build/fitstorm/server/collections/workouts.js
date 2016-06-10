Workouts.allow({
	insert: function (userId, doc) {
		return Workouts.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Workouts.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Workouts.userCanRemove(userId, doc);
	}
});

Workouts.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Workouts.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Workouts.before.remove(function(userId, doc) {
	
});

Workouts.after.insert(function(userId, doc) {
	
});

Workouts.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Workouts.after.remove(function(userId, doc) {
	
});
