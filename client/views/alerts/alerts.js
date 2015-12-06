countAlerts = function() {
    if (! Session.get("biolog.isabelItems")) return null;
    return Session.get("biolog.isabelItems").length;
}

Template['alerts'].helpers({
});

Template['alerts'].events({
});

Template.isabelChecklist.helpers({
    isabelItems: function() {
        if (! Session.get("biolog.isabelItems")) return null;
        //console.log(JSON.stringify(Session.get("biolog.isabelItems").diagnosis));
        return Session.get("biolog.isabelItems");
    }
});

Template.isabelItem.events({
   "click .alertsItem": function(event) {
       console.log("Clicked: " + JSON.stringify(event.currentTarget.id));

   }
});

Template.isabelItem.helpers({

    isabelIcon: function() {
        if (this.red_flag && this.red_flag == "true") return "warning circle icon";
        return "question icon";
    },

    severityColor: function() {
        if (this.red_flag && this.red_flag == "true") return "ui error message";
        return "ui warning message";
    }
});


Tracker.autorun(function () {
    if (!getPatient()) return;
    var currentConditionsCursor = getPatientConditionsCurrent(getPatient()._id);
    if (!currentConditionsCursor) return;
    var currentConditions = currentConditionsCursor.fetch();
    //console.log("currentConditions=" + JSON.stringify(currentConditions));
    var conditionsList = "";
    for (var di in currentConditions) {
        var dx = currentConditions[di];
        if (!dx || !dx.objName) continue;
        if (conditionsList.length > 0) conditionsList += "|";
        conditionsList += dx.objName;
    }
    //console.log("searchIsabel: conditions=" + conditionsList);
    if (! conditionsList) return;
    var pt = getPatient();
    console.log("searchIsabel: pt=", pt);
    if (! pt) {
        return;
    }
    var dob = biolog.BiologUtil.yyyymmdd(getPatientDob(pt));
    var sex = getPatientSex(pt);
    var pregnant = "false";
    console.log("Searching Isabel for: dob: " + dob + ", sex: " + sex + ", conditions:" + conditionsList);

    Meteor.call("isabel", dob, sex, pregnant, 12, conditionsList, function(error, result) {
        if (error) {
            return console.error("ERROR calling Isabel: " + error);
        }
        //console.log("Received response from Isabel: " + JSON.stringify(result, null, "  "));
        //var contentString = result.content.substring(7, result.content.length - 2);
        //var content = JSON.parse(contentString);
        //console.log("Received RESULT from Isabel: " + JSON.stringify(content, null, "  "));
        //Session.set("biolog.isabelItems", content.Diagnosis_checklist);
        Session.set("biolog.isabelItems", result);
    });
});