Etypes = new Mongo.Collection('Etypes');

Etypes.attachSchema(
    new SimpleSchema({
        name: { type: String, label: "Name" }, //the canonical name
        description: { type: String, label: "Description", optional: true }, //the description
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
