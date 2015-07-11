Units = new Mongo.Collection('Units');
Measures = new Mongo.Collection('Measures');

Unit = Astro.Class({
    name: "Unit",
    collection: Units,
    fields: {
        name: { type: 'string' }, //the canonical name
        abbrev: { type: 'string', optional: true }, //the abbreviation
        convert: { type: 'number', decimal: true, optional: true } //multiply this a value with the current unit by this value to get its canonical value
    }

});


Measure = Astro.Class({
    name: "Measure",
    collection: Measures,
    fields: {
        name: {type: 'string'}, //the canonical name
        description: {type: 'string', optional: true}, //the description
        units: {type: ['string']}
    }
});

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
    Units.allow({
        insert : function () {
            return isUser;
        },
        update : function () {
            return false;
        },
        remove : function () {
            return false;
        }
    });

    Measures.allow({
      insert : function () {
          return isUser;
      },
      update : function () {
          return false;
      },
      remove : function () {
          return false;
      }
    });
}
