Rules = new Mongo.Collection('Rules');

Rule = Astro.Class({
    name: "Rule",
    collection: Rules,
    fields: {
        name: {type: "string"},
        description: {type: "string"}, //the description
        etypes: {type: ["string"]}, //the types of entities this can be applied to
        contexts: {type: ["string"]}, //a list of tags that can be used for filtering rules.  Examples: health, fatigue
        inputs: {type: ["string"]}, //the input properties that this rule requires
        block: {type: "object"}, //object containing nested rule logic. Has conjunction, array of clauses, and array of blocks
        ifQuery: {type: "object"}, //the ElasticSearch filter/ query, capable of being percolated (apply many rules to 1 entity) or searched (apply 1 rule to many entities)
        then: {type: ["object"]}, //array containing consequents.  Each has a predicate and object.  Value can be static or from formula
        source: {type: "string"}, //the data source that this rule came from,
        votesT: {type: "number", default: 1}, //number of votes that this is true
        votesF: {type: "number", default: 0}, //number of votes that this is false
        truth: {type: "number", default: 1.0}, //an estimation of the truth, 0-1, that is computed and updated, based on credentials of those who voted
        valid: {type: "number", default: 0}, //the validity score of the data
        current: {type: "number", default: 1}, //1=current, 0=superseded by new rule
        created: {type: "date", default: new Date()},
        updated: {type: "date"},
        deleted: {type: "date"},
        creator: {type: "string"},
        updater: {type: "string"},
        deleter: {type: "string"},
        priority: {type: "number"}
    }
});

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Rules.allow({
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
