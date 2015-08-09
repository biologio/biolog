Meteor.subscribe("country");
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
        console.log("countries called");
        // var Country = new Mongo.Collection("country");
        console.log(Country.find({}));
        return Country.find({});
        // console.log(aa);
        // return Meteor.call("countries");
    }
    
    
});
Template.country.helpers({
    isResidenceOf: function(countryOfResidenceCode) {
        return Meteor.user().profile.countryOfResidence == countryOfResidenceCode;
    }
});
Template.profile.events({
    'click #saveProfile': function(e) {
        // Update profile
        var data = _.object($("#profileForm").serializeArray().map(function(v) {return [v.name, v.value];} ));
        console.log(data);
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