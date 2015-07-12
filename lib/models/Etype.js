Etypes = new Mongo.Collection('Etypes');

Etype = Astro.Class({
    name: "Etype",
    collection: Etypes,
    fields: {
        name: {type: "string"}, //the canonical name
        description: {type: "string"}, //the description
        valid: {type: "number", default: 0}, //the validity score
        created: {type: "date", default: new Date()},
        updated: {type: "date"},
        deleted: {type: "date"},
        creator: {type: "string"},
        updater: {type: "string"},
        deleter: {type: "string"}
    }
});

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Etypes.allow({
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
