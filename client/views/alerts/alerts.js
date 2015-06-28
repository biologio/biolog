Template['alerts'].helpers({
});

Template['alerts'].events({
});

isabelItems = new ReactiveVar();

Template.isabelChecklist.helpers({
    diagnoses: function() {
        if (! isabelItems.get()) return null;
        return isabelItems.get().diagnosis;
    },

    isabelIcon: function() {
        if (this.red_flag && this.red_flag == "true") return "warning";
        return "question";
    },

    severityColor: function() {
        if (this.red_flag && this.red_flag == "true") return "ui error message";
        return "ui warning message";
    }
});


Tracker.autorun(function () {
    var currentConditions = getPatientConditionsCurrent(getPatient()._id);
    var conditionsList = "";
    for (var di in currentConditions) {
        var dx = currentConditions[di];
        if (conditionsList.length > 0) conditionsList += "|";
        conditionsList += dx.objName;
    }
    console.log("searchIsabel: " + conditionsList);
    var pt = Session.get("patient");
    var dob = yyyymmdd(getPatientDob());
    var sex = getValuePath(pt, "data['id/sex']").text;
    var pregnant = "false";
    Meteor.call("isabel", dob, sex, pregnant, 12, conditionsList, function(error, result){
        if (error) {
            return console.error("ERROR calling Isabel: " + error);
        }
        console.log("Received response from Isabel: " + JSON.stringify(result, null, "  "));
        var contentString = result.content.substring(7, result.content.length - 2);
        var content = JSON.parse(contentString);
        console.log("Received RESULT from Isabel: " + JSON.stringify(content, null, "  "));
        isabelItems.set(content.Diagnosis_checklist)
    });
});