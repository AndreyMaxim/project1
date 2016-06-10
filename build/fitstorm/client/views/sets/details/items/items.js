var pageSession = new ReactiveDict();

Template.SetsDetailsItems.rendered = function() {
	
};

Template.SetsDetailsItems.events({
	
});

Template.SetsDetailsItems.helpers({
	
});

var SetsDetailsItemsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("SetsDetailsItemsViewSearchString");
	var sortBy = pageSession.get("SetsDetailsItemsViewSortBy");
	var sortAscending = pageSession.get("SetsDetailsItemsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["exercise", "duration"];
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

var SetsDetailsItemsViewExport = function(cursor, fileType) {
	var data = SetsDetailsItemsViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.SetsDetailsItemsView.rendered = function() {
	pageSession.set("SetsDetailsItemsViewStyle", "table");
	
};

Template.SetsDetailsItemsView.events({
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
				pageSession.set("SetsDetailsItemsViewSearchString", searchString);
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
					pageSession.set("SetsDetailsItemsViewSearchString", searchString);
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
					pageSession.set("SetsDetailsItemsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("sets.details.insert", {setId: this.params.setId});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		SetsDetailsItemsViewExport(this.set_exercises, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		SetsDetailsItemsViewExport(this.set_exercises, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		SetsDetailsItemsViewExport(this.set_exercises, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		SetsDetailsItemsViewExport(this.set_exercises, "json");
	}

	
});

Template.SetsDetailsItemsView.helpers({

	"insertButtonClass": function() {
		return SetExercises.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.set_exercises || this.set_exercises.count() == 0;
	},
	"isNotEmpty": function() {
		return this.set_exercises && this.set_exercises.count() > 0;
	},
	"isNotFound": function() {
		return this.set_exercises && pageSession.get("SetsDetailsItemsViewSearchString") && SetsDetailsItemsViewItems(this.set_exercises).length == 0;
	},
	"searchString": function() {
		return pageSession.get("SetsDetailsItemsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("SetsDetailsItemsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("SetsDetailsItemsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("SetsDetailsItemsViewStyle") == "gallery";
	}

	
});


Template.SetsDetailsItemsViewTable.rendered = function() {
	
};

Template.SetsDetailsItemsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("SetsDetailsItemsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("SetsDetailsItemsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("SetsDetailsItemsViewSortAscending") || false;
			pageSession.set("SetsDetailsItemsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("SetsDetailsItemsViewSortAscending", true);
		}
	}
});

Template.SetsDetailsItemsViewTable.helpers({
	"tableItems": function() {
		return SetsDetailsItemsViewItems(this.set_exercises);
	}
});


Template.SetsDetailsItemsViewTableItems.rendered = function() {
	
};

Template.SetsDetailsItemsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		SetExercises.update({ _id: this._id }, { $set: values });

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
						SetExercises.remove({ _id: me._id });
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
		Router.go("sets.details.edit", {setId: UI._parentData(1).params.setId, itemId: this._id});
		return false;
	}
});

Template.SetsDetailsItemsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return SetExercises.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return SetExercises.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
