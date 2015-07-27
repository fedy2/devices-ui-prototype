'use strict';

/**
 * Bookmarks controller.
 */
angular.module("devicesUiApp")
.controller("BookmarksCtrl", ["bookmarkservice", "searchservice",
           function (bookmarkservice, searchservice) {
	
	this.bookmarks = bookmarkservice.bookmarks;
	
	this.open = function(bookmark) {
		searchservice.search(bookmark.query, []);
	};

}]);