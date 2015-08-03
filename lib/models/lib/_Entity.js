biolog_entities = new Mongo.Collection('biolog_entities');

Entity = Astro.Class({
    name: "Entity",
    collection: biolog_entities,
    fields: {
        name: {type: "string", index: 1}, //the canonical name
        nickname: {type: "string", index: 1}, //an abbreviation of nickname
        //nameLC: {type: "string", index: 1}, //lower case version of the canonical name
        synonyms: {type: ["string"]}, //other names for this
        description: {type: "string"}, //the description
        etypes: {type: ["string"], index: 1}, //the types of this entity
        parents: {type: ["string"]}, //the parents of this entity
        source: {type: "string", index: 1}, //the data source that this fact came in,
        data: {type: "object"},//current facts tagged to this entity
        valid: {type: "number", default: 0, index: 1}, //the validity score
        //created: {type: "date", default: new Date(), index: 1},
        creator: {type: "string", index: 1},
        viewers: {type: ["string"]},
        editors: {type: ["string"], index: 1}
    },

    behaviors: ['timestamp', 'softremove']

});

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  biolog_entities.allow({
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
