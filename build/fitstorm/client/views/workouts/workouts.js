var pageSession = new ReactiveDict();

Template.Workouts.rendered = function() {
	
};

Template.Workouts.events({
	
});

Template.Workouts.helpers({
	
});

var WorkoutsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("WorkoutsViewSearchString");
	var sortBy = pageSession.get("WorkoutsViewSortBy");
	var sortAscending = pageSession.get("WorkoutsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "note", "workoutDuration", "publish"];
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

var WorkoutsViewExport = function(cursor, fileType) {
	var data = WorkoutsViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.WorkoutsView.rendered = function() {
	pageSession.set("WorkoutsViewStyle", "table");
	
};

Template.WorkoutsView.events({
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
				pageSession.set("WorkoutsViewSearchString", searchString);
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
					pageSession.set("WorkoutsViewSearchString", searchString);
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
					pageSession.set("WorkoutsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("workouts.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		WorkoutsViewExport(this.workout_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		WorkoutsViewExport(this.workout_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		WorkoutsViewExport(this.workout_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		WorkoutsViewExport(this.workout_list, "json");
	}

	
});

Template.WorkoutsView.helpers({

	"insertButtonClass": function() {
		return Workouts.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.workout_list || this.workout_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.workout_list && this.workout_list.count() > 0;
	},
	"isNotFound": function() {
		return this.workout_list && pageSession.get("WorkoutsViewSearchString") && WorkoutsViewItems(this.workout_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("WorkoutsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("WorkoutsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("WorkoutsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("WorkoutsViewStyle") == "gallery";
	}

	
});


Template.WorkoutsViewTable.rendered = function() {
	
};

Template.WorkoutsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("WorkoutsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("WorkoutsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("WorkoutsViewSortAscending") || false;
			pageSession.set("WorkoutsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("WorkoutsViewSortAscending", true);
		}
	}
});

Template.WorkoutsViewTable.helpers({
	"tableItems": function() {
		return WorkoutsViewItems(this.workout_list);
	}
});


Template.WorkoutsViewTableItems.rendered = function() {
	
};

Template.WorkoutsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("workouts.details", {workoutId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Workouts.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Workouts.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("workouts.edit", {workoutId: this._id});
		return false;
	}
});

Template.WorkoutsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Workouts.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Workouts.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
