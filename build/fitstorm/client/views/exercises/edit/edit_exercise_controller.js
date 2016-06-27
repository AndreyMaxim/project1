this.EditExerciseController = RouteController.extend({
	template: "EditExercise",
	

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
			Meteor.subscribe('exercise_details', this.params.exerciseId),
			Meteor.subscribe('records'),
			Meteor.subscribe('songs')
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
			exercise_details: Exercises.findOne({_id: this.params.exerciseId}, {}),
			records: Records.find({}, {}),
			songs: Songs.find({}, {})
		};
		
		return data;
	},

	onAfterAction: function() {
		
	}
});