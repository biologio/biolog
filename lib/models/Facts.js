Facts = new Mongo.Collection('Facts');

Facts.attachSchema(
    new SimpleSchema({
        subj: { type: String, index: 1, optional: true }, //the subject
        subjName: { type: String, optional: true }, //display name of the subject
        //header: { type: String, index: 1, optional: true }, //the header before mapping to a predicate id
        pred: { type: String, index: 1 } , //the predicate
        obj: { type: String, optional: true, index: 1 }, //the object
        objName: { type: String, optional: true }, //display name of the object
        etypes: { type: [String], optional: true, index: 1 }, //the type of entity
        data: { type: Object, blackbox: true, optional: true }, //sub-facts
        text: { type: String, optional: true }, //the string value
        num: { type: Number, decimal: true, optional: true }, //the numeric value
        unit: { type: String, optional: true }, //the unit of measure for this fact
        measure: { type: String, optional: true }, //the type of measurement,
        normVal: { type: Number, decimal: true, optional: true }, //the normalized value (normalized to the canonical unit for that measure
        //normUnit: { type: String, optional: true }, //the canonical unit for that normalized measure
        startDate: { type: Date, optional: true, index: -1 }, //the start date
        startFlag: { type: Number, defaultValue: 0, index: 1 }, //the start date flag.  0=no comment.  1=beginning of time
        endDate: { type: Date, optional: true, index: -1 }, //the end date
        endFlag: { type: Number, defaultValue: 0, index: 1 }, //the end date flag.  0=no comment.  1=forever
        source: { type: String, optional: true }, //the data source that this fact came in,
        //trueVotes: { type: Number, defaultValue: 0 }, //number of votes that this is true
        //falseVotes: { type: Number, defaultValue: 0 }, //number of votes that this is false
        //truth: { type: Number, optional: true, defaultValue: 1.0, index: 1 }, //an estimation of the truth, 0-1, that is computed and updated, based on credentials of those who voted
        valid: { type: Number, defaultValue: 1, index: 1 }, //the validity score of the data.  1=valid, 0=invalid
        //used: { type: Number, defaultValue: 0, index: -1 }, //number of times this is referenced by facts
        //current: { type: Number, defaultValue: 1, index: 1 }, //1=current, 0=superseded by new info
        created: { type: Date, defaultValue: new Date(), denyUpdate: true },
        updated: { type: Date, optional: true },
        deleted: { type: Date, optional: true },
        //outdated: { type: Date, optional: true },
        creator: { type: String, index: 1, denyUpdate: true },
        updater: { type: String, index: 1, optional: true },
        deleter: { type: String, index: 1, optional: true },
        //outdater: { type: String, index: 1, optional: true },
        supersededBy: { type: String, optional: true }, // the fact that supersedes this one
        editors: { type: [String], index:1, optional: true }
  })
);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Facts.allow({
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
