Meteor.startup(function(){
	Avatar.setOptions({
  imageSizes: ["small", "big"],
  cssClassPrefix: 'avatar'
});
})