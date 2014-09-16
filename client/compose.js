var _selectedGroups = {}, groupTracker = new Tracker.Dependency;
var _currentMessage = "", messageTracker = new Tracker.Dependency;

Template.compose.events({
	'change input[type="checkbox"]': function(e, t) {
		if (e.target.checked) {
			_selectedGroups[this._id] = true;
		} else {
			_selectedGroups[this._id] = false;
		}
		groupTracker.changed();
	},
	'keyup textarea': function(e, t) {
		_currentMessage = t.find('textarea').value;
		messageTracker.changed();
	},
	'click button': function(e, t) {
		Meteor.call('sendMessage', t.find('textarea').value, getGroups(), function(err, res) {
			Notifications.success('Messages Sent!', 'Your message has been queued for delivery!', {
				timeout: 3000
			});
			t.find('textarea').value = "";
			_selectedMessage = "";
		});
	}
});

function getGroups() {
	groupTracker.depend();
	return _.compact(
		_.map(
			_.pairs(_selectedGroups), function(obj) { 
				if (obj[1]) 
					return obj[0] 
			})
		);
}

function getMessage() {
	messageTracker.depend();
	return _currentMessage;
}

Template.compose.groups = function() {
	return Groups.find();
};

Template.compose.count = function() {
	return Members.find({groups: {$in: getGroups()}}).count();
};

Template.compose.canSend = function() {
	if (
		Members.find({groups: {$in: getGroups()}}).count() > 0 &&
		getMessage().length > 0
		) {
		return "";
	} else {
		return "disabled";
	}
};