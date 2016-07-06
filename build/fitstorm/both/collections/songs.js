this.Songs = new FS.Collection("songs", {
	stores: [new FS.Store.GridFS("songs", {})]
});

this.Songs.userCanInsert = function(userId, doc) {
	return true;
};

this.Songs.userCanUpdate = function(userId, doc) {
	return true;
};

this.Songs.userCanRemove = function(userId, doc) {
	return true;
};

this.Songs.userCanDownload = function(userId, doc) {
	return true;
};
