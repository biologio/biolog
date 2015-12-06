Meteor.subscribe("country");
Template.profile.rendered = function() {
    $('.ui.radio.checkbox').checkbox();
    $('.user-tab .item')
        .tab();
    $('#profile-countryOfResidence')
        .dropdown({});
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 80, // Creates a dropdown of 15 years to control year,
        max: 1998,
        format: 'dd mmm, yyyy',
        formatSubmit: 'yyyy/mm/dd',
        today: '',
        clear: 'Clear selection',
        close: 'Ok',
        closeOnSelect: true,
        closeOnClear: true

    });

};

Template.profile.helpers({
    isMale: function(sex) {
        return "Male" == sex;
    },
    isFemale: function(sex) {
        return "Female" == sex;
    },

    countries: function() {
        console.log(Country.find({}));
        return Country.find({});
    }
});

Template.country.helpers({
    isResidenceOf: function(countryOfResidenceCode) {
        return Meteor.user().profile.countryOfResidence == countryOfResidenceCode;
    },
    toLowerCase: function(word) {
        return word.toLowerCase()
    }
});
Template.profile.events({
    'click #saveProfile': function(e) {
        // Update profile
        var data = _.object($("#profileForm").serializeArray().map(function(v) {
            return [v.name, v.value];
        }));
        console.log("saving profile data: ", data);
        Meteor.call('updateProfile', data);

        // create Entity for user.
        var pt = getPatient();

        console.log("Got profile for patient: ", Meteor.user().profile);
        setPatientNickname(pt, Meteor.user().profile.name);
        setPatientDob(pt, $("#profileDob").val());
        setPatientSex(pt, $("input:radio[name='profile.sex']").val());
        setPatientCountry(pt, $("select[name='profile.countryOfResidence']").val());
        setPatientZip(pt, $("select[name='profile.postalCode']").val());
        savePatientDemographics(pt);
        setPatient(pt);

        var patientId = "patient/" + Meteor.user()._id;
        //Meteor.call("getEntity", patientId, function(err, foundPatient) {
        //    if (err) {
        //        console.error(err);
        //    }
        //    if (foundPatient) {
        //        patient = foundPatient;
        //        setPatient(patient);
        //    }
        //    patient = createPatientEntity(patientId, Meteor.user().profile.name);
        //
        //    setPatient(patient);
        //    Meteor.call("addEntity", patient);
        //
        //
        //
        //
        //});
        Session.set("newUser", true);
        Router.go("/feed");



    }
});