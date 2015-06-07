PATHIENT_COUNT = 3;


createPatients = function() {
    for (var i=0; i<PATIENT_COUNT; i++) {
        var id = Meteor.Collection.ObjectID()._str;
        var chance = new Chance()
        var name = chance.name();
        var pt = createPatientEntity(id, name);
        addDemographics(id);

        submitPatient(pt);

        addMedications(pt);
    }
}

addDemographics = function(id) {
    var pt = getPatient(id);
    if (!pt) {
        throw "Unable to find patient with id: " + id;
    }

    var dob = chance.date();
    var sex = "male";
    if (chance.bool()) sex = "female";
    var nickname = chance.name();
    var country = chance.country();
    var zip = chance.postal();

    setPatientDob(pt, dob);
    setPatientSex(pt, sex);
    setPatientNickname(pt, nickname);
    setPatientCountry(pt, country);
    setPatientZip(pt, zip);
};

addMedications = function(pt) {
    var countMeds = chance.integer({min: 0, max: 50});
    for (var i=0; i < countMeds; i++) {
        //lookup and add this medication
    }
};
