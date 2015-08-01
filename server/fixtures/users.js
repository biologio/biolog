Meteor.startup(function () {
    var user_to_create = 1000;
    var no_of_users = Meteor.users.find().count();
    if(no_of_users < user_to_create) {
      _.each(_.range(user_to_create - no_of_users), function(){
        var randomEmail = faker.internet.email();
        var randomName = faker.name.findName();
        var userName = faker.internet.userName();
        var user_id = Accounts.createUser({
          username: userName,
          profile: {
            name: randomName,
          },
          email: randomEmail,
          password: 'password'
        });
        // console.log(user_id);
        // var user = Meteor.users.find({_id: user_id});
        
        // console.log(user);
        var patientId = "patient/" + user_id;
        
        var entity = createPatient(patientId, randomName);
        entity.creator = user_id;
        entity.owners = [user_id];
        var theDate = new Date();
        entity.created = theDate;
        entity.valid = 1;
        biolog_entities.insert(entity);
        // console.log(entity);

        
        
        
      });
    }
    
   
});