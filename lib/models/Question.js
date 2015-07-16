biolog_questions = new Mongo.Collection('biolog_questions');

Question = Astro.Class({
    name: "Question",
    collection: biolog_questions,
    fields: {
        question: {type: "string"}, //the text of the question
        abbrev: {type: "string"}, //the text of the question
        description: {type: "string"}, //lower case of the text value that is mapped
        measure: {type: "string"}, //the type of measurement,
        flags: {type: ["string"]}, //the flags that trigger this question
        valid: {type: "number", default: 0}, //the validity score of the data
        priority: {type: "number", default: 0}, //higher priority generally get asked earlier
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
    biolog_questions.allow({
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
