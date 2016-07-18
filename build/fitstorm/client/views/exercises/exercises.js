var pageSession = new ReactiveDict();

Template.ExercisesView.rendered = function(){
	pageSession.set("ExercisesViewStyle", "table");
};

Template.ExercisesView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("ExercisesViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("ExercisesViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("ExercisesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("exercises.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		SetsViewExport(this.set_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		SetsViewExport(this.set_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		SetsViewExport(this.set_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		SetsViewExport(this.set_list, "json");
	}

	
});

Template.ExercisesViewTable.helpers({
	"tableItems": function(){
		return ExercisesViewItems(this.exercises);
	}
});

Template.ExercisesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Exercises.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},
	"deleteButtonClass": function() {
		return Exercises.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

Template.ExercisesViewTableItems.events({
	"click #edit-button" : function(e, t){
		e.preventDefault();
		Router.go("exercises.edit", {exerciseId: this._id});
		return false;
	},
	"click #delete-button" : function(e, t) {
		e.preventDefault();
		var self = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Exercises.remove(self._id);
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	}
});

Template.ExercisesView.helpers({
	"insertButtonClass": function() {
		return Exercises.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.exercises || this.exercises.count() == 0;
	},
	"isNotEmpty": function() {
		return this.exercises && this.exercises.count() > 0;
	},
	"isNotFound": function() {
		return this.exercises && pageSession.get("ExercisesViewSearchString") && ExercisesViewItems(this.exercises).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ExercisesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ExercisesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ExercisesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ExercisesViewStyle") == "gallery";
	}
});

var SetsViewExport = function(cursor, fileType) {
	var data = ExercisesViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
};

var ExercisesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ExercisesViewSearchString");
	var sortBy = pageSession.get("ExercisesViewSortBy");
	var sortAscending = pageSession.get("SetsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "duration"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};
