var pageSession = new ReactiveDict(),
	params = [];
	
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
	
	pageSession.set('exercises', set_exercises);
	pageSession.set('exerciseAction', null);
	pageSession.set('hasExercises', set_exercises.length);
};

Template.AddExercises.helpers({
	"exerciseAction" : function(){
		return pageSession.get('exerciseAction');
	},
	"hasExercises" : function() {
		return pageSession.get('hasExercises') && !pageSession.get('exerciseAction');
	},
	"getExercises" : function() {
		return pageSession.get('exercises');
	},
	"getSelectValue": function() {
		action = pageSession.get('exerciseAction'); 
		if(action && action.indexOf('Edit') > -1) {
			return getValue(pageSession.get('selectedExercise'), 'exercise');
		}else {
			return 'Push-up';
		}
	},
	"getDurationValue" : function(){
		action = pageSession.get('exerciseAction'); 
		if(action && action.indexOf('Edit') > -1){
			return getValue(pageSession.get('selectedExercise'), 'duration');
		}else{
			return 30;
		}
	},
	"getLabel" : function(){
		var setType = pageSession.get('setType');
		if(setType.indexOf('AMRAP') > -1) {
			return 'Rep/Quantity';
		}
		return 'Duration';
	}
});

Template.AddExercises.events({
	"click .save-exercise" : function(e) 
	{
		var exercises 	 = pageSession.get('exercises'),
			action       = pageSession.get('exerciseAction'),
			selectedExercise = pageSession.get('selectedExercise'),
			newExercise  = 
					{
						'exercise' : $('#select-exercise').val(),
						'duration' : parseFloat($('#exercise-duration').val()),
						'setId'	   : params.setId
					};

		if(action.indexOf('Add') > -1){
			newId = SetExercises.insert(newExercise);
			newExercise._id = newId;

			exercises.push(newExercise);
		}else {
			SetExercises.update(
				{_id: selectedExercise[0]._id},
				{$set: {
			        'exercise': newExercise.exercise,
			        'duration': newExercise.duration
			    }
			});
			index = _.pluck(exercises, '_id').indexOf(selectedExercise[0]._id);
			exercises[index] = newExercise;
		}
		pageSession.set('exerciseAction', null);
		pageSession.set('hasExercises', exercises.length);
		pageSession.set('exercises', exercises);
	},
	"click .add-exercise" : function() {
		pageSession.set('exerciseAction', 'Add');
	},
	"click .cancel-exercise": function() {
		pageSession.set('exerciseAction', null);
	},
	"click .edit-exercise": function(e, t) {
		var $targetId = $(e.target).parent().data('id');
		setExercise = $.grep(pageSession.get('exercises'), function(exrcse){ return exrcse._id == $targetId; });
		pageSession.set('exerciseAction', 'Edit');
		pageSession.set('selectedExercise', setExercise);
	},
	"click .delete-exercise": function(e) {
		var $targetId    = $(e.target).parent().data('id'),
			exercises  = pageSession.get('exercises');

		exercises = _.reject(exercises, function(obj){ return obj._id == $targetId; });
		SetExercises.remove($targetId);
		pageSession.set('exerciseAction', null);
		pageSession.set('exercises', exercises);
		pageSession.set('hasExercises', exercises.length);
	}
});

getValue = function(obj, index){
	return obj[0][index];
}
getExercises = function(){
	return pageSession.get('exercises');
}

setSetType = function(setType) {
	pageSession.set('setType', setType);
}
