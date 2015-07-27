'use strict';

describe('Service: ParsingService', function () {
	
	// load the service's module
	beforeEach(module('services'));
	var service;
	
	// Initialize the service
	beforeEach(inject(function (parsingservice) {
		service = parsingservice;
	}));

	it('Should search for "myvalue" in all properties and attributes', function () {
		var f = service.parse("myvalue");
		
		var obj = {a:"myvalue"};
		expect(f(obj)).toBe(true);
		
		var notobj = {a:"notmyvalue"};
		expect(f(notobj)).toBe(false);
	});
	
	it('Should search for "myvalue" in a specific property "myproperty"', function () {
		var f = service.parse("myproperty:myvalue");
		
		var obj = {myproperty:"myvalue"};
		expect(f(obj)).toBe(true);
		
		var notobj = {myproperty:"notmyvalue"};
		expect(f(notobj)).toBe(false);
		
		var emptyobj = {};
		expect(f(emptyobj)).toBe(false);
	});
	
	it('Should search for "myvalue" in a specific attribute with name "myattribute"', function () {
		var f = service.parse("myattribute:myvalue");
		
		var obj = {attributes:[{name:"myattribute", value:"myvalue"}]};
		expect(f(obj)).toBe(true);
		
		var notobj = {attributes:[{name:"myattribute", value:"notmyvalue"}]};
		expect(f(notobj)).toBe(false);
		
		var emptyobj = {};
		expect(f(emptyobj)).toBe(false);
	});
	
	it('Should search for "myattributevalue" in a specific attribute with name "myattribute" and for "myvalue" in a property "myproperty" ', function () {
		var f = service.parse("myattribute:myattributevalue AND myproperty:myvalue");
		
		var obj = {myproperty:"myvalue", attributes:[{name:"myattribute", value:"myattributevalue"}]};
		expect(f(obj)).toBe(true);
		
		var notobj = {attributes:[{name:"myattribute", value:"myvalue"}]};
		expect(f(notobj)).toBe(false);
		
		notobj = {myproperty:"myvalue"};
		expect(f(notobj)).toBe(false);
	});
});