Units = new Mongo.Collection('Units');
Measures = new Mongo.Collection('Measures');

Schemas = {};

Schemas.Unit = new SimpleSchema({
    name: { type: String }, //the canonical name
    abbrev: { type: String, optional: true }, //the abbreviation
    convert: { type: Number, decimal: true, optional: true } //multiply this a value with the current unit by this value to get its canonical value
});
Units.attachSchema(Schemas.Unit);

Schemas.Measure = new SimpleSchema({
    name: { type: String, label: "Name" }, //the canonical name
    description: { type: String, optional: true, label: "Description" }, //the description
    units: { type: [ String ] }
  });
Measures.attachSchema(Schemas.Measure);

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
