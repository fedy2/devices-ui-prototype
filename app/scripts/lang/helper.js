'use strict';

function LangParser () {}

LangParser.equals = function(a ,b){ return a === b};

 
LangParser.hasKeyValue = function (obj, key, value) {
    if (obj.hasOwnProperty(key) && LangParser.equals(value, obj[key])) return true;
    
    if (obj.hasOwnProperty("attributes")) {
		var attributes = obj["attributes"];
		for (var i = 0; i < attributes.length; i++) {
		    var attribute = attributes[i];
		    if (LangParser.equals(attribute.name,key) && LangParser.equals(attribute.value, value)) return true;
		}
	}
    return false;
};
 
LangParser.hasValue = function (obj, value) {
	var keys = Object.keys(obj);

	for (var i = 0; i < keys.length; i++) {
	    var val = obj[keys[i]];
	    if (LangParser.equals(val, value)) return true;
	}
	
	if (obj.hasOwnProperty("attributes")) {
		var attributes = obj["attributes"];
		for (var i = 0; i < attributes.length; i++) {
		    var attribute = attributes[i];
		    if (LangParser.equals(attribute.value, value)) return true;
		}
	}
	
	return false;
};



