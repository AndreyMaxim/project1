var verifyEmail = false;

Accounts.config({ sendVerificationEmail: verifyEmail });

Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}

	//
	// Setup OAuth login service configuration (read from Meteor.settings)
	//
	// Your settings file should look like this:
	//
	// {
	//     "oauth": {
	//         "google": {
	//             "clientId": "yourClientId",
	//             "secret": "yourSecret"
	//         },
	//         "github": {
	//             "clientId": "yourClientId",
	//             "secret": "yourSecret"
	//         }
	//     }
	// }
	//
	
	if ( Meteor.users.find().count() === 0 ) {
	    Accounts.createUser({
	        username: 'admin',
	        email: 'admin@smashbeats.com',
	        password: 'sm4shb34ts',
	        roles: ['admin'],
	        profile: {
	        	email: 'admin@smashbeats.com',
	            name: 'admin'
	        }
	    });

	}

	if(Exercises.find().fetch().length == 0) {
		var exercises = [
			{name: "Push ups", default_cue: Meteor.absoluteUrl() + "cues/Pushups3.wav"},
			{name: "Cluster Push ups", default_cue: Meteor.absoluteUrl() + "cues/Cluster Pushups2.wav"},
			{name: "Squats", default_cue: Meteor.absoluteUrl() + "cues/Squats2.wav"},
			{name: "Cluster Squats", default_cue: Meteor.absoluteUrl() + "cues/Cluster Squats1.wav"},
			{name: "Jump Squats", default_cue: Meteor.absoluteUrl() + "cues/JumpSquats2.wav"},
			{name: "Cluster Jump Squats", default_cue: Meteor.absoluteUrl() + "cues/ClusterJumpSquats3.wav"},
			{name: "Mountain climbers", default_cue: Meteor.absoluteUrl() + "cues/Mountainclimbers2.wav"},
			{name: "Sit ups", default_cue: Meteor.absoluteUrl() + "cues/Situps2.wav"},
			{name: "Crunches", default_cue: Meteor.absoluteUrl() + "cues/Crunches2.wav"},
			{name: "V ups", default_cue: Meteor.absoluteUrl() + "cues/Vups2.wav"},
			{name: "A frame push ups", default_cue: Meteor.absoluteUrl() + "cues/AFramePushups2.wav"},
			{name: "Burpees", default_cue: Meteor.absoluteUrl() + "cues/Burpees2.wav"},
			{name: "Hand release Burpees", default_cue: Meteor.absoluteUrl() + "cues/HandReleaseBurpees2.wav"},
			{name: "Dips", default_cue: Meteor.absoluteUrl() + "cues/Dips2.wav"},
			{name: "Lunges", default_cue: Meteor.absoluteUrl() + "cues/Lunges2.wav"},
			{name: "Iron cross", default_cue: Meteor.absoluteUrl() + "cues/IronCross2.wav"},
			{name: "Leg raises", default_cue: Meteor.absoluteUrl() + "cues/LegRaises1.wav"},
			{name: "Leg extensions", default_cue: Meteor.absoluteUrl() + "cues/LegExtensions2.wav"},
			{name: "Box jumps", default_cue: Meteor.absoluteUrl() + "cues/BoxJumps2.wav"},
			{name: "Plank", default_cue: Meteor.absoluteUrl() + "cues/Plank2.wav"},
			{name: "Burpee box jump", default_cue: Meteor.absoluteUrl() + "cues/BurpeeBoxJump3.wav"},
			{name: "Rest", default_cue: Meteor.absoluteUrl() + "cues/Rest3.wav"},
			{name: "Side plank", default_cue: Meteor.absoluteUrl() + "cues/SidePlank3.wav"},
			{name: "Rising Side plank - left", default_cue: Meteor.absoluteUrl() + "cues/RisingSidePlankL3.wav"},
			{name: "Rising Side plank - right", default_cue: Meteor.absoluteUrl() + "cues/RisingSidePlankR3.wav"},
			{name: "Silent", default_cue: null},
		];
		exercises.forEach(function(exercise){
			exercise.duration = 30;
			Exercises.insert(exercise);
		});
	}

	if(Accounts && Accounts.loginServiceConfiguration && Meteor.settings && Meteor.settings.oauth && _.isObject(Meteor.settings.oauth)) {
		// google
		if(Meteor.settings.oauth.google && _.isObject(Meteor.settings.oauth.google)) {
			// remove old configuration
			Accounts.loginServiceConfiguration.remove({
				service: "google"
			});

			var settingsObject = Meteor.settings.oauth.google;
			settingsObject.service = "google";

			// add new configuration
			Accounts.loginServiceConfiguration.insert(settingsObject);
		}
		// github
		if(Meteor.settings.oauth.github && _.isObject(Meteor.settings.oauth.github)) {
			// remove old configuration
			Accounts.loginServiceConfiguration.remove({
				service: "github"
			});

			var settingsObject = Meteor.settings.oauth.github;
			settingsObject.service = "github";

			// add new configuration
			Accounts.loginServiceConfiguration.insert(settingsObject);
		}
		// linkedin
		if(Meteor.settings.oauth.linkedin && _.isObject(Meteor.settings.oauth.linkedin)) {
			// remove old configuration
			Accounts.loginServiceConfiguration.remove({
				service: "linkedin"
			});

			var settingsObject = Meteor.settings.oauth.linkedin;
			settingsObject.service = "linkedin";

			// add new configuration
			Accounts.loginServiceConfiguration.insert(settingsObject);
		}
		// facebook
		if(Meteor.settings.oauth.facebook && _.isObject(Meteor.settings.oauth.facebook)) {
			// remove old configuration
			Accounts.loginServiceConfiguration.remove({
				service: "facebook"
			});

			var settingsObject = Meteor.settings.oauth.facebook;
			settingsObject.service = "facebook";

			// add new configuration
			Accounts.loginServiceConfiguration.insert(settingsObject);
		}
		// twitter
		if(Meteor.settings.oauth.twitter && _.isObject(Meteor.settings.oauth.twitter)) {
			// remove old configuration
			Accounts.loginServiceConfiguration.remove({
				service: "twitter"
			});

			var settingsObject = Meteor.settings.oauth.twitter;
			settingsObject.service = "twitter";

			// add new configuration
			Accounts.loginServiceConfiguration.insert(settingsObject);
		}
		// meteor
		if(Meteor.settings.oauth.meteor && _.isObject(Meteor.settings.oauth.meteor)) {
			// remove old configuration
			Accounts.loginServiceConfiguration.remove({
				service: "meteor-developer"
			});

			var settingsObject = Meteor.settings.oauth.meteor;
			settingsObject.service = "meteor-developer";

			// add new configuration
			Accounts.loginServiceConfiguration.insert(settingsObject);
		}
	}
});

Meteor.methods({
	"createUserAccount": function(options) {
		if(!Users.isAdmin(Meteor.userId())) {
			throw new Meteor.Error(403, "Access denied.");
		}

		var userOptions = {};
		if(options.username) userOptions.username = options.username;
		if(options.email) userOptions.email = options.email;
		if(options.password) userOptions.password = options.password;
		if(options.profile) userOptions.profile = options.profile;
		if(options.profile && options.profile.email) userOptions.email = options.profile.email;

		Accounts.createUser(userOptions);
	},
	"updateUserAccount": function(userId, options) {
		// only admin or users own profile
		if(!(Users.isAdmin(Meteor.userId()) || userId == Meteor.userId())) {
			throw new Meteor.Error(403, "Access denied.");
		}

		// non-admin user can change only profile
		if(!Users.isAdmin(Meteor.userId())) {
			var keys = Object.keys(options);
			if(keys.length !== 1 || !options.profile) {
				throw new Meteor.Error(403, "Access denied.");
			}
		}

		var userOptions = {};
		if(options.username) userOptions.username = options.username;
		if(options.email) userOptions.email = options.email;
		if(options.password) userOptions.password = options.password;
		if(options.profile) userOptions.profile = options.profile;

		if(options.profile && options.profile.email) userOptions.email = options.profile.email;
		if(options.roles) userOptions.roles = options.roles;

		if(userOptions.email) {
			var email = userOptions.email;
			delete userOptions.email;
			userOptions.emails = [{ address: email }];
		}

		var password = "";
		if(userOptions.password) {
			password = userOptions.password;
			delete userOptions.password;
		}

		if(userOptions) {
			for(var key in userOptions) {
				var obj = userOptions[key];
				if(_.isObject(obj)) {
					for(var k in obj) {
						userOptions[key + "." + k] = obj[k];
					}
					delete userOptions[key];
				}
			}
			Users.update(userId, { $set: userOptions });
		}

		if(password) {
			Accounts.setPassword(userId, password);
		}
	},

	"sendMail": function(options) {
		this.unblock();

		Email.send(options);
	}
});

Accounts.onCreateUser(function (options, user) {
	if(options.roles && options.roles.indexOf('admin') > -1) {
		user.roles = options.roles;
	}else {
		user.roles = [];
	}

	if(options.profile) {
		user.profile = options.profile;
	}

	
	return user;
});

Accounts.validateLoginAttempt(function(info) {

	// reject users with role "blocked"
	if(info.user && Users.isInRole(info.user._id, "blocked")) {
		throw new Meteor.Error(403, "Your account is blocked.");
	}

  if(verifyEmail && info.user && info.user.emails && info.user.emails.length && !info.user.emails[0].verified ) {
			throw new Meteor.Error(499, "E-mail not verified.");
  }

	return true;
});


Users.before.insert(function(userId, doc) {
	if(doc.emails && doc.emails[0] && doc.emails[0].address) {
		doc.profile = doc.profile || {};
		doc.profile.email = doc.emails[0].address;
	} else {
		// oauth
		if(doc.services) {
			// google e-mail
			if(doc.services.google && doc.services.google.email) {
				doc.profile = doc.profile || {};
				doc.profile.email = doc.services.google.email;
			} else {
				// github e-mail
				if(doc.services.github && doc.services.github.accessToken) {
					var github = new GitHub({
						version: "3.0.0",
						timeout: 5000
					});

					github.authenticate({
						type: "oauth",
						token: doc.services.github.accessToken
					});

					try {
						var result = github.user.getEmails({});
						var email = _.findWhere(result, { primary: true });
						if(!email && result.length && _.isString(result[0])) {
							email = { email: result[0] };
						}

						if(email) {
							doc.profile = doc.profile || {};
							doc.profile.email = email.email;
						}
					} catch(e) {
						console.log(e);
					}
				} else {
					// linkedin email
					if(doc.services.linkedin && doc.services.linkedin.emailAddress) {
						doc.profile = doc.profile || {};
						doc.profile.name = doc.services.linkedin.firstName + " " + doc.services.linkedin.lastName;
						doc.profile.email = doc.services.linkedin.emailAddress;
					} else {
						if(doc.services.facebook && doc.services.facebook.email) {
							doc.profile = doc.profile || {};
							doc.profile.email = doc.services.facebook.email;
						} else {
							if(doc.services.twitter && doc.services.twitter.email) {
								doc.profile = doc.profile || {};
								doc.profile.email = doc.services.twitter.email;
							} else {
								if(doc.services["meteor-developer"] && doc.services["meteor-developer"].emails && doc.services["meteor-developer"].emails.length) {
									doc.profile = doc.profile || {};
									doc.profile.email = doc.services["meteor-developer"].emails[0].address;
								}
							}
						}
					}
				}
			}
		}
	}
});

Users.before.update(function(userId, doc, fieldNames, modifier, options) {
	if(modifier.$set && modifier.$set.emails && modifier.$set.emails.length && modifier.$set.emails[0].address) {
		modifier.$set.profile.email = modifier.$set.emails[0].address;
	}
});

Accounts.onLogin(function (info) {
	
});

Accounts.urls.resetPassword = function (token) {
	return Meteor.absoluteUrl('reset_password/' + token);
};

Accounts.urls.verifyEmail = function (token) {
	return Meteor.absoluteUrl('verify_email/' + token);
};
