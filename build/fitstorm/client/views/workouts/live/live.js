var pageSession = new ReactiveDict(),
	popcorn     = [];

Template.WorkoutsLive.rendered = function() {
	var sets = pageSession.get('sets');

	_.each(sets, function(parentObj, parentIndex) 
	{
		start = 1;
		popcorn[parentIndex] = Popcorn('#setAudio-'+parentObj._id);

		_.each(parentObj.set_exercises_joined, function(obj, index) 
		{
			target = obj._id;
			popcorn[parentIndex]
				.footnote({
					start : start,
					end   : start + obj.duration,
					text  : '',
					target: target,
					effect: 'applyclass',
					applyclass: "text-success, text-lead"
				});
			start += obj.duration;
		});
	});

	_.each(popcorn, function(obj, index) 
	{
		obj.on( "timeupdate", function() {
			setCountdownTimer(this);
		});
	});
};

Template.WorkoutsLive.events({
	
});

Template.WorkoutsLive.helpers({
	isActive: function(index){
		if(index == 0)
			return 'active';
		return '';
	}
});

Template.registerHelper('getAudioSource', function (set) {
	var audio = Songs.findOne({_id: set.songId});
	return audio.url();
});

Template.registerHelper('getWorkoutSets', function (workout) {
	var sets = Sets.find({_id:
		{$in: _.pluck(workout.sets, '_id')}},
		{transform: function(doc){
			doc.set_exercises_joined = SetExercises.find({setId: doc._id}).fetch();
			return doc;
		}}).fetch();
	pageSession.set('sets', sets);
	return sets;
});
