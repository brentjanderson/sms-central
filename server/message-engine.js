Messages.find({sentReceived: false, direction: "outbound"}).observe({
	added: function(doc) {
		// Send message!
		console.log("SENDING SMS " + doc);
	}
});