this.WorkoutsLiveController = RouteController.extend({
	template: "WorkoutsLive",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},
	isReady: function() {
		

		var subs = [
			Meteor.subscribe('workout_details', this.params.workoutId),
			Meteor.subscribe('set_list'),
			Meteor.subscribe('exercises_all')
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {

		var data = {
			params: this.params || {},
			workout_details: Workouts.findOne({_id: this.params.workoutId}),
			set_list: Sets.find({}),
			exercises_all: SetExercises.find({})
		};
		
		return data;
	},

	onAfterAction: function() {
		
	}
});