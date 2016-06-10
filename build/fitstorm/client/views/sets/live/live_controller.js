this.SetsLiveController = RouteController.extend({
	template: "SetsLive",
	

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
			Meteor.subscribe('set_details', this.params.setId),
			Meteor.subscribe('set_exercises', this.params.setId),
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
			set_details   : Sets.findOne({ _id: this.params.setId }), 
			set_exercises : SetExercises.find({ setId: this.params.setId })
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});