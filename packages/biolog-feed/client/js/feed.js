 Template.feed.helpers({
     postLists: function() {
         return {
             facts: Facts.find({
                 pred: "patient/post"
             }, {
                 sort: {
                     created: -1
                 }
             }).map(function(fact) {
                 fact.commentCount = Facts.find({
                     pred: "post/comment",
                     postId: fact._id
                 }).count()
                 fact.isOwner = Meteor.userId() == fact.creator ? true : false;
                 if (fact.likes) {
                     fact.likesCount = fact.likes.length;
                 } else {
                     fact.likesCount = 0;
                 }
                 fact.liked = _.contains(fact.likes, Meteor.userId())
                 var owner = Meteor.users.findOne({
                     _id: fact.creator
                 });
                 // console.log(owner)
                 fact.owner = owner.profile.firstName + ' ' + owner.profile.lastName;

                 return fact;
             }),
             name: Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName,

         }
     },
     getHumanizeDate: function() {
         var m = moment(this.created);
         if (m.isValid()) return m.fromNow();
     },
     getPostComments: function(id) {
         //  console.log(id);
         return Facts.find({
             pred: "post/comment",
             postId: id
         }, {
             sort: {
                 created: -1
             }
         }).map(function(post) {
             // console.log(post);
             var owner = Meteor.users.findOne({
                 _id: post.creator
             });
             // console.log(owner)
             post.owner = owner.profile.firstName + ' ' + owner.profile.lastName;
             //  console.log(post);
             return post;
         });
     }
 });
 Template.feed.rendered = function() {

     $("body").addClass('feed');
 };
 Template.feed.events({
     'click .publish': function(e, tpl) {
         $(e.target).addClass("loading");
         e.preventDefault();
         post = tpl.find('#post');
         var postHTML = post.value;
         var button = $(e.target);

         Bioontology.annotate(postHTML, Bioontology.ONTOLOGIES_HEALTH, function(err, annotations) {
             //conslole.log(value);
             if (err) {
                 console.log(err)
                 return;
             }
             console.log("Bioontology annotations=" + JSON.stringify(annotations, null, "  "));

             annotations = _.uniq(annotations)
             annotations.forEach(function(element, index) {
                 savePostFact(element);
             });

             postHTML = UniHTML.purify(postHTML);
             if (postHTML) {
                 var postFact = createFactOjbect("patient/post", postHTML)
                 saveFact(postFact, function(err, data) {
                     if (!err) {
                         post.value = '';
                     }
                 })

             }
             $(".publish").removeClass("loading")
         });

     },
     'click a.comment': function(e, tpl) {
         // console.log(this);
         $(e.target).parents('.event').find('.input').toggleClass('hide');
         e.preventDefault();
     },
     'keypress .input input': function(e, tpl) {
         var keycode = (e.keyCode ? e.keyCode : e.which);
         if (keycode == '13') {

             if (e.target.value) {
                 var postComment = createFactOjbect("post/comment", e.target.value);
                 postComment = extendObject(postComment, [{
                     name: "postId",
                     value: this._id
                 }]);
                 saveFact(postComment, function(err, data) {
                     if (!err) {
                         e.target.value = '';
                         //  console.log(data);
                     }
                 })

             }
         }
     },
     'click .post-edit': function(e, tpl) {
         // tpl.isEditMode.set(true);
         var actionButton = $(e.target);

         if (actionButton.hasClass("ion-edit")) {
             actionButton.next('.text').addClass('hide');
             if (actionButton.prev('.section-post-edit').find("textarea")[0].value.indexOf("</a>") > -1) {
                 var value = actionButton.prev('.section-post-edit').find("textarea")[0].value;

             }

             actionButton.prev('.section-post-edit').removeClass("hide");
             actionButton.addClass("ion-android-close").removeClass('ion-edit');
             return;
         } else if (actionButton.hasClass("ion-android-close")) {
             actionButton.next('.text').removeClass('hide');
             actionButton.prev('.section-post-edit').addClass("hide");
             actionButton.addClass("ion-edit").removeClass('ion-android-close');
             return;
         }

         //console.log(this)
     },
     'click button.post-update': function(e, tpl) {
         var postUpdateText = $(e.currentTarget).parent('div').siblings('.textarea').val();
         var postId = this._id;
         Bioontology.annotate(postUpdateText, Bioontology.ONTOLOGIES_HEALTH, function(err, annotations, button) {
             //conslole.log(value);
             if (err) {
                 console.log(err)
                 return;
             }
             console.log("Bioontology annotations=" + JSON.stringify(annotations, null, "  "));

             annotations = _.uniq(annotations)
             annotations.forEach(function(element, index) {
                 // var cui = Bioontology.getItemCui(element.annotatedClass);
                 // var prefLabel = Bioontology.getItemPreferredLabel(element.annotatedClass);
                 // var altLabels = Bioontology.getItemAlternateLabels(element.annotatedClass);
                 // console.log(cui, prefLabel, altLabels);
                 savePostFact(element);
             });

             postUpdateText = UniHTML.purify(postUpdateText);
             if (postUpdateText) {

                 Facts.update({
                     _id: postId
                 }, {
                     $set: {
                         text: postUpdateText
                     }
                 }, function(err, data) {
                     if (err) {
                         //console.log(err)
                     } else {
                         // console.log(data);
                         var actionButton = $('.post-edit');
                         actionButton.next('.text').removeClass('hide');
                         actionButton.prev('.section-post-edit').addClass("hide");
                         actionButton.addClass("ion-edit").removeClass('ion-android-close');
                     }
                 });

             }
             // $(".publish").removeClass("loading")
         });
         //console.log(this);


     },
     'click a.like': function(e, tpl) {
         Facts.update({
             _id: this._id
         }, {
             $push: {
                 likes: Meteor.userId()
             }
         }, function(err, data) {
             if (err) {
                 console.log(err)
             } else {
                 console.log(data)
             }
         });

     },
     'click a.unlike': function(e, tpl) {

         Facts.update({
             _id: this._id
         }, {
             $pop: {
                 likes: Meteor.userId()
             }
         }, function(err, data) {
             if (err) {
                 console.log(err)
             } else {
                 console.log(data)
             }
         });

     },
     'click .close-message': function () {
           $(".message").slideUp('fast');
        }

 });


 UI.registerHelper("momentNow", function(date) {
     var m = moment(this.created);
     if (m.isValid()) return m.fromNow();
 })


 

 // add properties to object 
 function extendObject(obj, arrProperties) {
     if (!obj) return;
     arrProperties.forEach(function(element, index) {
         obj[element.name] = element.value
     });
     return obj;
 }
 // create fact object
 function createFactOjbect(pred, text) {
     var fact = {
         subj: getPatient()._id ? getPatient()._id : null,
         pred: pred,
         text: text,
         valid: 1,
         creator: Meteor.userId() ? Meteor.userId() : null
     }
     return fact;
 }



 function savePostFact(object) {
     var postFacts = Session.get("postFacts")
     if (getOntologiesType(object) == "cond") {
         var condition = Conditions.constructConditionFact(getPatient()._id, object.annotatedClass, function(err, data){
        var postFacts = Session.get("postFacts")
            console.log(data)
              if (postFacts) {
             postFacts.push(data);
             Session.setPersistent("postFacts", postFacts);
         } else {

             Session.setPersistent("postFacts", [data]);
         }
         });

       


     } else {
         var med = Medications.constructMedFact(getPatient()._id, object.annotatedClass, function(err, data){
             if (postFacts) {
             postFacts.push(data);
             Session.setPersistent("postFacts", postFacts);
         } else {

             Session.setPersistent("postFacts", [data]);
         }
            
         })

       
        
      
    
    
        

     }
 }

 function getOntologiesType(item) {
     if (!item) return;
     if (item.annotatedClass["@id"] && (item.annotatedClass["@id"].indexOf("MEDLINEPLUS") != -1 || item.annotatedClass["@id"].indexOf("ICD10CM") != -1)) {
         return "cond";
     } else {
         return "med";
     }
 };


 saveMedFactWithIngredientsAndClasses = function(ptid, med, callback) {
    //console.log("Saving med: " + JSON.stringify(med));
    if (!med) return;

    Medications.constructMedFact(ptid, med, function(err, fact) {
        if (err) return callback(err);

        saveProperty(fact, function(err, success) {
            if (err) {
                var msg = "Unable to save medication fact: " + err + "\n" + JSON.stringify(fact);
                console.error(msg);
                if (callback) callback(msg);
                return;
            }


            var ingredients = fact.data[Medications.PREDICATE_INGREDIENT._id];
            console.log("\n\nNext add med classes: " + JSON.stringify(ingredients));
            var ingredientCuis = Object.keys(ingredients);

            Bioontology.addMedClassesForEachGenericCui(ingredientCuis,
                function(medClass) {
                    var addingError = Medications.addMedClass(fact, medClass);
                    if (addingError) return callback(addingError);
                },
                function(err, result) {
                    if (err) {
                        console.error("Error adding med class: " + err);
                    }
                    //console.log("\n\n\nSaving med fact:" + JSON.stringify(fact));
                    saveProperty(fact, function(err, success) {
                        if (err) {
                            var msg = "Unable to save medication fact: " + err + "\n" + JSON.stringify(fact);
                            console.error(msg);
                            if (callback) callback(msg);
                            return;
                        }
                        if (callback) return callback(null, fact);
                    });
                });
        });
            if (callback) return callback(null, fact);
        });
    }