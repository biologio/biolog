Template.conditionsMedicationsFeed.helpers({
     medications: function(){
        return Session.get("postFacts");
     } 
     // function() {
     //     return Facts.find({
     //         $or: [{
     //             pred: "patient/medication",

     //         }, {
     //             pred: "patient/condition",
     //         }],
     //         $and: [{
     //             creator: Meteor.userId()
     //         }]
     //     }, {
     //         sort: {
     //             created: -1
     //         }
     //     })
     // }
 });

 Template.conditionsMedicationsFeed.events({
     "click .card, click .bubble": function(event, template) {
         console.log(this);
         if(this.pred == "patient/medication"){
             Session.set("biolog:medications/med.editing", this);
         }
         else {
         //console.log("clicked: " + JSON.stringify(this));
         Session.set("biolog:conditions/condition.editing", this);
     }
         //Session.set("biolog.med.modal.open", true);
     },
     "click .icon":function(event, template){
        //$(event.target)
        console.log(event.target)
          var postFacts = Session.get("postFacts");
         var self = this;
         var post =_.reject(postFacts, function(element){
           return element.objName == self.objName;
            
         });
         Session.set("postFacts", post)
        //$(event.target).parents(".bubble").removeClass("inserted slideInLeft").addClass("slideOutUp")
        return false;
     }
 });
 Template.conditionsMedicationsFeed.rendered = function() {
     // ...
 
 };
 Template.conditionsMedicationsFeed.animations({

     ".bubble, .notice, .card": {
         animateInitial: true, // animate the intial elements
         animateInitialStep: 1000, // Step between each animation for each initial item
         animateInitialDelay: 0,
         container: ".animated", // container of the ".item" elements
         in : "animated fast slideInLeft", // class applied to inserted elements (animations courtesy of animate.css)
         out: "animated fast fadeOutRight", // class applied to removed elements
         inCallback: function() {
             // var title = $(this).find(".title").text();
             //Logs.insert({ text: "Inserted " + title + " to the DOM" });
         },
         outCallback: function() {
             // var title = $(this).find(".title").text();
             //Logs.insert({ text: "Removed " + title + " from the DOM" });
         }
     }
 });