Entities = new Mongo.Collection('Entities');

Entities.attachSchema(
    new SimpleSchema({
        name: { type: String, label: "Name" }, //the canonical name
        nickname: { type: String, label: "Nickname", optional: true }, //an abbreviation of nickname
        nameLC: { type: String }, //lower case version of the canonical name
        synonyms: {type: [String], optional: true}, //other names for this
        description: { type: String, label: "Description", optional: true }, //the description
        etypes: { type: [String]}, //the types of this entity
        parents: { type: [String], optional: true}, //the parents of this entity
        source: { type: String, optional: true }, //the data source that this fact came in,
        data: { type: Object, optional: true, blackbox: true },//current facts tagged to this entity
        valid: { type: Number, defaultValue: 0, index: 1 }, //the validity score
        created: { type: Date, defaultValue: new Date(), denyUpdate: true, index: 1 },
        creator: { type: String, index: 1 },
        owners: { type: [String], optional: true}
  })
);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Entities.allow({
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
