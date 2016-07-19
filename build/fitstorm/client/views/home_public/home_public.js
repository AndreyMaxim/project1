Template.HomePublic.rendered = function() {
	
};

Template.HomePublic.events({
	
});

Template.HomePublic.helpers({
	
});

Template.HomePublicHomeJumbotron.rendered = function() {
};

Template.HomePublicHomeJumbotron.created = function() {
	
};

Template.HomePublicHomeJumbotron.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("login", {});
	},
	"click, touchstart  .video-wrapper" : function() {
		var video = document.getElementById('logo-vid');
		if(video.paused) {
			video.play();
		}
	}
});

Template.HomePublicHomeJumbotron.helpers({
	
});
