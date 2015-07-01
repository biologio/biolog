Meteor.startup(function () {
    if(Meteor.users.find().count() < 1000) {
      _.each(_.range(1000 - Meteor.users.find().count()), function(){
        var randomEmail = faker.internet.email();
        var randomName = faker.name.findName();
        var userName = faker.internet.userName();
        Accounts.createUser({
          username: userName,
          profile: {
            name: randomName,
          },
          email: randomEmail,
          password: 'password'
        });
      });
    }
});