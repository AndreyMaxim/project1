this.HomePrivateController = RouteController.extend({
	template: "HomePrivate",
	

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
			Meteor.subscribe("exercises_all")
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
			set_list: Sets.find({},{ transform: function(doc){ doc.set_exercises_joined = SetExercises.find({setId: doc._id}).fetch(); return doc; }},{sort:[["setName","desc"]]}),
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});