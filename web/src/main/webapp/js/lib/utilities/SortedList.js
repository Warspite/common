var SortedList = function(sortingAttribute)
{
	this.sortingAttribute = sortingAttribute;
	this.firstElement = null;
};

SortedList.prototype.add = function(obj)
{
	if( this.firstElement == null ) {
		this.firstElement = obj;
		return;
	}
	
	if( this.firstElement[this.sortingAttribute] > obj[this.sortingAttribute] ) {
		obj.nextElement = this.firstElement;
		this.firstElement = obj;
		return;
	}
	
	var e = this.firstElement;
	while(e.nextElement != null) {
		var next = e.nextElement;
		
		if( next[this.sortingAttribute] > obj[this.sortingAttribute] ) {
			obj.nextElement = next;
			e.nextElement = obj;
			return;
		}
		
		e = next;
	}

	e.nextElement = obj;
};

SortedList.prototype.remove = function(obj)
{
	if( obj == this.firstElement ) {
		this.firstElement = this.firstElement.nextElement;
		return;
	}
		
	var e = this.firstElement;
	while(e != null) {
		var next = e.nextElement;
		
		if( next == obj ) {
			e.nextElement = next.nextElement;
			return;
		}
		
		e = next;
	}
};