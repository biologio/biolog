/**
 * Created by dd on 5/22/15.
 *
 * These queries are referenced from:
 * (1) the server, in Meteor.publish
 * (2) the client, in Meteor.subscribe
 */

getPatientConditions = function(patientId) {
    if (! patientId) return;
    return Facts.find({pred: conditionPredicate._id, subj: patientId, valid: 1 });
};

getPatientConditionsCurrent = function(patientId) {
    if (! patientId) return;

    if (typeof conditionPredicate === 'undefined') return;

    var result = Facts.find({pred: conditionPredicate._id, subj: patientId, valid: 1, endFlag: 1 }, {sort: {startDate: -1}});
    //console.log("getPatientConditionsCurrent queries: " + JSON.stringify({pred: conditionPredicate._id, subj: patientId, valid: 1, endFlag: 1 }) + "\nretrieves: " + JSON.stringify(result));
    return result;
};

getPatientConditionsPast = function(patientId) {
    if (! patientId) return;

    var result = Facts.find({pred: conditionPredicate._id, subj: patientId, valid: 1, endFlag: 0 }, {sort: {endDate: -1}});
    //console.log("getPatientMeds queries: " + JSON.stringify({pred: medicationPredicate._id, subj: patientId, valid: 1 }) + "\nretrieves: " + JSON.stringify(result));
    return result;
};

getPatientFlags = function(patientId) {
    if (! patientId) return;
    return Facts.find({pred: flagPredicate._id, subj: patientId, valid: 1 });
};

getPatientMeds = function(patientId) {
    if (! patientId) return;

    var result = Facts.find({pred: medicationPredicate._id, subj: patientId, valid: 1 });
    //console.log("getPatientMeds queries: " + JSON.stringify({pred: medicationPredicate._id, subj: patientId, valid: 1 }) + "\nretrieves: " + JSON.stringify(result));
    return result;
};

getPatientMedsCurrent = function(patientId) {
    if (! patientId) return;

    var result = Facts.find({pred: medicationPredicate._id, subj: patientId, valid: 1, endFlag: 1 }, {sort: {startDate: -1}});
    //console.log("getPatientMeds queries: " + JSON.stringify({pred: medicationPredicate._id, subj: patientId, valid: 1 }) + "\nretrieves: " + JSON.stringify(result));
    return result;
};

getPatientMedsPast = function(patientId) {
    if (! patientId) return;

    var result = Facts.find({pred: medicationPredicate._id, subj: patientId, valid: 1, endFlag: 0 }, {sort: {endDate: -1}});
    //console.log("getPatientMeds queries: " + JSON.stringify({pred: medicationPredicate._id, subj: patientId, valid: 1 }) + "\nretrieves: " + JSON.stringify(result));
    return result;
};

//TODO filter out any questions that need not be asked
getPatientQuestions = function(flags) {
    return Questions.find(
        {
            valid: 1,
            $or: [ flags ]
        }
    );
};

//TODO support users being permitted to handle other patients
queryPatient = function(userid) {
    if (! userid) return;
    return Entities.find({etypes: "patient", _id: userid});
};

//TODO support users being permitted to handle other patients
getUserPatients = function(userid) {
    if (! userid) return;
    return Entities.find({etypes: "patient", owners: userid, valid: 1 });
};

