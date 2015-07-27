'use strict';


/**
 * Helper methods for device filter generated functions.
 */
function LangParser () {}

LangParser.equals = function(a ,b){ return a === b; };

/**
 * Checks if the passed Object has the specified couple of key and value both as property or as attribute.
 * @param obj the object to check.
 * @param key the key.
 * @param value the value-
 * @returns {Boolean} <code>true</code> if the couple is found, <code>false</code> otherwise.
 */
LangParser.hasKeyValue = function (obj, key, value) {
    if (obj.hasOwnProperty(key) && LangParser.equals(value, obj[key])) return true;
    
    if (obj.hasOwnProperty("attributes")) {
		for (var i = 0; i < obj.attributes.length; i++) {
		    var attribute = obj.attributes[i];
		    if (LangParser.equals(attribute.name,key) && LangParser.equals(attribute.value, value)) return true;
		}
	}
    return false;
};

/**
 * Checks if the passes Object has a property value or attribute value the specified value.
 * @param obj the object to check.
 * @param value the value to search.
 * @returns {Boolean} <code>true</code> if the value has been found, <code>false</code> otherwise.
 */
LangParser.hasValue = function (obj, value) {
	var keys = Object.keys(obj);

	for (var i = 0; i < keys.length; i++) {
	    var val = obj[keys[i]];
	    if (LangParser.equals(val, value)) return true;
	}
	
	if (obj.hasOwnProperty("attributes")) {
		for (i = 0; i < obj.attributes.length; i++) {
		    var attribute = obj.attributes[i];
		    if (LangParser.equals(attribute.value, value)) return true;
		}
	}
	
	return false;
};



