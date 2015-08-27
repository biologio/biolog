DESIRED_PATIENT_COUNT = 2;
MAX_RANDOM_MEDS_PER_PATIENT = 2;
//var chance = new Chance();

createRandomPatients = function() {
    console.log("CREATING " + DESIRED_PATIENT_COUNT + " createRandomPatients...");
    for (var i=0; i<DESIRED_PATIENT_COUNT; i++) {
        console.log("\n\nCreating patient #" + (i+1) + " of " + DESIRED_PATIENT_COUNT + " random patients");
        createRandomPatient();
    }
    console.log("FINISHED " + DESIRED_PATIENT_COUNT + " createRandomPatients...");
};

createRandomPatient = function() {
    var id = "patient/" + guid();

    var name = chance.name();
    var pt = createPatientEntity(id, name);
    console.log("\n\nCreated patient: " + pt);
    Meteor.call("addEntity", pt);
    addRandomDemographics(pt);
    console.log("\n\nAdded demographics: " + JSON.stringify(pt));
    savePatientDemographics(pt);

    addMedications(pt);
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
    var countMeds = chance.integer({min: 1, max: MAX_RANDOM_MEDS_PER_PATIENT});
    for (var i=0; i < countMeds; i++) {
        console.log("Adding med " + i + " of " + countMeds + " medications");
        //lookup and add this medication:
        var q = chance.string({length: 2});
        var url = getUrlLookupMeds(q);
        console.log("addMedications: bioolookupContent url=" + url);
        HTTP.get(url, function (err, response) {
            if (err) {
                console.error("Error adding medication: " + err);
                return results.set([]);
            }
            var json = JSON.parse(response.content);
            var medList = json.collection;
            var index = chance.integer({min:0, max: medList.length - 1});
            var med = medList[index];
            console.log("Saving medication: " + JSON.stringify(med));
            saveMedFactWithIngredientsAndClasses(pt._id, med, function(err, medFact) {
                if (medFact) {
                    console.log("Random Patient: " + JSON.stringify(pt) + "\nSaved medFact: " + JSON.stringify(medFact));
                }
            });
        });
    }
};

Meteor.subscribe("patientCount");



Meteor.startup(function () {
    var patientCount = Counts.get("patient-counter");
    console.log("patientCount=" + patientCount);
    if (patientCount < DESIRED_PATIENT_COUNT) {
        createRandomPatients();
    }
});