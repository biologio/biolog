Accounts.onCreateUser(function(options, user) {
    if (user.profile == undefined) user.profile = {};
    _.extend(user.profile, { name : user.username, isAdmin:false , newUser:true});
    return user;
});

/*

*/