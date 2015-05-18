Meteor.startup(function() {

    diagnosisPredicate = {
        _id: "patient/diagnosis",
        name: "diagnosis",
        nameLC: "diagnosis",
        description: "a health condition that a person (patient) has or had in the past",
        subjectEtypes: ["patient"],
        objectEtypes: ["healthcondition"],
        creator: "dave"
    };

    medicationPredicate = {
        _id: "patient/medication",
        name: "medication",
        nameLC: "medication",
        description: "a medication that a person (patient) takes or has taken in the past",
        subjectEtypes: ["patient"],
        objectEtypes: ["medication"],
        creator: "dave"
    };

    flagPredicate = {
        _id: "patient/flag",
        name: "flag",
        nameLC: "flag",
        description: "a concern, goal, or red flag, intended to trigger questions and rules to address it",
        subjectEtypes: ["patient"],
        objectEtypes: ["flag"],
        creator: "dave"
    };

    measurementPredicate = {
        _id: "patient/measurement",
        name: "measurement",
        nameLC: "measurement",
        description: "a quantitative measurement",
        subjectEtypes: ["patient"],
        objectEtypes: ["measurement"],
        creator: "dave"
    };

});