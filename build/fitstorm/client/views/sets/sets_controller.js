this.SetsController = RouteController.extend({
	template: "Sets",
	

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
			Meteor.subscribe("set_list"),
			Meteor.subscribe("set_exercises", this.params.setId)
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		
		var typeQuery = this.params.query.type;

		var data = {
			params: this.params || {},
			set_list: ((typeof typeQuery != 'undefined') ? Sets.find({type: typeQuery}, {sort:[["setName","desc"]]}) : Sets.find({}, {sort:[["setName","desc"]]})),
			set_exercises: SetExercises.find({setId:this.params.setId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});