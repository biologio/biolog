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
        console.log("StrengthMg: " + JSON.stringify(this));
        var strengthMg = getValuePath(this, "data");
        if (!strengthMg) return "?";
        return strengthMg;
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
