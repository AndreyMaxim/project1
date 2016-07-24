var pageSession = new ReactiveDict();

Template.WorkoutsLive.rendered = function() {
};

Template.WorkoutsLive.events({
	
});

Template.WorkoutsLive.helpers({
	isActive: function(index){
		if(index == 0){
			return 'active';
		}
		return '';
	}
});

Template.registerHelper('getWorkoutSets', function (workout) {
	var sets = Sets.find({_id:
		{$in: _.pluck(workout.sets, '_id')}},
		{transform: function(doc) {
			doc.createdAt = moment(doc.createdAt).format('MMMM DD, YYYY');  
			doc.setName = doc.setName.toUpperCase();
			setExercises = SetExercises.find({setId: doc._id}).fetch();
			doc.set_exercises_joined = isTabata(doc.type) ? setTabataExercises(setExercises, doc._id) : setExercises;
			return doc;
		}}).fetch();
	pageSession.set('sets', sets);
	return sets;
});
