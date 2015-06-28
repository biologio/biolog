
getPatient = function() {
    return Session.get("biolog.patient");
};

setPatient = function(pt) {
    Session.set("biolog.patient", pt);
};

getPatientDob = function(pt) {
    if (!pt) pt = getPatient();
    if (!pt) return;
    var dobObj = getValuePath(pt, "data.id/dob");
    if (!dobObj) return;
    return dobObj.startDate;
};

setPatientDob = function(pt, dob) {
    if (!pt) return;
    var fact = {
        subj: pt._id,
        pred: "id/dob",
        startDate: dob,
        startFlag: 0,
        endFlag: 1
    };
    setValuePath(pt, "data.id/dob", fact);
};

getPatientSex = function(pt) {
    if (!pt) pt = getPatient();
    if (!pt) return;
    var obj = getValuePath(pt, "data.id/sex");
    if (!obj) return;
    return obj.text;
};

setPatientSex = function(pt, sex) {
    if (!pt) return;
    var fact = {
        subj: pt._id,
        pred: "id/sex",
        text: sex,
        startFlag: 0,
        endFlag: 1
    };
    setValuePath(pt, "data.id/sex", fact);
};

getPatientNickname = function(pt) {
    if (!pt) pt = getPatient();
    if (!pt) return;
    var obj = getValuePath(pt, "data.id/nickname");
    if (!obj) return;
    return obj.text;
};

setPatientNickname = function(pt, nickname) {
    if (!pt) return;
    var fact = {
        subj: pt._id,
        pred: "id/nickname",
        text: nickname,
        startFlag: 0,
        endFlag: 1
    };
    setValuePath(pt, "data.id/nickname", fact);
};


getPatientCountry = function(pt) {
    if (!pt) pt = getPatient();
    if (!pt) return;
    var obj = getValuePath(pt, "data.geo/country");
    if (!obj) return;
    return obj.text;
};

setPatientCountry = function(pt, val) {
    if (!pt) return;
    var fact = {
        subj: pt._id,
        pred: "geo/country",
        text: val,
        startFlag: 0,
        endFlag: 1
    };
    setValuePath(pt, "data.geo/country", fact);
};

getPatientZip = function(pt) {
    if (!pt) pt = getPatient();
    if (!pt) return;
    var obj = getValuePath(pt, "data.geo/zip");
    if (!obj) return;
    return obj.text;
};

setPatientZip = function(pt, val) {
    if (!pt) return;
    var fact = {
        subj: pt._id,
        pred: "geo/zip",
        text: val,
        startFlag: 0,
        endFlag: 1
    };
    setValuePath(pt, "data.geo/zip", fact);
};


submitPatient = function(pt) {
    if (!pt) pt = getPatient();
    ////console.log("Saving pt:" + JSON.stringify(pt));
    var dob = getValuePath(pt, "data.id/dob");
    var nickname = getValuePath(pt, "data.id/nickname");
    var sex = getValuePath(pt, "data.id/sex");
    var country = getValuePath(pt, "data.geo/country");
    var zip = getValuePath(pt, "data.geo/zip");
    //console.log("Saving dob: " + JSON.stringify(dob));
    saveProperty(dob);
    saveProperty(nickname);
    saveProperty(sex);
    saveProperty(country);
    saveProperty(zip);
};


createPatientEntity = function(patientId, name) {
    var entity = {
        _id: patientId,
        name: name,
        etypes: ["patient"]
    };
    return entity;
};