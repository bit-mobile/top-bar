var Backbone = require("modules-common/backbone/backbone.js"),
	_ = require("modules-common/underscore/underscore.js");

// insertCss(__inline("topBar.css"));

// var templateHTML = "<span class='JS-action topBar-left icon icon-arrow-left' data-action='back'></span>" +
// 	"<h1 class='JS-title'><%= title %></h1>" +
// 	"<span class='JS-action topBar-right icon <%= right.icon %>' data-action='<%= right.action %>'>" +
// 	"<% if (right.text) { %>" +
// 	"<%= right.text %>" +
// 	"<% } %>" +
// 	"<% if ( right.data && right.data.length > 0 ) { %>" +
// 	"<div class='topBar-rightList JS-rightList'>" +
// 	"<ul>" +
// 	"<% for(var i = 0, len = right.data.length; i < len; i++ ) { %>" +
// 	"<li data-action='<%= right.data[i].action %>'><span class='icon <%= right.data[i].icon %>'></span><span class='item-text'><%= right.data[i].text %></span></li>" +
// 	"<% } %>" +
// 	"</ul>" +
// 	"</div>" +
// 	"<% } %>" +
// 	"</span>";


var Mask = Backbone.View.extend({
	initialize: function() {
		var that = this;
		this.$el.on("click", function() {
			that.trigger("click");
		});
		$("#wraper").append(this.$el);
	},

	attributes: {
		"class": "topBar-mask"
	},

	show: function() {
		this.$el.show();
	},

	hide: function() {
		this.$el.hide();
	}
});

var mask = new Mask();

var TopBarView = Backbone.View.extend({
	// template: _.template(templateHTML),
	template: __inline("top-bar.tmpl"),
	initialize: function(option) {
		option = option || {};
		option.right = option.right || {};
		this.option = option;
		this.render();
		this.$morePanel = this.$el.find(".JS-rightList");
		this.initEvent();
	},

	initEvent: function() {
		var that = this;
		this.$el.delegate(".JS-action", "click", function() {
			var action = $(this).data("action");

			if (action) {
				that.trigger(action);
			}
		});

		this.$el.delegate("li", "click", function() {
			var action = $(this).data("action");

			that.hideMorePanel();
			if (action) {
				that.trigger(action);
			}

		});

		if (this.$morePanel.length > 0) {
			this.on("more", function() {
				that.showMorePanel();
				that.listenToOnce(mask, "click", function() {
					that.hideMorePanel();
				});
			});
		}
	},

	setTitle: function(title) {
		this.$el.find(".JS-title").html(title);
	},

	showMorePanel: function() {
		if (this.moreShowing) {
			return;
		}
		mask.show();
		this.$morePanel.show();
		this.moreShowing = true;
	},

	hideMorePanel: function() {
		if (this.moreShowing) {
			mask.hide();
			this.$morePanel.hide();
			this.moreShowing = false;
		}
	},

	attributes: {
		class: "topBar topbar"
	},

	render: function() {
		var right = this.option.right;
		if (right.data && right.data.length !== 0) {
			right.icon = right.icon || "icon-ellipsis";
			right.action = "more";
		}
		this.$el.html(this.template(this.option));
	}
});

module.exports = TopBarView;