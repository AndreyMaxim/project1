var pageSession = new ReactiveDict();

Template.SetsInsert.rendered = function() {
	
};

Template.SetsInsert.events({
	
});

Template.SetsInsert.helpers({
	
});

Template.SetsInsertInsertForm.rendered = function() {
	

	pageSession.set("setsInsertInsertFormInfoMessage", "");
	pageSession.set("setsInsertInsertFormErrorMessage", "");

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

Template.SetsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("setsInsertInsertFormInfoMessage", "");
		pageSession.set("setsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var setsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(setsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("setsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("sets.details", {setId: newId});
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
				

				newId = Sets.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("sets", {});
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

Template.SetsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("setsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("setsInsertInsertFormErrorMessage");
	}
	
});
