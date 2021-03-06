'use strict';
/**
 * Application constants.
 */
angular.module('devicesUiApp')
	.constant(
			'pagingConstants',
			{
				pageSize: 20,
				startParam: 'start',
				lenParam: 'len',
				queryParam: 'q',
				filtersParam: 'filters'
			}
			);