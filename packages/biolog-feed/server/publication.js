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
Meteor.publish("feedback", function() {
    return Feedback.find();
});