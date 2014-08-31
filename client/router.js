Router.configure({
	loadingTemplate: 'core_loading',
	notFoundTemplate: 'core_notfound',
	layoutTemplate: 'core_layout'
});

Router.onBeforeAction(function(pause){
	if (!Meteor.user()) {
		this.render('login');
		pause();
	}
});

Router.map(function() {
  this.route('conversation', {path: '/'});
  this.route('members');
  this.route('compose');
});