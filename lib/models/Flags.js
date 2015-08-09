Flags = new Mongo.Collection('biolog_flags');

Flags.attachSchema(
    new SimpleSchema({
        name: { type: String, index: 1 }, //the text of the question
        description: { type: String, index: 1 }, //lower case of the text value that is mapped
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
