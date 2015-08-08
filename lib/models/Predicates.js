Predicates = new Mongo.Collection('biolog_predicates');

Predicates.attachSchema(
    new SimpleSchema({
        name: { type: String, label: "Name" }, //the canonical name
        description: { type: String, optional: true, label: "Description" }, //the description
        subjectEtypes: { type: [String], optional: true }, //the subject etypes to which this predicate might be applied
        objectEtypes: { type: [String], optional: true }, //the object etypes to which this predicate might be applied
        measure: { type: String, optional: true }, //the type of measure, if any
        valid: { type: Number, defaultValue: 0, index: 1 }, //the validity score
        created: { type: Date, defaultValue: new Date(), denyUpdate: true },
        updated: { type: Date, optional: true },
        deleted: { type: Date, optional: true },
        creator: { type: String, index: 1, denyUpdate: true },
        updater: { type: String, index: 1, optional: true },
        deleter: { type: String, index: 1, optional: true }
  })
);

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
