var pageSession = new ReactiveDict();

Template.WorkoutsDetails.rendered = function() {
	
};

Template.WorkoutsDetails.events({
	
});

Template.WorkoutsDetails.helpers({
	
});

Template.WorkoutsDetailsDetailsForm.rendered = function() {
	

	pageSession.set("workoutsDetailsDetailsFormInfoMessage", "");
	pageSession.set("workoutsDetailsDetailsFormErrorMessage", "");

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

Template.WorkoutsDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("workoutsDetailsDetailsFormInfoMessage", "");
		pageSession.set("workoutsDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var workoutsDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(workoutsDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("workoutsDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("workoutsDetailsDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		Router.go("workouts", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("workouts", {});
	}

	
});

Template.WorkoutsDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("workoutsDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("workoutsDetailsDetailsFormErrorMessage");
	}
	
});
