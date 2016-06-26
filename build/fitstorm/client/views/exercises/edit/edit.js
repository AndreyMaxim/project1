var pageSession = new ReactiveDict();

Template.EditExercise.rendered = function(){
	pageSession.set('isRecording', false);
	pageSession.set('record_ids', []);
};

Template.EditExercise.helpers({
	"isRecording": function() {
		return pageSession.get('isRecording');
	}
});


Template.EditExercise.events({
	"click #form-cancel-button": function() {
		Router.go("exercises");
	},
	"click #record-cue-start": function() {
		pageSession.set('isRecording', true);
		var record_ids = pageSession.get('record_ids');
		if(Records.ready()) {
			Records.startRecording({},function(err, id) {
				if(!err) {
					record_ids.push({id: id});
					pageSession.set('record_ids', record_ids);
				}
			});
		}
	},
	"click #record-cue-stop": function() {
		pageSession.set('isRecording', false);
		Records.stopRecording();
	},
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("exercisesInsertInsertFormInfoMessage", "");
		pageSession.set("exercisesInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var exercisesInsertInsertFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(exercisesInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("exercisesInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exercises");
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("setsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {

				Exercises.update({ _id: t.data.exercise_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });

				_.each(pageSession.get('record_ids'), function(record) {
					Records
						.findOne(record.id)
						.update({
							$set: {
								'exerciseId': t.data.exercise_details._id
							}
						});
				});
			}
		);

		return false;
	},
});