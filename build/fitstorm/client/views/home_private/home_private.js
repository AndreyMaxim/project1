Template.HomePrivate.rendered = function() {
};

Template.HomePrivate.events({
	"click .set-execution-btn" : function(e, t) {
		e.preventDefault();
		var _self = this;
		bootbox.dialog({
			message: "Are you ready to start?",
			title: "Confirmation",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Sets.update({ _id: _self._id}, {$inc: { preview_count: -1 }});
						Router.go("sets.live", {setId : _self._id});
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	}
});

Template.HomePrivate.helpers({
	
});
