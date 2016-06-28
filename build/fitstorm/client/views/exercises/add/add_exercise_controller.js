this.InsertExerciseController = RouteController.extend({
	template: "InsertExercise",
	

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
			Meteor.subscribe('new_exercise'),
			Meteor.subscribe('records'),
			Meteor.subscribe('song_list')
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
			exercises: Exercises.find({_id: null}, {}),
			records: Records.find({}, {})
		};
		
		return data;
	},

	onAfterAction: function() {
		
	}
});