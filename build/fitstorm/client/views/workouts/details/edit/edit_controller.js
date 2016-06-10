this.WorkoutsDetailsEditController = RouteController.extend({
	template: "WorkoutsDetails",
	

	yieldTemplates: {
		'WorkoutsDetailsEdit': { to: 'WorkoutsDetailsSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("WorkoutsDetails"); this.render("loading", { to: "WorkoutsDetailsSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("set_details", this.params.setId),
			Meteor.subscribe("workout_details", this.params.workoutId),
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
			set_details: Sets.findOne({_id:this.params.setId}, {}),
			workout_details: Workouts.findOne({_id:this.params.workoutId}, {transform:function(doc) { var sum = 0, set_ids = _.pluck(doc.sets, '_id'); Sets.find({ _id: {$in: set_ids} }).map(function(item) { if(item.setDuration) sum += item.setDuration; }); doc.workoutDuration = sum; return doc; }}),
			set_list: Sets.find({}, {sort:[["setName","desc"]]})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});