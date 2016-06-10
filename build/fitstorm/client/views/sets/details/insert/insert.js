var pageSession = new ReactiveDict();

Template.SetsDetailsInsert.rendered = function() {
	
};

Template.SetsDetailsInsert.events({
	
});

Template.SetsDetailsInsert.helpers({
	
});

Template.SetsDetailsInsertInsertForm.rendered = function() {
	

	pageSession.set("setsDetailsInsertInsertFormInfoMessage", "");
	pageSession.set("setsDetailsInsertInsertFormErrorMessage", "");

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

Template.SetsDetailsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("setsDetailsInsertInsertFormInfoMessage", "");
		pageSession.set("setsDetailsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var setsDetailsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(setsDetailsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("setsDetailsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("sets.details", {setId: self.params.setId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("setsDetailsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				values.setId = self.params.setId;

				newId = SetExercises.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("sets.details", {setId: this.params.setId});
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

Template.SetsDetailsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("setsDetailsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("setsDetailsInsertInsertFormErrorMessage");
	}
	
});
