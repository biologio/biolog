
getPatient = function() {
    return Session.get("biolog.patient");
};

setPatient = function(pt) {
    Session.set("biolog.patient", pt);
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