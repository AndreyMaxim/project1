var pageSession = new ReactiveDict(),
	popcorn = null,
	cuePopcorn = null,
	cueTime = 2;

Template.SetsLive.rendered = function() {
	var set_details = this.data.set_details,
		audio = Songs.findOne({ _id: set_details.songId}),
		setExercises = isTabata(set_details.type) ? setTabataExercises(set_details.set_exercises_joined,set_details._id) : set_details.set_exercises_joined,
		start = 1;
	
	pageSession.set('setAudio', audio.url() );
	pageSession.set('setExercises' + set_details._id, setExercises);
	pageSession.set('set_details', set_details);

	popcorn = Popcorn('#setAudio');
	
	_.each(setExercises, function(obj, index) {
		target = 'order-' + index;
		playTime = start + cueTime;
		endPlayTime = playTime + obj.duration;
		
		popcorn
			.footnote({
				start : playTime,
				end   : endPlayTime,
				text  : '',
				target: target,
				effect: 'applyclass',
				applyclass: "text-success, text-lead"
			});

		popcorn.cue(start, function() {
			var song = Songs.findOne({exerciseId: obj.exerciseId});
			if(song){
				var aud = new Audio(song.url());
				aud.play();
			}
			// if(song = Songs.findOne({exerciseId: obj.exerciseId})) {
			// 	var aud = new Audio(song.url());
			// 	aud.play();
			// }else if(records = Records.find({exerciseId : obj.exerciseId})) {
			// 	Records.findOne(records.fetch()[randomizeIndex(records)]._id).play();
			// }
		});

		start = start + obj.duration + cueTime;
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
	getSetExercises : function(){
		return pageSession.get('setExercises'+this.set_details._id);
	},
	setDetail: function(){
		return pageSession.get('set_details');
	}
});

Template.registerHelper('endsAt', function (setId, idx) {
	var sum_duration = 1,
		setExercises = pageSession.get('setExercises' + setId);
	_.map(setExercises, function(exercise, index) {
		if(index <= idx) {
			sum_duration = sum_duration + exercise.duration + cueTime;
		}
	});
    return sum_duration;
});

getRemainingTime = function(audioDuration, time) {

	countdown = (parseInt(audioDuration) - time);

	if(isNaN(countdown) || countdown < 0) {
		return 0;
	}
	
	return countdown;
};

setCountdownTimer = function(popcorn) {
	// jquery dom objects
	$exerciseWrapper = $('.set-exercises-wrapper');
	$curExercise = $exerciseWrapper.find('p.text-success:visible');
	$durationEl  = $curExercise.find('span.duration-wrapper');
	currentTime = popcorn.roundTime();

	// countdown timer
	if(currentTime < cueTime + 1) {
		currentTime -= cueTime;
	}
	countdownTimer = getRemainingTime($curExercise.data('ends-at'), currentTime);
	$durationEl.text('(' + countdownTimer + ')');
};

randomizeIndex = function(collection)
{
	return Math.floor(Math.random() * collection.count());
};

isTabata = function(type){
	return (type.indexOf('Tabata') > -1);
};

setTabataExercises = function(setExercises, setId) {
	var setExercisesTemp = [];
	var index = 0;
	for(var i = 1; i <= setExercises.length * 2; i ++) {
		if(i % 2 == 0) {
			setExercisesTemp.push({_id: _.uniqueId('rest_'), exercise: 'Rest', duration: 10, exerciseId: -1, setId: setId});
		}else {
			setExercisesTemp.push(setExercises[index++]);
		}
	}
	return setExercisesTemp;
};

setPageSession = function(key, value) {
	pageSession.set(key, value);
};