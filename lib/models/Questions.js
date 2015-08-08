Questions = new Mongo.Collection('biolog_questions');

Questions.attachSchema(
    new SimpleSchema({
        question: { type: String, index: 1 }, //the text of the question
        abbrev: { type: String, index: 1 }, //the text of the question
        description: { type: String, index: 1 }, //lower case of the text value that is mapped
        measure: { type: String, optional: true }, //the type of measurement,
        flags: { type: [String], optional: true, index: 1 }, //the flags that trigger this question
        valid: { type: Number, defaultValue: 0, index: 1 }, //the validity score of the data
        priority: { type: Number, decimal: true, defaultValue: 0, index: 1 }, //higher priority generally get asked earlier
        created: { type: Date, defaultValue: new Date(), denyUpdate: true },
        updated: { type: Date, optional: true },
        deleted: { type: Date, optional: true },
        creator: { type: String, index: 1, denyUpdate: true },
        updater: { type: String, index: 1, optional: true },
        deleter: { type: String, index: 1, optional: true }
        //used: { type: Date, optional: true }, //date last used
        //useCount: { type: Number, index: -1, defaultValue: 0 } //number of times this mapping has been used
  })
);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Questions.allow({
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
