Meteor.startup(function() {

    medicationEtype = {
        _id: "medication",
        name: "medication",
        description: "a medication",
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