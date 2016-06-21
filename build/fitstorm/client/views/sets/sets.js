var pageSession = new ReactiveDict();

Template.Sets.rendered = function() {
	
};

Template.Sets.events({
	
});

Template.Sets.helpers({
	
});

var SetsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("SetsViewSearchString");
	var sortBy = pageSession.get("SetsViewSortBy");
	var sortAscending = pageSession.get("SetsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();
	
	_.each(raw, function(set) {
		if(set.type.indexOf('AMRAP') > -1) {
			set.setDuration = set.timeframe;
		}
	});

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["setName", "workoutId", "setDuration", "type", "publish", "songId"];
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

var SetsViewExport = function(cursor, fileType) {
	var data = SetsViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.SetsView.rendered = function() {
	pageSession.set("SetsViewStyle", "table");
	
};

Template.SetsView.events({
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
				pageSession.set("SetsViewSearchString", searchString);
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
					pageSession.set("SetsViewSearchString", searchString);
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
					pageSession.set("SetsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("sets.insert", {});
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

Template.SetsView.helpers({

	"insertButtonClass": function() {
		return Sets.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.set_list || this.set_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.set_list && this.set_list.count() > 0;
	},
	"isNotFound": function() {
		return this.set_list && pageSession.get("SetsViewSearchString") && SetsViewItems(this.set_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("SetsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("SetsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("SetsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("SetsViewStyle") == "gallery";
	}

	
});


Template.SetsViewTable.rendered = function() {
	
};

Template.SetsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("SetsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("SetsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("SetsViewSortAscending") || false;
			pageSession.set("SetsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("SetsViewSortAscending", true);
		}
	}
});

Template.SetsViewTable.helpers({
	"tableItems": function() {
		return SetsViewItems(this.set_list);
	}
});


Template.SetsViewTableItems.rendered = function() {
	
};

Template.SetsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("sets.details", {setId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Sets.update({ _id: this._id }, { $set: values });

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
						Sets.remove({ _id: me._id });
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
		Router.go("sets.edit", {setId: this._id});
		return false;
	}
});

Template.SetsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Sets.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Sets.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
