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

         Bioontology.annotate(postHTML, function(err, annotations, button) {
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
         Bioontology.annotate(postUpdateText, function(err, annotations, button) {
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

     }

 });


 UI.registerHelper("momentNow", function(date) {
     var m = moment(this.created);
     if (m.isValid()) return m.fromNow();
 })


 function savePostFact(object) {
     //var med = JSON.parse(object.attr("data-collection"));
     var postFacts = Session.get("postFacts")
     if (Bioontology.getOntologiesType(object) == "cond") {
         var fact = Conditions.createConditionFact(getPatient()._id, object.annotatedClass);
         //fact.definition = object.annotatedClass.definition[0] || "no definition found";
         //fact.definition = object.annotatedClass
         if (postFacts) {
             postFacts.push(fact);
             Session.setPersistent("postFacts", postFacts);
         } else {

             Session.setPersistent("postFacts", [fact]);
         }

         
         Bioontology.addConditionClasses(fact, Bioontology.getApiKey(),

         return
         Bioontology.getConditionClasses(med,

             //callback to add a condition:
             function(conditionToAdd) {
                 //add condition to the fact
                 Conditions.addConditionClass(fact, conditionToAdd);
             },
             //final callback:
             function(err) {
                 if (err) {
                     console.error("Unable to addClasses: " + JSON.stringify(err));
                 }

                 saveProperty(fact, function(err, success) {
                     if (err) {
                         console.error("Unable to save condition fact: " + err + "\n" + JSON.stringify(fact));
                         return;
                     }
                 });
             });
         return
     } else {
         var fact = Medications.createMedFact(getPatient()._id, object.annotatedClass)
             //fact.definition = object.annotatedClass.definition[0] || "no definition found";
             //med.properties = med.properties || [];
         if (postFacts) {
             postFacts.push(fact);
             Session.setPersistent("postFacts", postFacts);
         } else {

             Session.setPersistent("postFacts", [fact]);
         }

     
         Bioontology.addIngredients(fact,
             function(ingred) {
                 var addingError = Medications.addMedIngredient(fact, ingred);
                 if (addingError) return callback(addingError);
             },
             function(err) {

         return
         Bioontology.getIngredients(med,
             //function(ingred) {
             //    var addingError = Medications.addMedIngredient(fact, ingred);
             //    if (addingError) return callback(addingError);
             //},
             function(err, ingredients) {

                 if (err) {
                     var msg = "Unable to addIngredients: " + err;
                     console.error(msg);
                     if (callback) callback(msg);
                     return;
                 }

                 for (var ingredI in ingredients) {
                     var ingredient = ingredients[ingredI];
                     var addingError = Medications.addMedIngredient(fact, ingredient);
                     if (addingError) return callback(addingError);
                 }

                 var ingredients = fact.data[Medications.PREDICATE_INGREDIENT._id];
                 console.log("\n\nNext add med classes: " + JSON.stringify(ingredients));
                 var ingredientCuis = Object.keys(ingredients);

                 Bioontology.getMedClassesForEachGenericCui(ingredientCuis,
                     //function(medClass) {
                     //    var addingError = Medications.addMedClass(fact, medClass);
                     //    if (addingError) return callback(addingError);
                     //},
                     function(err, medClasses) {
                         if (err) {
                             console.error("Error adding med class: " + err);
                         }
                         for (var medClassI in medClasses) {
                             var medClass = medClasses[medClassI];
                             var addingError = Medications.addMedClass(fact, medClass);
                             if (addingError) return callback(addingError);
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
         FeedMedications.insert(fact)
         console.log(fact);

     }
 }

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