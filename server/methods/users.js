Meteor.users.deny({
  update: function() {
    return true;
  }
});

Meteor.methods({
    updateProfile: function(data) {
        console.log("updateProfile called");
        
        Meteor.users.update(Meteor.userId(), {$set: data});
    }
});

