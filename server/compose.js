Meteor.methods({
	sendMessage: function(msg, groups) {
		var baseMsg = {
			fromNumber: Meteor.settings.twilioNumber,
			message: msg,
			direction: "outbound",
			sentReceived: false
		};

		Members.find({groups: {$in: groups}}).forEach(function(doc) {
			var newMsg = _.extend(baseMsg, {
				toNumber: doc.number,
				memberId: doc._id
			});
			// console.log(newMsg);
			Messages.insert(newMsg);
		});
	}
});