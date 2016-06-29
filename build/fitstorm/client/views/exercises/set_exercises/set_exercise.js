var pageSession = new ReactiveDict(),
	params = [],
	exercises = [],
	audio_ids = [];
	
Template.AddExercises.rendered = function() {
	params = this.data.params;
	set_exercises =  [];

	if(params.hasOwnProperty('setId')) {
		set_exercises = this.data.set_exercises.fetch();
		set = Sets.findOne(params.setId);
		pageSession.set('setType', set.type);
	}else{
		pageSession.set('setType', 'AMRAP');
	}

	exercises = Exercises.find().fetch();
	pageSession.set('set_exercises', set_exercises);
	pageSession.set('exerciseAction', null);
	pageSession.set('hasExercises', set_exercises.length);
	pageSession.set('isRecording', false);
	pageSession.set('record_id', null);
};

Template.AddExercises.helpers({
	"exerciseAction" : function() {
		return pageSession.get('exerciseAction');
	},
	"hasExercises" : function() {
		return pageSession.get('hasExercises') && !pageSession.get('exerciseAction');
	},
	"getExercises" : function() {
		return pageSession.get('set_exercises');
	},
	"getSelectValue": function() {
		action = pageSession.get('exerciseAction');
		if(action && action.indexOf('Edit') > -1) {
			return getValue(pageSession.get('selectedExercise'), 'exercise');
		}else {
			return 'Push-up';
		}
	},
	"exercises": function(){
		return exercises;
	},
	"getDurationValue" : function(){
		action = pageSession.get('exerciseAction');
		setType = pageSession.get('setType');
		duration = 30;
		if(action && action.indexOf('Edit') > -1) {
			duration = getValue(pageSession.get('selectedExercise'), 'duration');
		}else if(setType && setType.indexOf('EMOM') > -1) {
			duration = 60;
		}
		return duration;
	},
	"getLabel" : function(){
		var setType = pageSession.get('setType');
		if(setType.indexOf('AMRAP') > -1) {
			return 'Rep/Quantity';
		}
		return 'Duration';
	},
	"isRecording": function(){
		return pageSession.get('isRecording');
	},
	"isReadOnly": function() {
		setType = pageSession.get('setType');
		return (setType && setType.indexOf('EMOM') > -1);
	}
});

Template.AddExercises.events({
	"click .save-exercise" : function(e) 
	{
		var set_exercises 	 = pageSession.get('set_exercises'),
			action       = pageSession.get('exerciseAction'),
			selectedExercise = pageSession.get('selectedExercise'),
			$select         = $('#select-exercise')
			newExercise  = 
					{
						'exercise'   : $select.val(),
						'duration'   : parseFloat($('#exercise-duration').val()),
						'setId'	     : params.setId,
						'recordId'   : pageSession.get('record_id'),
						'exerciseId' : $select.find("option:selected").data('id')
					};

		if(action.indexOf('Add') > -1) {
			newId = SetExercises.insert(newExercise);
			newExercise._id = newId;

			set_exercises.push(newExercise);
		}else {
			index = _.pluck(set_exercises, '_id').indexOf(selectedExercise[0]._id);
			SetExercises.update(
				{_id: selectedExercise[0]._id},
				{$set: 
				{
			        'exercise' : newExercise.exercise,
			        'duration' : newExercise.duration,
			        'recordId' : (pageSession.get('record_id') ? pageSession.get('record_id') : set_exercises[index].recordId)
			    }
			});
			set_exercises[index] = newExercise;
		}
		pageSession.set('exerciseAction', null);
		pageSession.set('hasExercises', set_exercises.length);
		pageSession.set('set_exercises', set_exercises);
	},
	"click .add-exercise" : function() {
		pageSession.set('exerciseAction', 'Add');
	},
	"click .cancel-exercise": function() {
		pageSession.set('exerciseAction', null);
	},
	"click .edit-exercise": function(e, t) {
		var $targetId = $(e.target).parent().data('id');
		setExercise = $.grep(pageSession.get('set_exercises'), function(exrcse){ return exrcse._id == $targetId; });
		pageSession.set('exerciseAction', 'Edit');
		pageSession.set('selectedExercise', setExercise);
	},
	"click .delete-exercise": function(e) {
		var $targetId    = $(e.target).parent().data('id'),
			set_exercises  = pageSession.get('set_exercises');

		set_exercises = _.reject(set_exercises, function(obj){ return obj._id == $targetId; });
		SetExercises.remove($targetId);
		pageSession.set('exerciseAction', null);
		pageSession.set('set_exercises', set_exercises);
		pageSession.set('hasExercises', set_exercises.length);
	},
	"click #record-cue-start": function() {
		pageSession.set('isRecording', true);
		if(Records.ready()) {
			Records.startRecording({},function(err, id) {
				pageSession.set('record_id', id);
			});
		}
	},
	"click #record-cue-stop": function() {
		pageSession.set('isRecording', false);
		Records.stopRecording();
	}
});

getValue = function(obj, index){
	return obj[0][index];
}
getExercises = function(){
	return pageSession.get('set_exercises');
}

setSetType = function(setType) {
	pageSession.set('setType', setType);
}
