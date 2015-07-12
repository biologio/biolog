Entities = new Mongo.Collection('Entities');

Entity = Astro.Class({
    name: "Entity",
    collection: Entities,
    fields: {
        name: {type: "string"}, //the canonical name
        nickname: {type: "string"}, //an abbreviation of nickname
        nameLC: {type: "string"}, //lower case version of the canonical name
        synonyms: {type: ["string"]}, //other names for this
        description: {type: "string"}, //the description
        etypes: {type: ["string"]}, //the types of this entity
        parents: {type: ["string"]}, //the parents of this entity
        source: {type: "string"}, //the data source that this fact came in,
        data: {type: "object"},//current facts tagged to this entity
        valid: {type: "number", default: 0}, //the validity score
        created: {type: "date", default: new Date()},
        creator: {type: "string"},
        viewers: {type: ["string"]},
        editors: {type: ["string"], optional: true}
    }

});

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
