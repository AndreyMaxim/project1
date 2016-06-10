var pageSession = new ReactiveDict(),
	popcorn = null;

Template.SetsLive.rendered = function() {
	var set_details = this.data.set_details;
		audio = Songs.findOne({ _id: set_details.songId}),
		set_exercises = this.data.set_exercises.fetch(),
		start = 1;

	pageSession.set('setAudio', audio.url());
	pageSession.set('setExercises', set_exercises);
	pageSession.set('set_details', set_details);

	popcorn = Popcorn('#setAudio');

	_.each(set_exercises, function(obj) {
		popcorn
			.footnote({
				start : start,
				end   : start + obj.duration,
				text  : obj.exercise,
				target: "#set-exercise-wrapper"
			});
		start += obj.duration;
	});
};

Template.SetsLive.events({
	
});

Template.SetsLive.helpers({
	audioSource : function() {
		return pageSession.get('setAudio');
	},
	exercises : function(){
		return pageSession.get('setExercises');
	},
	setDetail: function(){
		return pageSession.get('set_details');
	}
});

