Meteor.publish('Flags', function () {
  return Flags.find();
});
