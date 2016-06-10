this.WorkoutsController = RouteController.extend({
	template: "Workouts",
	

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
			Meteor.subscribe("workout_list"),
			Meteor.subscribe("set_list")
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
			workout_list: Workouts.find({}, {transform:function(doc) { var sum = 0, set_ids = _.pluck(doc.sets, '_id'); Sets.find({ _id: {$in: set_ids} }).map(function(item) { if(item.setDuration) sum += item.setDuration; }); doc.workoutDuration = sum; return doc; },sort:["name"]}),
			set_list: Sets.find({}, {sort:[["setName","desc"]]})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});