var pageSession = new ReactiveDict(),
	popcorn = null,
	cuePopcorn = [],
	cueTime = 3,
	cueItems = [],
	cueItemIndex = 0,
	allowanceTime = 0.1,
	init = true,
	cueContext = null,
	setContext = null,
	restCueTime = 1,
	audio = null,
	exerciseList = [],
	isFirstCuePlayed = false;

Template.SetsLive.rendered = function() {
	var set_details = this.data.set_details,
		song = Songs.findOne({ _id: set_details.songId}),
		setExercises = isTabata(set_details.type) ? setTabataExercises(set_details.set_exercises_joined,set_details._id) : set_details.set_exercises_joined,
		start = 1,
		self = this;

	this.exerciseIndex = new ReactiveVar(-1);
	pageSession.set('setAudio', getSetSong(set_details, song) );
	pageSession.set('setExercises' + set_details._id, setExercises);
	pageSession.set('set_details', set_details);
	pageSession.set('hasSetStarted', false);
	pageSession.set('isPlaying', false);

	cueContext = new AudioContext(); 
	setContext = new AudioContext();
	
	var wrapper = Popcorn.HTMLNullVideoElement("#setAudio");
	wrapper.src = "#t=,"+(this.data.set_details.setDuration+1);
	popcorn = Popcorn( wrapper );

	_.each(setExercises, function(obj, index) {
		target = 'set-exercise-item-' + obj._id;
		playTime = start - allowanceTime;
		endPlayTime = playTime + obj.duration;
		cuePlayTime =  endPlayTime - (cueTime - restCueTime);
		nextExercise = setExercises[index + 1] || undefined;

		popcorn
			.footnote({
				start : playTime,
				end   : endPlayTime,
				text  : '',
				target: target,
				effect: 'applyclass',
				applyclass: "active-exercise, text-lead"
			});

		// popcorn.cue(endPlayTime - 0.5, function() {
		// 	$('.active-exercise').fadeOut('slow').delay(1000);
		// });

		popcorn.cue(playTime - 1, function() {
			currentExerciseIndex = self.exerciseIndex.get();
			++ currentExerciseIndex;
		   	self.exerciseIndex.set(currentExerciseIndex);
		});

		exerciseList.push({startAt: playTime, cue: obj.exercise});
		
		if(nextExercise && (nextExercise.exercise.indexOf('Rest') > -1)) {
			cuePlayTime = endPlayTime;
		}

		popcorn.cue(cuePlayTime, function(e) {
			cueItem = cueItems[cueItemIndex];
			if(cueItem && this.currentTime() <= cueItem.timeToPlayAudio) {
				loadCue(cueItem);
			}
		});
		
		setCue(obj, index, playTime);

		start = start + obj.duration;
	});

	popcorn.on('ended', setEnded);

	createAudioElement();
};

Template.SetsLive.helpers({
	audioSource : function() {
		return pageSession.get('setAudio');
	},
	getSetExercises : function() {
		return pageSession.get('setExercises'+this.set_details._id);
	},
	setDetail: function() {
		return pageSession.get('set_details');
	},
	getCountdownTimer: function() {
		var remainingSec = Template.instance().remaining.get();
        return ((remainingSec <= 0 || remainingSec > cueTime) ? '' : remainingSec);
    },
    isPlaying: function() {
    	return pageSession.get('isPlaying');
    },
    playBtnClass: function() {
    	return pageSession.get('isPlaying') ? 'pause' : 'play';
    },
    hasSetStarted: function() {
    	return pageSession.get('hasSetStarted');
    },
    disabledClass: function() {
    	return pageSession.get('hasSetStarted') ? '' : 'disabled';
    }
});

Template.SetsLive.created = function(){
  var self = this;
  this.remaining = new ReactiveVar(cueTime + 1);
  this.interval = Meteor.setInterval(function() {
  	if(pageSession.get('hasSetStarted') == false && pageSession.get('isPlaying')) {
	    var remaining = self.remaining.get();
	    self.remaining.set(--remaining);
	    if(remaining > 0 && !isFirstCuePlayed) {
	    	loadCue(cueItems[cueItemIndex]);
	    	isFirstCuePlayed = true;
	    }else if (remaining === 0) {
			pageSession.set('hasSetStarted', true);
			popcorn.currentTime(1);
    		popcorn.play();
    		if(pageSession.get('setAudio')) {
	    		audio.play();
    		}
    		Meteor.clearInterval(this.interval);
	    }
    }
  }, 1000);
};

Template.SetsLive.onDestroyed(function () {
	// reset all
	popcorn.destroy();
    Meteor.clearInterval(this.interval);
    popcorn = null;
    cuePopcorn = [];
	cueItems = [];
	cueItemIndex = 0;
	allowanceTime = 0.1;
	init = true;
	isFirstCuePlayed = false;
	audio = null;
	exerciseList = [];
	cueContext.close();
	setContext.close();
	pageSession.set('isPlaying', false);
	pageSession.set('isCue', false);
	$('#audio-item').find('audio').remove();
});

Template.SetsLive.events({
	"click #go-back": function(){
		history.back();
	},
	"click .forward-btn": function(e, t) {
		if($(e.target).hasClass('disabled')) {
			return;
		}

		var currentExerciseIndex = Template.instance().exerciseIndex.get();
		var exerciseLength = exerciseList.length;

		if(currentExerciseIndex < exerciseLength) {
			++ cueItemIndex;
			Template.instance().exerciseIndex.set(++currentExerciseIndex);
			if(exerciseList[currentExerciseIndex]) {
				skipTo = exerciseList[currentExerciseIndex].startAt;
				popcorn.currentTime(skipTo);
				audio.currentTime = skipTo;
			}
		}
	},
	"click .backward-btn": function(e, t) {
		if($(e.target).hasClass('disabled')){
			return;
		}

		var currentExerciseIndex = Template.instance().exerciseIndex.get();
		var exerciseLength = exerciseList.length;

		if(currentExerciseIndex < exerciseLength && currentExerciseIndex >= 0) {
			-- currentExerciseIndex;
			-- cueItemIndex;
			if(exerciseList[currentExerciseIndex]) {
				skipTo = exerciseList[currentExerciseIndex].startAt;
				popcorn.currentTime(skipTo);
				audio.currentTime = skipTo;
			}
		}
		Template.instance().exerciseIndex.set(currentExerciseIndex);		
	}
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

loadCue = function(cueObj) {
	if(cueObj && cueObj.hasOwnProperty('exerciseId'))
	{
		if(song = Songs.findOne({exerciseId: cueObj.exerciseId})) {
			var aud = new Audio(song.url());
			aud.play();
			++ cueItemIndex;
		}else if(cueObj.default_cue) {
			if(cueObj.default_cue.indexOf(Meteor.absoluteUrl()) > -1) {
				cueObj.default_cue = cueObj.default_cue.replace(Meteor.absoluteUrl(), '/');
			}
			playCueSound(cueObj.default_cue);
			++ cueItemIndex;
		}
	}
}

setCue = function(exercise, index, timeToPlay) {
	// _.each(setExercises, function(exercise, index) {
	if(exercise) {
		exercise.timeToPlayAudio = timeToPlay;
		cueItems.push(exercise);
		if(exerciseCue = Exercises.findOne(exercise.exerciseId)) {
			cueItems[index].default_cue = exerciseCue.default_cue;
		}
	}
	// });
};


createAudioElement = function()
{
	var canvas = document.getElementById('playbutton');

	canvas.addEventListener('click', function(e) {
	  this.classList.toggle('playing');
	  if (this.classList.contains('playing')) {
	    pageSession.set('isPlaying', true);
	    if(pageSession.get('setAudio'))
	    {
		    audio.play();
		    if(init) audio.pause();
		}
	    init = false;
	   	if(pageSession.get('hasSetStarted')) {
	   		popcorn.play();
	   	}
	  } else {
	  	if(pageSession.get('isPlaying')) {
		  	popcorn.pause();
	  	}
	    pageSession.set('isPlaying', false);
	    audio.pause();
	  }
	}, true);

	window.playButton = canvas;

	audio = new Audio();
	audio.src = pageSession.get('setAudio');
	audio.loop = true;

	document.querySelector('#audio-item').appendChild(audio);

	// Check for non Web Audio API browsers.
	if (!window.AudioContext) {
	  alert("Web Audio isn't available in your browser. But...you can still play the HTML5 audio :)");
	  document.querySelector('#audio-item').classList.toggle('show');
	  document.querySelector('aside').style.marginTop = '7em';
	  return;
	}

	var analyser = setContext.createAnalyser();

	function rafCallback(time) {
	  window.requestAnimationFrame(rafCallback, canvas);

	  var freqByteData = new Uint8Array(analyser.frequencyBinCount);
	  analyser.getByteFrequencyData(freqByteData);
	}

	function onLoad(e) {
	  var source = setContext.createMediaElementSource(audio);
	  source.connect(analyser);
	  analyser.connect(setContext.destination);

	  rafCallback();
	}

	window.addEventListener('load', onLoad, false);
};

playCueSound = function(url) {
  /* --- set up web audio --- */

  // use context

  var source = cueContext.createBufferSource();
  source.connect(cueContext.destination);

  /* --- load up that buffer ---  */
  var request = new XMLHttpRequest();
  request.open('GET', url, true); 
  request.responseType = 'arraybuffer';

  request.onload = function() {
    cueContext.decodeAudioData(request.response, function(response) {
    	source.buffer = response;
    	source.start();
    }, function () { console.error('The request failed.'); } );
  }
  request.send();
};

setEnded = function() {
	Router.go('sets.end', { setId: Router.current().params.setId });
}

getSetSong = function(set, song)
{
	if(set && set.songUrl) {
		return set.songUrl;
	}
	return (song ? song.url() : null);
}