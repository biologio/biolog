  Feedback = new Mongo.Collection('Biolog_feedback');


Feedback.attachSchema(
    new SimpleSchema({
        type: { type: String, label: "Type", optional: true },    
        content: { type: String, label: "Feedback"}, 
        created: { type: Date, defaultValue: new Date() },
        creator: { type: String, index: 1, denyUpdate: true }
        

  })
);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Feedback.allow({
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
