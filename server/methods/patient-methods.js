/**
 * Publish the count of the number of patients, see
 * https://github.com/percolatestudio/publish-counts
 */
Meteor.publish('patientCount', function() {
    Counts.publish(this, 'patient-counter', Entities.find({etypes: "patient"}));
});