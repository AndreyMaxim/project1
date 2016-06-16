var pageSession = new ReactiveDict(),
	popcorn = null;

Template.SetsLive.rendered = function() {
	var set_details = this.data.set_details,
		audio = Songs.findOne({ _id: set_details.songId}),
		// set_exercises = this.data.set_exercises.fetch(),
		start = 1;

	pageSession.set('setAudio', audio.url());
	pageSession.set('setExercises', set_details.set_exercises_joined);
	pageSession.set('set_details', set_details);

	popcorn = Popcorn('#setAudio');
	
	_.each(set_details.set_exercises_joined, function(obj, id) {
		target = 'order-' + id;
		popcorn
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

	popcorn.on( "timeupdate", function()
	{
		setCountdownTimer(this);
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

Template.registerHelper('startedAt', function (setId, idx) {
	var sum_duration = 1;
	// _.each(set_exercises, function(obj, index) {
	// 	if(index <= idx) {
	// 		sum_duration += obj.duration;
	// 	}
	// });
	SetExercises.find({setId: setId}).fetch().map(function(exercise, index){
		if(index <= idx){
			sum_duration += exercise.duration;
		}
	});

    return sum_duration;
});


getRemainingTime = function(audioDuration, time) {
	countdown = (parseInt(audioDuration) - time);
	if(countdown < 0){
		return 0;
	}
	return countdown;
};

setCountdownTimer = function(popcorn) {
	// jquery dom objects
	$exerciseWrapper = $('.set-exercises-wrapper');
	$curExercise = $exerciseWrapper.find('p.text-success:visible');
	$durationEl  = $curExercise.find('span.duration-wrapper');

	// countdown timer
	countdownTimer = getRemainingTime($curExercise.data('ends-at') || $exerciseWrapper.find('p:first-child').data('duration'), popcorn.roundTime());
	$durationEl.text('(' + countdownTimer + ' sec)');
};