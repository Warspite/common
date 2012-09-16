var Server = {
	req: function(servlet, type, params, caller, successCallback, failureCallback) {
		console.log("Making call to " + servlet + " with session: " + JSON.stringify(Session.current) + " and parameters " + JSON.stringify(params));
		var actualFailureCallback = failureCallback || Server.defaultFailureCallback;
		
		$.ajax({
			url: "api/" + servlet,
			dataType: "json",
			headers: {
				"params": JSON.stringify(params),
				"auth": JSON.stringify(Session.current)
			},
			error: Server.handleRequestFault,
			success: function(result) {
				if( result.success )
					successCallback(result, caller)
				else
					actualFailureCallback(result, type, servlet, caller)
			},
			type: type
		});
	},
	
	defaultFailureCallback: function(result, requestType, servlet, caller) {
		alert(requestType + " request to " + servlet + " failed: " + result.message);
	},
	
    handleRequestFault: function(error, textStatus) {
    	alert("Server request error: " + error.status + " " + error.statusText + " (" + textStatus  + ")");
    },
    
    mapify: function(array, idParamName) {
    	var idParam = idParamName || "id";
    	map = {};
    	for(i in array)
    		map[array[i][idParam]] = array[i];
    	
    	return map;
    }
};
