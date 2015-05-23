Template['meds'].helpers({
    items: function() {
        if (!getPatient()) return;
        var result = getPatientMeds(getPatient()._id).fetch();
        return result;
    }
});

Template['meds'].events({
});
