'use strict';

angular.module("devicesUiApp")
.controller("BookmarksCtrl", ["$log", "bookmarkservice", "pagingservice",
           function ($log, bookmarkservice, pagingservice) {
	
	this.bookmarks = bookmarkservice.bookmarks;
	
	this.open = function(bookmark) {
		$log.info('open bookmark', bookmark);
		pagingservice.query(bookmark.query);
	};

}]);