var pageSession = new ReactiveDict(),
	params = [];
Template.SetsEdit.rendered = function() {
	
};

Template.SetsEdit.events({
	
});

Template.SetsEdit.helpers({
	
});

Template.SetsEditEditForm.rendered = function() {
	
	pageSession.set("setType", this.data.set_details.type);
	pageSession.set("setsEditEditFormInfoMessage", "");
	pageSession.set("setsEditEditFormErrorMessage", "");

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

Template.SetsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("setsEditEditFormInfoMessage", "");
		pageSession.set("setsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var setsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(setsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("setsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("sets", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("setsEditEditFormErrorMessage", message);
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
	"change .setType-field": function(e){
		pageSession.set("setType", e.target.value);
		setSetType(e.target.value);
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

Template.SetsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("setsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("setsEditEditFormErrorMessage");
	},
	"amrapCustomClass":function() {
		var setType = pageSession.get('setType'),
			customClass = 'hidden';
		if(setType && setType.indexOf('AMRAP') > -1) {
			customClass = '';
		}
		return customClass;
	},
	"intervalCustomClass": function(){
		var setType = pageSession.get('setType'),
			customClass = 'hidden';
		
		if(setType) {
			needsAudioUpload = setType.indexOf('Interval') > -1 || 
							   setType.indexOf('EMOM') > -1 ||
							   setType.indexOf('Tabata') > -1;

			if(needsAudioUpload) customClass = '';
			
		}
		return customClass;
	},
});