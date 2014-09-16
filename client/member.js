Template.member.groups = function() {
	return Groups.find();
};

Template.member.isChecked = function() {
	var m = Router.current().data() || {};
	if (_.contains(m.groups, this._id)) {
		return "checked";
	} else {
		return "";
	}
};

Template.member.events({
	'change input[type="checkbox"]': function(e, t) {
		var modObj;
		if (e.target.checked) {
			modObj = {$push: {groups: this._id} };
		} else {
			modObj = {$pull: {groups: this._id} };
		}
		
		Members.update({_id: t.data._id}, modObj);
	}
});