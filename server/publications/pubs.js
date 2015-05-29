/**
 * Created by dd on 5/22/15.
 */


Meteor.publish("patientDiagnoses", function (patientId) {
    return getPatientDiagnoses(patientId);
});

Meteor.publish("patientFlags", function (patientId) {
    return getPatientFlags(patientId);
});

Meteor.publish("patientQuestions", function (flags) {
    return getPatientQuestions(flags);
});

Meteor.publish("patientMeds", function (patientId) {
    return getPatientMeds(patientId);
});