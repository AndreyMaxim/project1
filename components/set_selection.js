var pageSession = new ReactiveDict(),
	sets         = [],
	workout_sets = [],
	details      = [];

Template.MultipleSetSelection.onCreated(function()
{
	details = this.data.workout_details;
	workout_sets = details.sets || [];
	sets = _.reject(this.data.set_list.fetch(), function(set){
		return _.contains(_.pluck(workout_sets, '_id'), set._id);
	});
	pageSession.set('sets', sets);
	pageSession.set('workout_sets', workout_sets);
});

Template.MultipleSetSelection.events({
	'click .add-set' : function(e) {
		var $selectedItem    = $('#multiple-set-selection').find('option:selected'),
			selectedItemId   = $selectedItem.val(),
			selectedItemName = $selectedItem.text();
		
		if(selectedItemId != -1) {
			workout_sets.push({'_id' : selectedItemId, 'setName' : selectedItemName.trim()});
			sets = updateList(sets, selectedItemId);
			updateWorkout();
		}
	},
	'click .remove-set' : function(e) {
		var setId   = $(e.target).data('set-id'),
			setName = $(e.target).data('set-name');
			
		sets.push({'_id' : setId, 'setName' : setName.trim()});
		workout_sets = updateList(workout_sets, setId);
		updateWorkout();
	}
});

Template.MultipleSetSelection.helpers({
	sets: function() {
		return pageSession.get('sets');
	},
	hasWorkoutSets: function() {
		var workout_sets = pageSession.get('workout_sets');
		return workout_sets.length;
	},
	workoutSets: function() {
		return pageSession.get('workout_sets');
	},
	isOwner: function(){
		return (Meteor.userId() == details.ownerId);
	}
});

updateList = function(obj, selectedId){
	return _.reject(obj, function(el) {
		return (el._id.indexOf(selectedId) > -1);
	});
};

updateWorkout = function(){
	Workouts.update({ 
	    _id: details._id
	}, {
	    $set: { 
	        'sets': workout_sets
	    }
	});
	pageSession.set('workout_sets', workout_sets);
	pageSession.set('sets', sets);
};

Template.registerHelper('incremented', function (index) {
    index++;
    return index;
});
