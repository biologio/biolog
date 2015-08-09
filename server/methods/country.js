/*
Country.deny({
  update: function() {
    return true;
  }
});
*/
Meteor.publish("country", function() {
    return Country.find({});
});
Meteor.methods({
    countries: function(data) {
        console.log("country findall");
        // console.log(Country.find({}).fetch());
        return Country.find({}).fetch();
    }
});

