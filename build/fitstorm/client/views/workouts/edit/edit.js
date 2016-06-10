var pageSession = new ReactiveDict();

Template.WorkoutsEdit.rendered = function() {
	
};

Template.WorkoutsEdit.events({
	
});

Template.WorkoutsEdit.helpers({
	
});

Template.WorkoutsEditEditForm.rendered = function() {
	

	pageSession.set("workoutsEditEditFormInfoMessage", "");
	pageSession.set("workoutsEditEditFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.WorkoutsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("workoutsEditEditFormInfoMessage", "");
		pageSession.set("workoutsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var workoutsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(workoutsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("workoutsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("workouts", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("workoutsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Workouts.update({ _id: t.data.workout_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("workouts", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.WorkoutsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("workoutsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("workoutsEditEditFormErrorMessage");
	}
	
});
