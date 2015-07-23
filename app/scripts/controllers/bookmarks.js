'use strict';

angular.module("devicesUiApp")
.controller("BookmarksCtrl", ["$log", "bookmarkservice", "searchservice",
           function ($log, bookmarkservice, searchservice) {
	
	this.bookmarks = bookmarkservice.bookmarks;
	
	this.open = function(bookmark) {
		$log.info('open bookmark', bookmark);
		searchservice.query(bookmark.query);
	};

}]);