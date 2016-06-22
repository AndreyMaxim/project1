this.SetsInsertController = RouteController.extend({
	template: "SetsInsert",
	

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
			Meteor.subscribe("sets_empty"),
			Meteor.subscribe("set_list"),
			Meteor.subscribe("exercises"),
			Meteor.subscribe("records")
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
			sets_empty: Sets.findOne({_id:null}, {}),
			set_list: Sets.find({}, {sort:[["setName","desc"]]}),
			exercises: Exercises.find({},{}),
			records: Records.find()
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});