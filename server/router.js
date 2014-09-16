/**
Sample SMS
{ ToCountry: 'US',
  ToState: 'UT',
  SmsMessageSid: 'SM9e7f9a00e70d9220ccc77b9843c6b8ba',
  NumMedia: '0',
  ToCity: 'PROVO',
  FromZip: '84606',
  SmsSid: 'SM9e7f9a00e70d9220ccc77b9843c6b8ba',
  FromState: 'UT',
  SmsStatus: 'received',
  FromCity: 'PROVO',
  Body: 'Brent Anderson',
  FromCountry: 'US',
  To: '+18016917644',
  ToZip: '84606',
  MessageSid: 'SM9e7f9a00e70d9220ccc77b9843c6b8ba',
  AccountSid: 'ACbc2b15d148b848529f98c5f408254042',
  From: '+18016912841',
  ApiVersion: '2010-04-01' }
*/
Router.map(function() {
	this.route('voice-hook', {where: 'server', path: '/api/voice-hook', action:function() {
		this.response.end("Voice Handled");
	}});
	this.route('sms-hook', {where: 'server', path: '/api/sms-hook', action: function() {
		var params = this.request.body,
		fromNumber = params.From,
		toNumber   = params.To,
		message = params.Body;

		// Find the last message sent to this number
		var lastMessage = Messages.findOne({to: fromNumber}) || {};
		var lastConvo	= Conversations.findOne(lastMessage.conversationId);
		var member = Members.findOne({
			number: fromNumber
		});
		
		if (!lastConvo || (member && !member.subscribed)) {
			// We don't know who this person is or what's going on
			// Register them in the system!

			Members.upsert({
				number: fromNumber
			}, {
				name: message,
				number: fromNumber,
				groups: ["Ward"],
				subscribed: true
			});

			member = Members.findOne({ number: fromNumber });

			var message = Messages.insert({
				fromNumber: fromNumber,
				toNumber: toNumber,
				memberId: member._id,
				message: message,
				messageCode: "START",
				direction: "inbound",
				sentReceived: true
			});

			Messages.insert({
				fromNumber: Meteor.settings.twilioNumber,
				toNumber: fromNumber, // Flipped here since we're replying
				memberId: member._id,
				message: "Thank you for signing up! Reply with STOP at any time to cancel.",
				messageCode: "START_REPLY",
				direction: "outbound",
				sentReceived: false
			});
			this.response.end("Subscribed");
		} else { // We know this number
			
			if (!member) {
				Meteor.Error(500, "Unknown member with number " + fromNumber);
				this.response.end("Unknown member error");
			}
			if (message.toLowerCase() === "stop") {
				// Unsubscribe this member
				Members.update({_id: member._id}, {$set: {subscribed: false}});
				this.response.end("Unsubscribed");
			} else { // Handle the message properly
				var inMessage = Messages.insert({
					conversationId: lastConvo._id,
					fromNumber: fromNumber,
					toNumber: Meteor.settings.twilioNumber,
					memberId: member._id,
					message: message,
					direction: "inbound",
					sentReceived: true
				});
				
				this.response.end("New message received");
			}
		}
	}});
});