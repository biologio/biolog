Template.profile.rendered = function() {
    $('.ui.radio.checkbox').checkbox();
};

Template.profile.helpers({
    isMale: function(sex) {
        console.log("isMale : " + sex);
        return "Male" == sex;
    },
    isFemale: function(sex) {
        console.log("isFemale : " + sex);
        return "Female" == sex;
    },
    countries: function () {
        return Meteor.call("countries");
    }
    
    
});

Template.profile.events({
    'click #saveProfile': function(e) {
        // Update profile
        var data = _.object($("#profileForm").serializeArray().map(function(v) {return [v.name, v.value];} ));
        Meteor.call('updateProfile', data);
        
        // create Entity for user.
        var pt = getPatient();
        
        setPatientNickname(pt, Meteor.user().profile.name);
        setPatientDob(pt, $("#profileDob").val());
        setPatientSex(pt, $("input:radio[name='profile.sex']").val());
        setPatientCountry(pt, $("select[name='profile.countryOfResidence']").val());
        setPatientZip(pt, $("select[name='profile.postalCode']").val());
        setPatient(pt);
        
        
        
        var patientId = "patient/" + Meteor.user()._id;
        Meteor.call("getEntity", patientId, function(err, foundPatient) {
            if (err) {
                console.error(err);
            }
            if (foundPatient) {
                patient = foundPatient;
                setPatient(patient);
            }
            patient = createPatientEntity(patientId, Meteor.user().profile.name);

            setPatient(patient);
            Meteor.call("addEntity", patient);

            

            
        });
            
       
        
        
    }
});