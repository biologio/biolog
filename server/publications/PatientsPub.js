Meteor.publish('Patients', function () {
  return Patients.find();
});
