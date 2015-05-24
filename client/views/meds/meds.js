Template.meds.helpers({
    items: function () {
        if (!getPatient()) return;
        var result = getPatientMeds(getPatient()._id).fetch();
        return result;
    }
});

Template.medsItem.events({
    "click .medsItem": function(event, template) {
        console.log("clicked: " + JSON.stringify(this));
        Session.set("biolog.med.editing", this);
        //Session.set("biolog.med.modal.open", true);
    }
});






Template.medsItem.helpers({

    strengthMg: function() {
        var strength = getMedStrength(this);
        if (!strength) return "?";
        return strength;
    },

    frequency: function() {
        var freq = getMedFrequency();
        if (!freq) return "? frequency";
        return freq;
    },

    timing: function() {
        if (this.startDate && this.endDate) {
            return yyyy_mm_dd(this.startDate) + " to " + yyyy_mm_dd(this.endDate);
        }
        if (this.startDate && ! this.endDate) {
            return "since " + yyyy_mm_dd(this.startDate);
        }
        if (! this.startDate && this.endDate) {
            return "stopped " + yyyy_mm_dd(this.endDate);
        }
    }


});




Tracker.autorun(function () {
    if (Session.get("biolog.med.editing")) {
        console.log("Showing modal:" + JSON.stringify(Session.get("biolog.med.editing")));
        $('#medModal').modal({
            closable  : true,
            onApprove    : function(){
                Session.set("biolog.med.editing", null);
                submitMed();
                return true;
            },
            onDeny    : function(){
                Session.set("biolog.med.editing", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog.med.editing", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog.bioolookup.modal.open"));
        $('#medModal').modal('hide');
    }
});




Template.medModal.helpers({
    medName: function() {
        var med = Session.get("biolog.med.editing");
        return getMedName(med);
    },

    medStrength: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        return getMedStrength(med);
    },

    medFrequency: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        return getMedFrequency(med);
    },

    medStartDate: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        return med.startDate;
    },

    medEndDate: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        return med.endDate;
    },

    medTaking: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        return med.endFlag;
    },

    medTakingChecked: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        if (med.endFlag == 1) {
            return "checked";
        }
        return "";
    },

    selected: function(freqText) {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        var freqVal = getMedFrequency(med);
        if (freqVal.text == freqText) return "checked";
        return "";
    }
});