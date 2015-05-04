ownsDocument = function(userId, doc) {
    return doc && doc.userId === userId;
};

isUser = function(userId) {
    if (Meteor.user()) return true;
    return false;
};

isAdmin = function(userId) {
    if (Meteor.user() && Meteor.user().role >= 1) return true;
    return false;
};