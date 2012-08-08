var Session = {
	current: null,
	
	set: function(s) {
		Session.current = s;
	},
        
	get: function() {
		return Session.current;
	}
};
