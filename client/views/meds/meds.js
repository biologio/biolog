Template['meds'].helpers({
    items: function () {
        if (!getPatient()) return;
        var result = getPatientMeds(getPatient()._id).fetch();
        return result;
    }
});

Template.medsItem.rendered = function() {

};


Template.medsItem.helpers({

    strengthMg: function() {
        var strength = getValuePath(this, "data['medication/strength'].num");
        if (!strength) return "?";
        return strength;
    },

    frequency: function() {
        var freq = getValuePath(this, "data['medication/frequency'].text");
        if (!freq) return "? frequency";
        return freq;
    },

    timimg: function() {
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

Template['meds'].events({
});
