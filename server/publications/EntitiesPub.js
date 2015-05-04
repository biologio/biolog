Meteor.publish('Entities', function () {
  return Entities.find();
});
