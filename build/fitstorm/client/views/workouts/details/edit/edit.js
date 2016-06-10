var pageSession = new ReactiveDict();

Template.WorkoutsDetailsEdit.rendered = function() {
	
};

Template.WorkoutsDetailsEdit.events({
	
});

Template.WorkoutsDetailsEdit.helpers({
	
});

Template.WorkoutsDetailsEditEditForm.rendered = function() {
	

	pageSession.set("workoutsDetailsEditEditFormInfoMessage", "");
	pageSession.set("workoutsDetailsEditEditFormErrorMessage", "");

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

Template.WorkoutsDetailsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("workoutsDetailsEditEditFormInfoMessage", "");
		pageSession.set("workoutsDetailsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var workoutsDetailsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(workoutsDetailsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("workoutsDetailsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("workouts.details", {workoutId: self.params.workoutId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("workoutsDetailsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Sets.update({ _id: t.data.set_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("workouts.details", {workoutId: this.params.workoutId});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}, 

	"change #field-song-id": function(e, t) {
	e.preventDefault();
	var fileInput = $(e.currentTarget);
	var dataField = fileInput.attr("data-field");
	var hiddenInput = fileInput.closest("form").find("input[name='" + dataField + "']");

	FS.Utility.eachFile(event, function(file) {
		Songs.insert(file, function (err, fileObj) {
			if(err) {
				console.log(err);
			} else {
				hiddenInput.val(fileObj._id);
			}
		});
	});
}

});

Template.WorkoutsDetailsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("workoutsDetailsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("workoutsDetailsEditEditFormErrorMessage");
	}
	
});
