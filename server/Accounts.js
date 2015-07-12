Accounts.onCreateUser(function(options, user) {
  console.log(options);
var telescope = {
        commentCount: 0,
        displayName:user.username || '' ,
        downvotedComments: [],
        downvotedPosts: [],
        email: function(){
          if(!user.emails[0]){
            return '';
          }
          else{
            return user.emails[0].address;
          }
        } ,
       
        inviteCount: 3,
        invitedCount: 0,
        isDummy: false,
        isInvited: false,
        karma: 0,
        notifications: {
            users: false,
            posts: false,
            comments: true,
            replies: true
        },
        postCount: 0,
        slug: user.username || '',
        upvotedComments: [],
        upvotedPosts: []
    }

    //console.log(newUser);
    console.log("options n/", options);


    if (user.profile == undefined) user.profile = {};
    if(user.services.google) user.username = user.services.google.email.split("@")[0];
    _.extend(user.profile, {
        name: user.username,
        isAdmin: false,
        newUser: true
    });

if (user.telescope == undefined) user.telescope = telescope;
    console.log(user);

    return user;
});


/*

Meteor.users.after.insert(function () {
	var self = this;
  // the currently logged in user if there is any (might be different than the new user
  console.log( self._id, "after");
  Meteor.setTimeout(function(){

  console.log(TempData.find({}).count());
  user = TempData.findOne({username:self.args[0].username});
  console.log(user);
   newUser  ={
	username:self.args[0].username,
	email:self.args[0].emails[0].address,
	password:user.pass,
	biologId:self._id
}
console.log(newUser);
 var connection = DDP.connect("http://community-biolog.meteor.com/");
connection.call("registerUser", newUser )
TempData.remove();
  }, 2000)




});
*/
