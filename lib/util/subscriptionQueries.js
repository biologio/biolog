/**
 * Created by dd on 5/22/15.
 *
 * These queries are referenced from:
 * (1) the server, in Meteor.publish
 * (2) the client, in Meteor.subscribe
 */


getPatientFlags = function(patientId) {
    if (!patientId) return;
    return Facts.find({
        pred: flagPredicate._id,
        subj: patientId,
        valid: 1
    });
};

//TODO filter out any questions that need not be asked
//getPatientQuestions = function(flags) {
//    return Questions.find(
//        {
//            valid: 1,
//            $or: [ flags ]
//        }
//    );
//};

//TODO support users being permitted to handle other patients
queryPatient = function(userid) {
    if (!userid) return;
    return Entities.find({
        etypes: "patient",
        _id: userid
    });
};

//TODO support users being permitted to handle other patients
getUserPatients = function(userid) {
    if (!userid) return;
    return Entities.find({
        etypes: "patient",
        owners: userid,
        valid: 1
    });
};


getPatientConditions = function(patientId) {
    if (!patientId) return;
    return Facts.find({
        pred: biolog.Conditions.PREDICATE._id,
        subj: patientId,
        valid: 1
    });
};

getPatientConditionsCurrent = function(patientId) {
    if (!patientId) return;
    var result = Facts.find({
        pred: biolog.Conditions.PREDICATE._id,
        subj: patientId,
        valid: 1,
        endFlag: 1
    }, {
        sort: {
            startDate: -1
        }
    });
    return result;
};

getPatientConditionsPast = function(patientId) {
    if (!patientId) return;
    var result = Facts.find({
        pred: biolog.Conditions.PREDICATE._id,
        subj: patientId,
        valid: 1,
        endFlag: 0
    }, {
        sort: {
            endDate: -1
        }
    });
    return result;
};

getPatientMeds = function(patientId) {
    if (!patientId) return;
    var result = Facts.find({
        pred: biolog.Medications.PREDICATE._id,
        subj: patientId,
        valid: 1
    });
    return result;
};

getPatientMedsCurrent = function(patientId) {
    if (!patientId) return;
    var result = Facts.find({
        pred: biolog.Medications.PREDICATE._id,
        subj: patientId,
        valid: 1,
        endFlag: 1
    }, {
        sort: {
            startDate: -1
        }
    });
    return result;
};

getPatientMedsPast = function(patientId) {
    if (!patientId) return;
    var result = Facts.find({
        pred: biolog.Medications.PREDICATE._id,
        subj: patientId,
        valid: 1,
        endFlag: 0
    }, {
        sort: {
            endDate: -1
        }
    });
    return result;
};

getPatientConditionsMedications = function(patientId) {
    if (!patientId) return;

    return Facts.find({
            $or: [{
                pred: biolog.Medications.PREDICATE._id

            }, {
                pred: biolog.Conditions.PREDICATE._id
            }],
            $and: [{
                subj: patientId
            }, {
                valid: 1
            }]
        }, {
            sort: {
                created: -1
            }
        });
        // var result = Facts.find({pred: Medications.PREDICATE._id, subj: patientId, valid: 1, endFlag: 0 }, {sort: {endDate: -1}});
        // return result;
};

getPatientEvents = function(patientId) {
    if (!patientId) return;
    return Facts.find({
        pred: biolog.Events.PREDICATE._id,
        subj: patientId,
        valid: 1
    });
};

getPatientEventsCurrent = function(patientId) {
    if (!patientId) return;
    var params = {
        pred: biolog.Events.PREDICATE._id,
        subj: patientId,
        valid: 1,
        endFlag: 1
    };
    console.log("getPatientEventsCurrent: query params=", params);
    var result = Facts.find(params, {
        sort: {
            startDate: -1
        }
    });
    return result;
};

getPatientEventsPast = function(patientId) {
    if (!patientId) return;
    var result = Facts.find({
        pred: biolog.Events.PREDICATE._id,
        subj: patientId,
        valid: 1,
        endFlag: 0
    }, {
        sort: {
            endDate: -1
        }
    });
    return result;
};