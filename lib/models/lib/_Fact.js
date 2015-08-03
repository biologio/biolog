biolog_facts = new Mongo.Collection('biolog_facts');

Fact = Astro.Class({
    name: "Fact",
    collection: biolog_facts,
    fields: {
        subj: {type: "string"}, //the subject
        subjName: {type: "string"}, //display name of the subject
        //header: { type: "string" }, //the header before mapping to a predicate id
        pred: {type: "string"}, //the predicate
        obj: {type: "string", index: 1}, //the object
        objName: {type: "string", index: 1}, //display name of the object
        //etypes: { type: ["string"] }, //the type of entity
        data: {type: "object"}, //sub-facts
        text: {type: "string", index: 1}, //the string value
        num: {type: "number", index: 1}, //the numeric value
        unit: {type: "string"}, //the unit of measure for this fact
        measure: {type: "string"}, //the type of measurement,
        normVal: {type: "number"}, //the normalized value (normalized to the canonical unit for that measure
        //normUnit: { type: "string" }, //the canonical unit for that normalized measure
        startDate: {type: "date", index: 1}, //the start date
        startFlag: {type: "number", default: 0, index: 1}, //the start date flag.  0=no comment.  1=beginning of time
        endDate: {type: "date", index: 1}, //the end date
        endFlag: {type: "number", default: 0, index: 1}, //the end date flag.  0=no comment.  1=forever
        source: {type: "string", index: 1}, //the data source that this fact came in,
        valid: {type: "number", default: 1, index: 1}, //the validity score of the data.  1=valid, 0=invalid
        //created: {type: "date", default: new Date(), index: 1},
        //updated: {type: "date", index: 1},
        //deleted: {type: "date"},
        creator: {type: "string", index: 1},
        updater: {type: "string"},
        deleter: {type: "string"},
        editors: {type: ["string"], index: 1}
    },

    behaviors: ['timestamp', 'softremove'],

    methods: {
        getRating: function (type) {
            if (!type) type = "overall";
            //return getValuePath(fact, "data['rating'].num");
            return this.data.rating[type].num;
        },

        setRating: function (value, type) {
            if (!type) type = "overall";
            this.data.rating[type] = {
                num: value
            }
        }
    }
});


// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  biolog_facts.allow({
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