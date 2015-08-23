PATIENT_COUNT = 100;

var chance = new Chance();

createRandomPatients = function() {
    for (var i=0; i<PATIENT_COUNT; i++) {
        createRandomPatient();
    }
};

createRandomPatient = function() {
    var id = Meteor.Collection.ObjectID()._str;

    var name = chance.name();
    var pt = createPatientEntity(id, name);
    addRandomDemographics(pt);

    savePatientDemographics(pt);

    //addMedications(pt);
}

addRandomDemographics = function(pt) {

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
        //lookup and add this medication:
        var q = chance.string({length: 2});
        var url = getUrlLookupMeds(q);
        //console.log("bioolookupContent url=" + url);
        HTTP.get(url, function (err, response) {
            if (err) {
                return results.set([]);
            }
            var json = JSON.parse(response.content);
            var index = chance.integer({min:0, max: json.length - 1});
            var med = json[index];

            //TODO: lookup attributes of this medicine
        });
    }
};



//Meteor.subscribe("patientCount");



Tracker.autorun(function() {
    //var patientCount = Counts.get('patient-counter');
    var patientCount = Entities.count({"etypes": "patient"});
    console.log("patientCount=" + patientCount);
    if (patientCount < PATIENT_COUNT) {
        createRandomPatients();
    }
});