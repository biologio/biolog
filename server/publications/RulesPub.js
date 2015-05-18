Meteor.publish('Rules', function () {
  return Rules.find();
});
