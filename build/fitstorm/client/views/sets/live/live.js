var pageSession = new ReactiveDict(),
	popcorn = null,
	cuePopcorn = null,
	cueTime = 3,
	countdownTimers = [{isCue: true, duration: cueTime}],
	countdownTimerIndex = 0,
	allowanceTime = 0.1,
	init = true,
	audio = null;

Template.SetsLive.rendered = function() {
	var set_details = this.data.set_details,
		song = Songs.findOne({ _id: set_details.songId}),
		setExercises = isTabata(set_details.type) ? setTabataExercises(set_details.set_exercises_joined,set_details._id) : set_details.set_exercises_joined,
		start = 1;
	
	pageSession.set('setAudio', song ? song.url() : null );
	pageSession.set('setExercises' + set_details._id, setExercises);
	pageSession.set('set_details', set_details);
	pageSession.set('hasSetStarted', false);
	pageSession.set('isPlaying', false);
	pageSession.set('isCue', true);

	var wrapper = Popcorn.HTMLNullVideoElement("#setAudio");
	wrapper.src = "#t=,"+(this.data.set_details.setDuration*2);
	popcorn = Popcorn( wrapper ); //Popcorn('#setAudio');

	_.each(setExercises, function(obj, index) {
		target = 'set-exercise-item-' + obj._id;
		playTime = start - allowanceTime;
		endPlayTime = playTime + obj.duration - allowanceTime;
		isLastItem = (index == setExercises.length-1);
		
		popcorn
			.footnote({
				start : playTime,
				end   : endPlayTime,
				text  : '',
				target: target,
				effect: 'applyclass',
				applyclass: "active-exercise, text-lead"
			});
		
		countdownTimers.push({isCue: false, duration: obj.duration});
		if(!isLastItem){
			countdownTimers.push({isCue: true, duration: cueTime});
		}

		popcorn.cue(endPlayTime - 0.5, function() {
			$('.active-exercise').fadeOut('slow').delay(1000);
		});

		start = start + obj.duration + cueTime;
	});

	setCue(countdownTimers, setExercises);
	createAudioElement();
};

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
		    		audio.play();
	    		}
	    		pageSession.set('isCue', remainingTimer.isCue);
	    	}else {
			    Meteor.clearInterval(this.interval);
	    	}
	    }else if(remaining === -1) {
	    	self.remaining.set(0);
	    }else if(remaining == 2) {
	    	playCue(countdownTimers[countdownTimerIndex]);
	    }
    }
  }, 1000);
};

Template.SetsLive.onDestroyed(function () {
	// reset all
	popcorn.destroy();
    Meteor.clearInterval(this.interval);
    popcorn = null;
	cuePopcorn = null;
	cueTime = 3;
	countdownTimers = [{isCue: true, duration: cueTime}];
	countdownTimerIndex = 0;
	allowanceTime = 0.1;
	init = true;
	audio = null;
	pageSession.set('isPlaying', false);
	$('#audio-item').find('audio').remove();
});

Template.SetsLive.events({
	"click #go-back": function(){
		history.back();
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
			// var aud = new Audio(song.url());
			// aud.play();
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


createAudioElement = function(){
	CanvasRenderingContext2D.prototype.line = function(x1, y1, x2, y2) {
	  this.lineCap = 'round';
	  this.beginPath();
	  this.moveTo(x1, y1);
	  this.lineTo(x2, y2);
	  this.closePath();
	  this.stroke();
	}
	CanvasRenderingContext2D.prototype.circle = function(x, y, r, fill_opt) {
	  this.beginPath();
	  this.arc(x, y, r, 0, Math.PI * 2, true);
	  this.closePath();
	  if (fill_opt) {
	    this.fillStyle = 'rgba(0,0,0,1)';
	    this.fill();
	    this.stroke();
	  } else {
	    this.stroke();
	  }
	}
	CanvasRenderingContext2D.prototype.rectangle = function(x, y, w, h, fill_opt) {
	  this.beginPath();
	  this.rect(x, y, w, h);
	  this.closePath();
	  if (fill_opt) {
	    this.fillStyle = 'rgba(0,0,0,1)';
	    this.fill();
	  } else {
	    this.stroke();
	  }
	}
	CanvasRenderingContext2D.prototype.triangle = function(p1, p2, p3, fill_opt) {
	  // Stroked triangle.
	  this.beginPath();
	  this.moveTo(p1.x, p1.y);
	  this.lineTo(p2.x, p2.y);
	  this.lineTo(p3.x, p3.y);
	  this.closePath();
	  if (fill_opt) {
	    this.fillStyle = 'rgba(0,0,0,1)';
	    this.fill();
	  } else {
	    this.stroke();
	  }
	}
	CanvasRenderingContext2D.prototype.clear = function() {
	  this.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
	}

	var canvas = document.getElementById('playbutton');
	var ctx = canvas.getContext('2d');
	ctx.lineWidth = 4;

	var R = canvas.width / 2;
	var STROKE_AND_FILL = false;

	canvas.addEventListener('mouseover', function(e) {
	  if (this.classList.contains('playing')) {
	    drawPauseButton(STROKE_AND_FILL);
	  } else {
	    drawPlayButton(STROKE_AND_FILL);
	  }
	  ctx.save();
	  ctx.lineWidth += 3;
	  ctx.circle(R, R, R - ctx.lineWidth + 1);
	  ctx.restore();
	}, true);

	canvas.addEventListener('mouseout', function(e) {
	  if (this.classList.contains('playing')) {
	    drawPauseButton(STROKE_AND_FILL);
	  } else {
	    drawPlayButton(STROKE_AND_FILL);
	  }
	}, true);

	canvas.addEventListener('click', function(e) {
	  this.classList.toggle('playing');
	  if (this.classList.contains('playing')) {
	    // drawPauseButton(STROKE_AND_FILL);
	    audio.play();
	    if(init) audio.pause();
	    init = false;
	    handleAudio(pageSession.get('hasSetStarted'), pageSession.get('isPlaying'));
	  } else {
	    drawPlayButton(STROKE_AND_FILL);
	    audio.pause();
	    handleAudio(pageSession.get('hasSetStarted'), pageSession.get('isPlaying'));
	  }
	}, true);

	function drawPlayButton(opt_fill) {
	  ctx.clear();
	  ctx.circle(R, R, R - ctx.lineWidth + 1, opt_fill);
	  ctx.triangle({x: R*0.8, y: R*0.56}, {x: R*1.45, y: R}, {x: R*0.8, y: R*1.45}, true);
	}

	function drawPauseButton(opt_fill) {
	  ctx.clear();
	  ctx.circle(R, R, R - ctx.lineWidth + 1, opt_fill);
	  ctx.save();
	  ctx.lineWidth += 4;
	  ctx.line(R*0.8, R/2, R*0.8, R*1.5);
	  ctx.line(R+(R/5), R/2, R+(R/5), R*1.5);
	  ctx.restore();
	}
	drawPlayButton(STROKE_AND_FILL);

	window.playButton = canvas;
	
	const CANVAS_HEIGHT = canvas.height;
	const CANVAS_WIDTH = canvas.width;

	// window.audio
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

	var context = new AudioContext();
	var analyser = context.createAnalyser();

	function rafCallback(time) {
	  window.requestAnimationFrame(rafCallback, canvas);

	  var freqByteData = new Uint8Array(analyser.frequencyBinCount);
	  analyser.getByteFrequencyData(freqByteData); //analyser.getByteTimeDomainData(freqByteData);

	  var SPACER_WIDTH = 10;
	  var BAR_WIDTH = 5;
	  var OFFSET = 100;
	  var CUTOFF = 23;
	  var numBars = Math.round(CANVAS_WIDTH / SPACER_WIDTH);

	  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	  ctx.fillStyle = '#F6D565';
	  ctx.lineCap = 'round';
	}

	function onLoad(e) {
	  var source = context.createMediaElementSource(audio);
	  source.connect(analyser);
	  analyser.connect(context.destination);

	  rafCallback();
	}

	// Need window.onload to fire first. See crbug.com/112368.
	window.addEventListener('load', onLoad, false);
};