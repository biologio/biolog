 Template.feed.helpers({
     postLists: function() {
         return {
             facts: Facts.find({
                 pred: "patient/post", creator:Meteor.userId()
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
console.log("loaded");
      $("#post").atwho({
         at: "#",
         maxLen: 20,
         //startWithSpace: true,
         displayTimeout: 300,
         // highlight_first suggestion in popup menu
         highlightFirst: true,
         // delay time trigger At.js while typing. For example: delay: 400
         delay: null,
         limit:20,
         // suffix for inserting string.
         suffix: " ",
         // don't show dropdown view without `suffix`
         hideWithoutSuffix: false,
         displayTpl: "<li data-sign='${at}' data-semanticType='${semanticType}'  data-name='${data}'>${name} </li>",

         callbacks: {
             remoteFilter: function(query, callback) {
                 $.getJSON(getUrlSearch(biolog.Bioontology.ONTOLOGIES_HEALTH), {
                     q: query
                 }, function(data) {
                      console.log(data);
                     if (data.collection.length > 0) {
                         conditions = $.map(data.collection, function(value, i) {
                             return {
                                 'id': i,
                                 'at': "@",
                                 'name': data.collection[i].prefLabel,
                                 'data': data.collection[i].prefLabel.replace(/\s/g, '-'),
                                 //'desc': data.collection[i].definition. ? data.collection[i].definition[0] : "no description",
                                 //'link': data.collection[i]['@id'],
                                 //'collection': JSON.stringify(data.collection[i]),
                                 'semanticType': data.collection[i].semanticType
                             };
                         });
                         // console.log(conditions)
                         callback(conditions)
                         return;
                     }

                     callback(null);
                 });
             },
              // beforeInsert:function(value, $li) {
              //   console.log(value, $li)
              //   return value.replace("#", '');
              // },
              // sorter:  function(query, items, searchKey){
              //   console.log(query, items, searchKey);
              //    items = _.sortBy(items, 'name');
              //   return items;
              // }
         }
     })
 };
 Template.feed.events({
     'click .publish': function(e, tpl) {
         
         e.preventDefault();
         post = tpl.find('#post');
         if(!post.value) return;
         $(e.target).addClass("loading");
         var postHTML = post.value;
        if(postHTML.indexOf("#") > -1){
//              postHTML = postHTML.replace(/\#(.+?):/g, function replacer(match, word, index) {
//                        console.log(match)
//                     // var link = '';
// // +                     Meteor.medArr.forEach(function(element, index) {
// // +
// // +                         if (element.id == word.replace(/\s+/g, '-')) {
// // +                             link = element.link;
// // +
// // +                         }
// // +                     });
//                     return  word//"<a href=" + link + ">" + word + "</a>";
//                 });
        }
         var button = $(e.target);


         //Bioontology.annotate(postHTML, Bioontology.ONTOLOGIES_HEALTH, function(err, annotations) {
         biolog.Bioontology.annotateHealth(postHTML, function(err, annotations) {

             //conslole.log(value);
             if (err) {
                 console.log(err)
                 return;
             }
             console.log("Bioontology annotations=" + JSON.stringify(annotations, null, "  "));

             annotations = _.uniq(annotations)
             annotations.forEach(function(element, index) {
                element.semanticType = biolog.Bioontology.getItemSemanticTypes(element.annotatedClass)
                savePostFact(element);
                 console.log(element)
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
         console.log("edit")
         var actionButton = $(e.target);

         if (actionButton.hasClass("ion-edit")) {
              $(".post-input").atwho({
         at: "#",
          maxLen: 20,
         //startWithSpace: true,
         displayTimeout: 300,
         // highlight_first suggestion in popup menu
         highlightFirst: true,
         // delay time trigger At.js while typing. For example: delay: 400
         delay: null,
         limit:20,
         // suffix for inserting string.
         suffix: " ",
         // don't show dropdown view without `suffix`
         hideWithoutSuffix: false,
          displayTpl: "<li data-sign='${at}' data-semanticType='${semanticType}'  data-name='${data}'>${name} </li>",

         callbacks: {
             remoteFilter: function(query, callback) {
                 $.getJSON(getUrlSearch(biolog.Bioontology.ONTOLOGIES_HEALTH), {
                     q: query
                 }, function(data) {
                      //console.log(data);
                     if (data.collection.length > 0) {
                         conditions = $.map(data.collection, function(value, i) {
                             return {
                                 'id': i,
                                 'at': "@",
                                 'name': data.collection[i].prefLabel,
                                 'data': data.collection[i].prefLabel.replace(/\s/g, '-'),
                                 'desc': data.collection[i].definition ? data.collection[i].definition[0] : "no description",
                                 'link': data.collection[i]['@id'],
                                 'collection': JSON.stringify(data.collection[i]),
                                 'semanticType': data.collection[i].semanticType
                             };
                         });
                         // console.log(conditions)
                         callback(conditions)
                         return;
                     }

                     callback(null);
                 });
             },
              // beforeInsert:function(value, $li) {
              //   console.log(value, $li)
              //   return value.replace("#", '');
              // }
         }
     })

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
         //Bioontology.annotate(postUpdateText, Bioontology.ONTOLOGIES_HEALTH, function(err, annotations, button) {
             //conslole.log(value);

         biolog.Bioontology.annotateHealth(postUpdateText, function(err, annotations, button) {             if (err) {
                 console.log(err)
                 return;
             }
             console.log("Bioontology annotations=" + JSON.stringify(annotations, null, "  "));

             annotations = _.uniq(annotations)
             annotations.forEach(function(element, index) {
                 savePostFact(element);
                 console.log(element)
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
                         Bert.alert({
  //title: 'Updated!',
  message: 'Post updated!',
  type: 'success-purple',
  style: 'growl-top-right',
  icon: 'ion ion-android-done'
});
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
     'click .close-message': function() {
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
     var postFacts = Session.get("postFacts") || [];
     if (getOntologiesType(object) == "cond") {
         var condition = biolog.Conditions.constructConditionFact(getPatient()._id, object.annotatedClass, cb);

     } else {
         var med = biolog.Medications.constructMedFact(getPatient()._id, object.annotatedClass, cb)

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

 function SetSession(sessionKey, value, type) {
     if (!value) return;
     if (type === "setAuth") {
         Session.setAuth(sessionKey, value)
     } else {
         Session.set(sessionKey, value)
     }
 }

 function cb(err, data) {
     if (!err)
         var postFacts = Session.get("postFacts") || [];
     isAlreadyAdded = _.find(postFacts, function(post) {
         return post.objName == data.objName;
     });
     if(data){
         postFacts.push(data);
     }
    
     if (data && !isAlreadyAdded) {

         Session.setAuth("postFacts", postFacts);
     }
 }

function getUrlSearch(ontologies) {
    var apiKey = biolog.Bioontology.getApiKey();
    var searchUrl = biolog.Bioontology.getBaseUrlSearch();
    return searchUrl + "?suggest=true" +
        "&ontologies=" + ontologies +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&apikey=" + apiKey;
};

 
