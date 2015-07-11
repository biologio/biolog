Predicates = new Mongo.Collection('Predicates');

Predicate = Astro.Class({
    name: "Predicate",
    collection: Predicates,
    fields: {
        name: {type: "string"}, //the canonical name
        description: {type: "string"}, //the description
        subjectEtypes: {type: ["string"]}, //the subject etypes to which this predicate might be applied
        objectEtypes: {type: ["string"]}, //the object etypes to which this predicate might be applied
        measure: {type: "string"}, //the type of measure, if any
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
  Predicates.allow({
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
