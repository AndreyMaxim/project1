var pageSession = new ReactiveDict();

Template.WorkoutsInsert.rendered = function() {
	
};

Template.WorkoutsInsert.events({
	
});

Template.WorkoutsInsert.helpers({
	
});

Template.WorkoutsInsertInsertForm.rendered = function() {
	

	pageSession.set("workoutsInsertInsertFormInfoMessage", "");
	pageSession.set("workoutsInsertInsertFormErrorMessage", "");

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

Template.WorkoutsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("workoutsInsertInsertFormInfoMessage", "");
		pageSession.set("workoutsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var workoutsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(workoutsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("workoutsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("workouts", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("workoutsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Workouts.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.WorkoutsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("workoutsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("workoutsInsertInsertFormErrorMessage");
	}
	
});
