Rules = new Mongo.Collection('Rules');

Rules.attachSchema(
    new SimpleSchema({
        name: { type: String, label: "Name" },
        description: { type: String, label: "Description" }, //the description
        etypes: { type: [String], optional: true, index: 1 }, //the types of entities this can be applied to
        contexts: { type: [String], optional: true, index: 1 }, //a list of tags that can be used for filtering rules.  Examples: health, fatigue
        inputs: { type: [String], optional: true, index: 1 }, //the input properties that this rule requires
        block: { type: Object, blackbox: true, optional: true }, //object containing nested rule logic. Has conjunction, array of clauses, and array of blocks
        ifQuery: { type: Object, blackbox: true, optional: true }, //the ElasticSearch filter/ query, capable of being percolated (apply many rules to 1 entity) or searched (apply 1 rule to many entities)
        then: { type: [Object], blackbox: true, optional: true }, //array containing consequents.  Each has a predicate and object.  Value can be static or from formula
        source: { type: String }, //the data source that this rule came from,
        votesT: { type: Number, defaultValue: 1 }, //number of votes that this is true
        votesF: { type: Number, defaultValue: 0 }, //number of votes that this is false
        truth: { type: Number, optional: true, defaultValue: 1.0, index: 1 }, //an estimation of the truth, 0-1, that is computed and updated, based on credentials of those who voted
        valid: { type: Number, defaultValue: 0, index: 1 }, //the validity score of the data
        current: { type: Number, defaultValue: 1, index: 1 }, //1=current, 0=superseded by new rule
        created: { type: Date, defaultValue: new Date(), denyUpdate: true },
        updated: { type: Date, optional: true },
        deleted: { type: Date, optional: true },
        creator: { type: String, index: 1, denyUpdate: true },
        updater: { type: String, index: 1, optional: true },
        deleter: { type: String, index: 1, optional: true },
        priority: { type: Number, decimal: true, defaultValue: 100 }
  })
);

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
