biolog_flags = new Mongo.Collection('biolog_flags');

Flag = Astro.Class({
    name: "Flag",
    collection: biolog_flags,
    fields: {
        name: {type: "string", index: 1}, //the text of the question
        description: {type: "string"}, //lower case of the text value that is mapped
        created: {type: "date", default: new Date(), index: 1},
        updated: {type: "date"},
        deleted: {type: "date"},
        creator: {type: "string", index: 1},
        updater: {type: "string"},
        deleter: {type: "string"}
        //used: { type: "date" }, //date last used
        //useCount: { type: Number, index: -1, defaultValue: 0 } //number of times this mapping has been used
    }
});

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  biolog_flags.allow({
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
