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
       
        var data = _.object($("#profileForm").serializeArray().map(function(v) {return [v.name, v.value];} ));
        Meteor.call('updateProfile', data);
    }
});