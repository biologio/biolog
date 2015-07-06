/*
Country.deny({
  update: function() {
    return true;
  }
});
*/
Meteor.methods({
    countries: function(data) {
        console.log("country findall");
        return Country.find({});
    }
});

