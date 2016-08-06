var pageSession = new ReactiveDict();

Template.Register.rendered = function() {
	pageSession.set("errorMessage", "");
	pageSession.set("verificationEmailSent", false);

	
	Meteor.defer(function() {
		$("input[autofocus]").focus();
	});

};

Template.Register.created = function() {
	pageSession.set("errorMessage", "");
};

Template.Register.events({
	'submit #register_form' : function(e, t) {
		e.preventDefault();

		var submit_button = $(t.find(":submit"));

		var register_name = t.find('#register_name').value.trim();
		var register_email = t.find('#register_email').value.trim();
		var register_password = t.find('#register_password').value;

		// check name
		if(register_name == "")
		{
			pageSession.set("errorMessage", "Please enter your name.");
			t.find('#register_name').focus();
			return false;
		}

		// check email
		if(!isValidEmail(register_email))
		{
			pageSession.set("errorMessage", "Please enter valid e-mail address.");
			t.find('#register_email').focus();
			return false;
		}

		// check password
		var min_password_len = 6;
		if(!isValidPassword(register_password, min_password_len))
		{
			pageSession.set("errorMessage", "Your password must be at least " + min_password_len + " characters long.");
			t.find('#register_password').focus();
			return false;
		}

		submit_button.button("loading");
		Accounts.createUser({email: register_email, password : register_password, profile: { name: register_name }}, function(err) {
			submit_button.button("reset");
			if(err) {
				if(err.error === 499) {
					pageSession.set("verificationEmailSent", true);
				} else {
					pageSession.set("errorMessage", err.message);
				}
			}
			else
			{
				pageSession.set("errorMessage", "");
				pageSession.set("verificationEmailSent", true);
				saveFreeSets();
			}
		});
		return false;
	},

	"click .go-home": function(e, t) {
		Router.go("/");
	}
	
});

Template.Register.helpers({
	errorMessage: function() {
		return pageSession.get("errorMessage");
	},
	verificationEmailSent: function() {
		return pageSession.get("verificationEmailSent");
	}
	
});

saveFreeSets = function() {
		var songUrl = Meteor.absoluteUrl() + "songs/free-song-1.mp3";
		set_one_id = Sets.insert({setName: 'free set one', type: 'Interval', songUrl: songUrl, isDefault: true});
		set_one_exercises = [
			{exercise: "Silent"},
			{exercise: "Push ups"},
			{exercise: "Mountain climbers"},
			{exercise: "Push ups"},
			{exercise: "Mountain climbers"},
			{exercise: "Push ups"},
			{exercise: "Mountain climbers"},
			{exercise: "Rest"},
			{exercise: "Iron cross"},
			{exercise: "Leg raises"},
			{exercise: "Iron cross"},
			{exercise: "Leg raises"},
			{exercise: "Iron cross"},
			{exercise: "Leg raises"},
			{exercise: "Rest"},
			{exercise: "Squats"},
			{exercise: "Burpees"},
			{exercise: "Squats"},
			{exercise: "Burpees"},
			{exercise: "Squats"},
			{exercise: "Burpees"},
			{exercise: "Rest"}
		];
		set_one_exercises.forEach(function(obj) {
			e = Exercises.findOne({name: obj.exercise});
			obj.duration = 10;
			obj.ownerId  = Meteor.userId();
			obj.setId    = set_one_id;
			obj.exerciseId = e._id;
			SetExercises.insert(obj);
		});
	set_two_id = Sets.insert({setName: 'Set 1 Copy', type: 'Interval', songUrl: songUrl, isDefault: true});
	set_two_exercises = [
		{exercise: "Silent"},
		{exercise: "Push ups"},
		{exercise: "Mountain climbers"},
		{exercise: "Push ups"},
		{exercise: "Mountain climbers"},
		{exercise: "Push ups"},
		{exercise: "Mountain climbers"},
		{exercise: "Rest"},
		{exercise: "Iron cross"},
		{exercise: "Leg raises"},
		{exercise: "Iron cross"},
		{exercise: "Leg raises"},
		{exercise: "Iron cross"},
		{exercise: "Leg raises"},
		{exercise: "Rest"},
		{exercise: "Squats"},
		{exercise: "Burpees"},
		{exercise: "Squats"},
		{exercise: "Burpees"},
		{exercise: "Squats"},
		{exercise: "Burpees"},
		{exercise: "Rest"}
	];
	set_two_exercises.forEach(function(obj) {
		e = Exercises.findOne({name: obj.exercise});
		obj.duration = 10;
		obj.ownerId  = Meteor.userId();
		obj.setId    = set_two_id;
		obj.exerciseId = e._id;
		SetExercises.insert(obj);
	});
	set_3_id = Sets.insert({setName: 'Set 1 Copy2', type: 'Interval', songUrl: songUrl, isDefault: true});
	set_3_exercises = [
		{exercise: "Silent"},
		{exercise: "Push ups"},
		{exercise: "Mountain climbers"},
		{exercise: "Push ups"},
		{exercise: "Mountain climbers"},
		{exercise: "Push ups"},
		{exercise: "Mountain climbers"},
		{exercise: "Rest"},
		{exercise: "Iron cross"},
		{exercise: "Leg raises"},
		{exercise: "Iron cross"},
		{exercise: "Leg raises"},
		{exercise: "Iron cross"},
		{exercise: "Leg raises"},
		{exercise: "Rest"},
		{exercise: "Squats"},
		{exercise: "Burpees"},
		{exercise: "Squats"},
		{exercise: "Burpees"},
		{exercise: "Squats"},
		{exercise: "Burpees"},
		{exercise: "Rest"}
	];
	set_3_exercises.forEach(function(obj) {
		e = Exercises.findOne({name: obj.exercise});
		obj.duration = 10;
		obj.ownerId  = Meteor.userId();
		obj.setId    = set_3_id;
		obj.exerciseId = e._id;
		SetExercises.insert(obj);
	});

}
