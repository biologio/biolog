/**
 * Created by dd on 5/22/15.
 */

Tracker.autorun(function() {
    if (!getPatient()) return;

    Meteor.subscribe("patientFlags", getPatient()._id);

    //Meteor.subscribe("patientQuestions", getPatient()._id);

    Meteor.subscribe("patientConditions", getPatient()._id);
    Meteor.subscribe("patientMeds", getPatient()._id);
    Meteor.subscribe("patientEvents", getPatient()._id);
});
