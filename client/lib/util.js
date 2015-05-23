/**
 * Created by dd on 11/24/14.
 */

searchIsabel = function() {
    var patientDiagnoses = Session.get("patientDiagnoses");
    var diagnosisList = "";
    for (var di in patientDiagnoses) {
        var dx = patientDiagnoses[di];
        if (diagnosisList.length > 0) diagnosisList += "|";
        diagnosisList += dx.objName;
    }
    console.log("searchIsabel: " + diagnosisList);
    var pt = Session.get("patient");
    var dob = yyyymmdd(getValuePath(pt, "data['id/dob']").startDate);
    var sex = getValuePath(pt, "data['id/sex']").text;
    var pregnant = "false";
    Meteor.call("isabel", dob, sex, pregnant, 12, diagnosisList, function(error, result){
        if (error) {
            return console.error("ERROR calling Isabel: " + error);
        }
        console.log("Received response from Isabel: " + JSON.stringify(result, null, "  "));
        var contentString = result.content.substring(7, result.content.length - 2);
        var content = JSON.parse(contentString);
        console.log("Received RESULT from Isabel: " + JSON.stringify(content, null, "  "));
        Session.set("isabel", content.Diagnosis_checklist)
    });
};
