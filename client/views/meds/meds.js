Template.meds.helpers({
    items: function () {
        if (!getPatient()) return;
        var result = getPatientMeds(getPatient()._id).fetch();
        return result;
    }
});

Template.medsItem.events({
    "click .medsItem": function(event, template) {
        //console.log("clicked: " + JSON.stringify(this));
        Session.set("biolog.med.editing", this);
        //Session.set("biolog.med.modal.open", true);
    }
});






Template.medsItem.helpers({

    strength: function() {
        var str = getMedStrength(this);
        if (!str) return "?";
        return str;
    },

    frequency: function() {
        var freq = getMedFrequency(this);
        if (!freq) return "? frequency";
        return medFrequencies[freq];
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
        //console.log("Showing modal:" + JSON.stringify(Session.get("biolog.med.editing")));
        $('#medModal').modal({
            closable  : true,
            onApprove    : function(){
                updateMed();
                $('.ui.rating').rating('clear rating');
                $('#medStrength').val('');
                $('#medStartDate').val('');
                $('#medEndDate').val('');
                Session.set("biolog.med.editing", null);
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


Template.medModal.rendered = function() {
    $('.ui.rating')
        .rating({
            //initialRating: 2,
            maxRating: 5
        })
    ;
};


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

    //medFrequency: function() {
    //    var med = Session.get("biolog.med.editing");
    //    if (!med) return;
    //    return getMedFrequency(med);
    //},

    medStartDate: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        var dateStr = yyyy_mm_dd(med.startDate);
        return dateStr;
    },

    medEndDate: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        //return med.endDate;
        if (!med.endDate) return "";
        var dateStr = yyyy_mm_dd(med.endDate);
        return dateStr;
    },


    //medTaking: function() {
    //    var med = Session.get("biolog.med.editing");
    //    if (!med) return;
    //    return med.endFlag;
    //},

    medTakingChecked: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        if (med.endFlag == 1) {
            return "checked";
        }
        return "";
    },

    medFrequencySelected: function(aFreqVal) {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        var freqVal = getMedFrequency(med);
        if (!freqVal) {
            if (aFreqVal=="1") return "selected";
            return "";
        }
        if (freqVal == aFreqVal) return "selected";
        return "";
    },

    medFrequencyLabel: function(freqVal) {
        return medFrequencies[freqVal];
    },

    medRating: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        var ratingVal = getFactRating(med);
        console.log("ratingVal=" + ratingVal);
        $('.ui.rating').rating('set rating', ratingVal);
        return ratingVal;
    }
});



updateMed = function() {
    var med = Session.get("biolog.med.editing");
    delete med._id;
    //console.log("Saving med: " + JSON.stringify(med));
    if (!med) return;
    var frequency = $("#medFrequency").val();
    var strength = $("#medStrength").val();
    var rating = null;
    rating = $('.ui.rating').rating('get rating');
    if (rating) {
        setFactRating(med, String(rating));
    }
    setMedFrequency(med, frequency);
    setMedStrength(med, strength);

    var startDateStr = $("#medStartDate").val();
    if (startDateStr) {
        var startDate = new Date(startDateStr);
        startDate.setTime( startDate.getTime() + startDate.getTimezoneOffset()*60*1000 );
        med.startDate = startDate;
    } else {
        med.startDate = null;
    }

    var endDateStr = $("#medEndDate").val();
    console.log("endDateStr='" + endDateStr + "'");
    if (endDateStr) {
        var endDate = new Date(endDateStr);
        endDate.setTime( endDate.getTime() + endDate.getTimezoneOffset()*60*1000 );
        med.endDate = endDate;
        console.log("set endDate=" + endDate);
    } else {
        med.endDate = null;
    }
    med.endFlag = 0;
    if ($("#medEndFlag").prop("checked")) med.endFlag = 1;

    setProperty(med, function(err, success) {
        if (err) {
            console.error("Unable to save med: " + err + "\n" + JSON.stringify(med));
            return;
        }
        console.log("Saved med: " + JSON.stringify(med));
    })
}