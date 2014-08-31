Router.configure({
	loadingTemplate: 'core_loading',
	notFoundTemplate: 'core_notfound',
	layoutTemplate: 'core_layout'
});

Router.map(function() {
  this.route('login', {path: '/'});
  this.route('conversations');
  this.route('members');
  this.route('compose');
});