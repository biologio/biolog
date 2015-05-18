Meteor.publish('Facts', function () {
  return Facts.find();
});
