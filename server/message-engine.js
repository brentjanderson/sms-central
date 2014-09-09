twilioClient = Twilio(Meteor.settings.twilioSID, Meteor.settings.twilioAuth);

Messages.find({sentReceived: false, direction: "outbound"}).observe({
	added: function(doc) {
		// Send message!
		console.log("SENDING SMS ", doc);

		if (doc.toNumber !== doc.fromNumber) {

			twilioClient.sendSms({
				to:   doc.toNumber,
				from: doc.fromNumber,
				body: doc.message
			},function(err, data) {
				console.log(err, data);
			});
		} else {
			console.warn("Message ID " + doc._id + " caught in SMS loop. Not sending message.");
		}

		Messages.update({_id: doc._id}, {$set: {sentReceived: true}});
	}
});