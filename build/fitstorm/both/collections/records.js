this.Records = new UniRecorder({
    name: 'records',
    targetFileFormat: 'wav',
});

this.Records.userCanInsert = function(userId, doc) {
	return true;
};

this.Records.userCanUpdate = function(userId, doc) {
	return true;
};

this.Records.userCanRemove = function(userId, doc) {
	return true;
};

this.Records.userCanDownload = function(token, doc) {
	return true;
};
