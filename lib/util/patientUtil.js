
getPatient = function() {
    return Session.get("biolog.patient");
};

setPatient = function(pt) {
    Session.set("biolog.patient", pt);
};

getPatientDob = function() {
    var pt = getPatient();
    if (!pt) return;
    var dobObj = getValuePath(pt, "data['id/dob']");
    if (!dobObj) return;
    return dobObj.startDate;
};

getPatientSex = function() {
    var pt = getPatient();
    if (!pt) return;
    var obj = getValuePath(pt, "data['id/sex']");
    if (!obj) return;
    return obj.text;
};

submitPatient = function() {
    var pt = getPatient();
    //console.log("Saving pt:" + JSON.stringify(pt));
    var dob = getValuePath(pt, "data['id/dob']");
    var nickname = getValuePath(pt, "data['id/nickname']");
    var sex = getValuePath(pt, "data['id/sex']");
    setProperty(dob);
    setProperty(nickname);
    setProperty(sex);
};