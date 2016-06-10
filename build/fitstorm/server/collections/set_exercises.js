SetExercises.allow({
	insert: function (userId, doc) {
		return SetExercises.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return SetExercises.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return SetExercises.userCanRemove(userId, doc);
	}
});

SetExercises.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

SetExercises.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

SetExercises.before.remove(function(userId, doc) {
	
});

SetExercises.after.insert(function(userId, doc) {
	
Sets.update({ _id: doc.setId}, {$inc: { "setDuration": doc.duration }});
});

SetExercises.after.update(function(userId, doc, fieldNames, modifier, options) {
	
Sets.update({ _id: doc.setId}, {$set: { "setDuration": _.reduce(SetExercises.find({ setId: doc.setId }).fetch(), function(sum, item){ return sum + item.duration; }, 0) }});
});

SetExercises.after.remove(function(userId, doc) {
	
Sets.update({ _id: doc.setId}, {$inc: { "setDuration": (-1*doc.duration) }});
});
