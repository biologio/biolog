Meteor.publish("Facts", function() {
    return Facts.find();
});
Meteor.publish('userData', function() {
    return Meteor.users.find({}, {
        fields: {
            profile: 1
        }
    });
});
