Flags = new Mongo.Collection('Flags');

Flag = Astro.Class({
    name: "Flag",
    collection: Flags,
    fields: {
        name: {type: "string"}, //the text of the question
        description: {type: "string"}, //lower case of the text value that is mapped
        created: {type: "date", default: new Date()},
        updated: {type: "date"},
        deleted: {type: "date"},
        creator: {type: "string"},
        updater: {type: "string"},
        deleter: {type: "string"}
        //used: { type: "date" }, //date last used
        //useCount: { type: Number, index: -1, defaultValue: 0 } //number of times this mapping has been used
    }
});

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Flags.allow({
      insert : function () {
          return isUser;
      },
      update : function () {
          return isUser;
      },
      remove : function () {
          return false;
      }
  });
}
