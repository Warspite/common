var Server = {
	req: function(servlet, type, params, successCallback, failureCallback) {
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
					successCallback(result)
				else
					actualFailureCallback(result)
			},
			type: type
		});
	},
	
	defaultFailureCallback: function(result) {
		alert("Server request failed: " + result.message);
	},
	
    handleRequestFault: function(error, textStatus) {
    	alert("Server request error: " + error + " (" + textStatus  + ")");
    },
};
