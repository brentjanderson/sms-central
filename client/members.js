Template.members.members = function() {
	return Members.find();
};

Template.members.organizations = function() {
	return Groups.find({_id: { $in: this.groups }},{fields: {name: 1}});
};