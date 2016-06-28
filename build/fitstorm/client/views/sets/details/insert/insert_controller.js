this.SetsDetailsInsertController = RouteController.extend({
	template: "SetsDetails",
	

	yieldTemplates: {
		'SetsDetailsInsert': { to: 'SetsDetailsSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("SetsDetails"); this.render("loading", { to: "SetsDetailsSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("exercises_empty"),
			Meteor.subscribe("set_details", this.params.setId),
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
			exercises_empty: SetExercises.findOne({_id:null}, {}),
			set_details: Sets.findOne({_id:this.params.setId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});