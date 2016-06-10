var pageSession = new ReactiveDict();

Template.SetsDetailsEdit.rendered = function() {
	
};

Template.SetsDetailsEdit.events({
	
});

Template.SetsDetailsEdit.helpers({
	
});

Template.SetsDetailsEditEditForm.rendered = function() {
	

	pageSession.set("setsDetailsEditEditFormInfoMessage", "");
	pageSession.set("setsDetailsEditEditFormErrorMessage", "");

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

Template.SetsDetailsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("setsDetailsEditEditFormInfoMessage", "");
		pageSession.set("setsDetailsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var setsDetailsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(setsDetailsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("setsDetailsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("sets.details", {setId: self.params.setId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("setsDetailsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				SetExercises.update({ _id: t.data.set_item._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.SetsDetailsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("setsDetailsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("setsDetailsEditEditFormErrorMessage");
	}
	
});
