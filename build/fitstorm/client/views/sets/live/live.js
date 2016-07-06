var pageSession = new ReactiveDict(),
	popcorn = null,
	cuePopcorn = null,
	cueTime = 3,
	countdownTimers = [{isCue: true, duration: cueTime}],
	countdownTimerIndex = 0,
	allowanceTime = 0.1;

Template.SetsLive.rendered = function() {
	var set_details = this.data.set_details,
		audio = Songs.findOne({ _id: set_details.songId}),
		setExercises = isTabata(set_details.type) ? setTabataExercises(set_details.set_exercises_joined,set_details._id) : set_details.set_exercises_joined,
		start = 1;

	pageSession.set('setAudio', audio.url() );
	pageSession.set('setExercises' + set_details._id, setExercises);
	pageSession.set('set_details', set_details);
	pageSession.set('hasSetStarted', false);
	pageSession.set('isPlaying', false);
	pageSession.set('isCue', true);

	popcorn = Popcorn('#setAudio');

	_.each(setExercises, function(obj, index) {
		target = 'order-' + index;
		playTime = start;
		endPlayTime = playTime + obj.duration;
		isLastItem = (index == setExercises.length-1);
		
		popcorn
			.footnote({
				start : playTime - allowanceTime,
				end   : endPlayTime - allowanceTime,
				text  : '',
				target: target,
				effect: 'applyclass',
				applyclass: "active-exercise, text-lead"
			});
		
		countdownTimers.push({isCue: false, duration: obj.duration});
		if(!isLastItem) 
			countdownTimers.push({isCue: true, duration: cueTime});

		start = start + obj.duration + cueTime;
	});

	setCue(countdownTimers, setExercises);
};

Template.SetsLive.events({
	"click #playBtn": function() {
		handleAudio(pageSession.get('hasSetStarted'), pageSession.get('isPlaying'));
	}
});

Template.SetsLive.helpers({
	audioSource : function() {
		return pageSession.get('setAudio');
	},
	getSetExercises : function(){
		return pageSession.get('setExercises'+this.set_details._id);
	},
	setDetail: function() {
		return pageSession.get('set_details');
	},
	playButtonClass: function() {
		return pageSession.get('isPlaying') ? 'pause' : 'play';
	},
	getCountdownTimer: function() {
        return  (Template.instance().remaining.get() + (pageSession.get('isCue') ? '' : 's'));
    },
    isPlaying: function() {
    	return pageSession.get('isPlaying');
    },
    timerClass: function() {
    	return pageSession.get('isCue') ? "text-danger blink" : "text-success";
    }
});

Template.SetsLive.created = function(){
  var self = this;
  this.remaining = new ReactiveVar(countdownTimers[0].duration);
  this.interval = Meteor.setInterval(function() {
  	if(pageSession.get('isPlaying')) {
	    var remaining = self.remaining.get();
	    self.remaining.set(--remaining);
	    if (remaining === 0) {
	    	countdownTimerIndex ++;
	    	if(remainingTimer = countdownTimers[countdownTimerIndex]) {
	    		self.remaining.set(remainingTimer.duration);
	    		if(countdownTimerIndex == 1) {
	    			pageSession.set('hasSetStarted', true);
	    			popcorn.currentTime(1);
		    		popcorn.play();
	    		}
	    		pageSession.set('isCue', remainingTimer.isCue);
	    	}else {
			    Meteor.clearInterval(this.interval);
	    	}
	    }else if(remaining === -1){
	    	self.remaining.set(0);
	    }else if(remaining == 2){
	    	playCue(countdownTimers[countdownTimerIndex]);
	    }
    }
  }, 1000);
};

Template.SetsLive.onDestroyed(function () {
	// reset all
    Meteor.clearInterval(this.interval);
    popcorn = null;
	cuePopcorn = null;
	cueTime = 3;
	countdownTimers = [{isCue: true, duration: cueTime}];
	countdownTimerIndex = 0;
	allowanceTime = 0.1;
});

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

handleAudio = function(hasSetStarted, isPlaying) {
	if(isPlaying) {
		popcorn.pause();
	} else {
		if(hasSetStarted) {
			popcorn.play();
		}
	}
	pageSession.set('isPlaying', !isPlaying);
};

playCue = function(obj) {
	if(obj.isCue && obj.exerciseId) {
		if(song = Songs.findOne({exerciseId: obj.exerciseId})) {
			var aud = new Audio(song.url());
			aud.play();
		}
	}
}

setCue = function(countdowns, setExercises){
	var indxs = 0;
	_.each(countdowns, function(obj, index) {
		if(obj.isCue && indxs < setExercises.length-1) {
			countdownTimers[index].exerciseId = setExercises[indxs].exerciseId;
			indxs ++;
		}
	});
};