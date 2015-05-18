/**
 * Created by dd on 11/24/14.
 */

isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

strToId = function(raw) {
    return raw.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "-");
};

/**
 * Set a value within a object tree
 * @param object
 * @param path
 * @param value
 */
setValuePath = function(object, path, value) {
    var a = path.split('.');
    var o = object;
    for (var i = 0; i < a.length - 1; i++) {
        var n = a[i];
        if (n in o) {
            o = o[n];
        } else {
            o[n] = {};
            o = o[n];
        }
    }
    o[a[a.length - 1]] = value;
};

/**
 * Geta  value from within an object's tree
 * @param object
 * @param path
 * @returns {*}
 */
getValuePath = function(object, path) {
    var o = object;
    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');
    var a = path.split('.');
    while (a.length) {
        var n = a.shift();
        if (n in o) {
            o = o[n];
        } else {
            return;
        }
    }
    return o;
};

yyyymmdd = function(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = date.getDate().toString();
    return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

yyyy_mm_dd = function(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = date.getDate().toString();
    return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
};


searchIsabel = function() {
    var patientDiagnoses = Session.get("patientDiagnoses");
    var diagnosisList = "";
    for (var di in patientDiagnoses) {
        var dx = patientDiagnoses[di];
        if (diagnosisList.length > 0) diagnosisList += "|";
        diagnosisList += dx.objName;
    }
    console.log("searchIsabel: " + diagnosisList);
    var pt = Session.get("patient");
    var dob = yyyymmdd(getValuePath(pt, "data['id/dob']").startDate);
    var sex = getValuePath(pt, "data['id/sex']").text;
    var pregnant = "false";
    Meteor.call("isabel", dob, sex, pregnant, 12, diagnosisList, function(error, result){
        if (error) {
            return console.error("ERROR calling Isabel: " + error);
        }
        console.log("Received response from Isabel: " + JSON.stringify(result, null, "  "));
        var contentString = result.content.substring(7, result.content.length - 2);
        var content = JSON.parse(contentString);
        console.log("Received RESULT from Isabel: " + JSON.stringify(content, null, "  "));
        Session.set("isabel", content.Diagnosis_checklist)
    });
};


getPatientDiagnoses = function(patientId) {
    if (! patientId) return;
    return Facts.find({pred: "diagnosis", subj: patientId, valid: 1 });
};

getPatientFlags = function(patientId) {
    if (! patientId) return;
    return Facts.find({pred: "flag", subj: patientId, valid: 1 });
};

getPatientMeds = function(patientId) {
    if (! patientId) return;
    return Facts.find({pred: "medication", subj: patientId, valid: 1 });
};

//TODO filter out any questions that need not be asked
getPatientQuestions = function(flags) {
    if (! patientId) return;
    return Questions.find(
        {
            valid: 1,
            $or: [ flags ]
        }
    );
};

//TODO support users being permitted to handle other patients
getUserPatients = function(userid) {
    if (! userid) return;
    return Entities.find({etypes: "patient", owners: userid, valid: 1 });
};