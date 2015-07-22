'use strict';

function LangParser () {}
 
LangParser.hasKeyValue = function (obj, key, value) {
    return obj.hasOwnProperty(key) && value === obj[key];
};
 
LangParser.hasValue = function (obj, value) {
	var keys = Object.keys(obj);

	for (var i = 0; i < keys.length; i++) {
	    var val = obj[keys[i]];
	    if (val === value) return true;
	}
	return false;
};



