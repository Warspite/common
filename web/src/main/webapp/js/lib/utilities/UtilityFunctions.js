clone = function(obj) {
	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj) return obj;

	// Handle Date
	if (obj instanceof Date) {
		var copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if (obj instanceof Array) {
		var copy = [];
		var len = obj.length;
		for (var i = 0; i < len; ++i) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}

	// Handle Object
	if (obj instanceof Object) {
		var copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
};

mixin = function(parent, child) {
	for(i in parent)
		if( !child.hasOwnProperty(i) )
			child[i] = parent[i];
};

stopEvent = function(e)
{
	e.preventDefault();
	e.stopPropagation();
};

roundNumber = function(number, digits) {
	var multiple = Math.pow(10, digits);
	var rounded = Math.round(number * multiple) / multiple;
	return rounded;
};