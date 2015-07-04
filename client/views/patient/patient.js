/**
 * If patient not defined, open the dialog to select a patient!
 */
/*
Tracker.autorun(function () {
    if (Session.get("biolog.patient.modal.open")) {
        $('#patientModal').modal({
            closable  : true,
            onApprove    : function(){
                Session.set("biolog.patient.modal.open", null);
                submitPatient();
                return true;
            },
            onDeny    : function(){
                Session.set("biolog.patient.modal.open", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog.patient.modal.open", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog.patient.modal.open"));
        $('#patientModal').modal('hide');
    }
});
 */

Template.patientDemographics.rendered = function() {
    $('.ui.checkbox')
        .checkbox();
    ;
}


Template.patientDemographics.events({
    'click .patientDialog-patient': function(event) {
        //console.log(JSON.stringify(this));
    },

    //'click .patientSelector-newPatient' : function(event) {
    //    var pt = {
    //        _id: "person/" + Meteor.user()._id,
    //        userid: Meteor.user()._id,
    //        creator: Meteor.user()._id,
    //        created: new Date(),
    //        data: {}
    //    };
    //    Session.set("editPatient", pt);
    //}

    'change #inputNickname': function(event) {
        var pt = getPatient();
        setPatientNickname(pt, event.target.value);
        setPatient(pt);
        //addProperty(fact);
        //console.log("Changed: " + JSON.stringify(getPatient()));
    },

    'change #inputDob': function(event) {
        var pt = getPatient();
        setPatientDob(pt, event.target.value);
        setValuePath(pt, "data.id/dob", fact);
        setPatient(pt);
        //addProperty(fact);
        console.log("Changed patient: " + JSON.stringify(getPatient()));
    },

    'change input[name=inputGender]': function(event) {
        var pt = getPatient();
        setPatientSex(pt, event.target.value);

        setPatient(pt);
        //addProperty(fact);
        console.log("Changed patient: " + JSON.stringify(getPatient()));
    }
});


Template.patientDemographics.helpers({
    //patients: function() {
    //    if (! getPatient()) return;
    //    var pts = getUserPatients(getPatient()._id).fetch();
    //    Session.set("patients", pts);
    //    return pts;
    //},

    patient: function() {
        if (getPatient()) return getPatient();
        if (Meteor.user()) {
            var patientId = "patient/" + Meteor.user()._id;
            Meteor.call("getEntity", patientId, function(err, foundPatient) {
                if (err) {
                    console.error(err);
                }
                if (foundPatient) {
                    patient = foundPatient;
                    //console.log("found patient");
                    setPatient(patient);
                    //ensureDemographics();
                    //setTimeout(function () { ensureDemographics() }, 1000);
                    ;
                    return patient;
                }
                patient = createPatientEntity(patientId, Meteor.user().profile.name);

                setPatient(patient);
                Meteor.call("addEntity", patient);

                //ensureDemographics();

                return patient;
            });
        }
    },

    femaleChecked: function() {
        //var sex = getValuePath(this, "data['id/sex']");
        var sex = getPatientSex();
        if (!sex) return;
        if (sex=="female") return "checked";
        return "";
    },

    maleChecked: function() {
        //var sex = getValuePath(this, "data['id/sex']");
        var sex = getPatientSex();
        if (!sex) return;
        if (sex=="male") return "checked";
        return "";
    },

    nickname: function() {
        //var nickname = getValuePath(this, "data['id/nickname']");
        var nickname = getPatientNickname();
        if (!nickname) return;
        return nickname;
    },

    dob: function() {
        //var dob = getValuePath(this, "data['id/dob']");
        var dob = getPatientDob();
        if (!dob) return;
        var dobDate = new Date(String(dob));
        //console.log("dob: this=" + JSON.stringify(this));
        //console.log("dob: dobDate=" + (typeof dobDate) + "; dobDate=" + dobDate);
        try {
            return dobDate.toISOString().substring(0, 10);
        } catch(err) {
            return null;
        }
    }
});