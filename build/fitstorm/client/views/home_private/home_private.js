Template.HomePrivate.rendered = function() {
	
};


Template.HomePrivate.created = function() {
	this.voice = new ReactiveVar('English');
};

Template.HomePrivate.events({
	"click .set-execution-btn, click .buy-set-btn" : function(e, t) {
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
	},
	"click .voice-option-btn": function() {
		$('#voice-option-modal').modal({show: true});
	}
});

Template.HomePrivate.helpers({
	getTitle : function() {
		return this.songDetail ? this.songDetail.original.name : this.setName;
	},
	getVoiceOption: function(){
		return Template.instance().voice.get();
	},
	hasPreviewCredits: function() {
		return (this.preview_count > 0);
	}
});

Template.VoiceOptionModal.events({
	"click .done" : function() {
		$('#voice-option-modal').modal("hide");
	}
})
