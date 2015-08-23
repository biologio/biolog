PATIENT_COUNT = 2;

//var chance = new Chance();

createRandomPatients = function() {

    for (var i=0; i<PATIENT_COUNT; i++) {
        console.log("\n\nCreating patient #" + (i+1) + " of " + PATIENT_COUNT + " random patients");
        createRandomPatient();
    }
};

createRandomPatient = function() {
    var id = "patient/" + guid();

    var name = chance.name();
    var pt = createPatientEntity(id, name);
    console.log("\n\nCreated patient: " + pt);
    Meteor.call("addEntity", pt);
    addRandomDemographics(pt);
    console.log("\n\nAdded demographics: " + pt);
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

Meteor.subscribe("patientCount");



Meteor.startup(function () {
    var patientCount = Counts.get("patient-counter");
    console.log("patientCount=" + patientCount);
    if (patientCount < PATIENT_COUNT) {
        createRandomPatients();
    }
});