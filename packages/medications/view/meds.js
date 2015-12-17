/**
 * Created by dd on 5/16/15.
 */

Router.route('/meds', function() {
    this.render('biolog.meds');
});

Tracker.autorun(function() {
    if (Session.get("biolog:medications/meds.modal.open")) {
        $('#biologBioontologyMedsModal').modal({
            closable: true,
            onApprove: function() {
                Session.set("biolog:medications/meds.modal.open", null);
                submitBioolookupMeds();
                return true;
            },
            onDeny: function() {
                Session.set("biolog:medications/meds.modal.open", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog:medications/meds.modal.open", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog:medications/meds.modal.open"));
        $('#biologBioontologyMedsModal').modal('hide');
    }
});

Template["biologBioontologyMedsButton"].events({
    "click .biologBioontologyMedsButton": function() {
        Session.set("biolog:medications/meds.modal.open", false);
        Session.set("biolog:medications/meds.modal.open", true);
    }
});


var medsResults = new ReactiveVar();


Template["biologBioontologyMedsContent"].helpers({
    results: function() {
        return medsResults.get();
    }
});
// Template["biologBioontologyMedsContent"].rendered = function () {
//     console.log("search");
 

//     $('.ui.search')
//   .search({
//     apiSettings: {
//          onResponse: function(Response) {
//         var
//           response = {
//             results :[]
            
//           }
//         ;
//         // translate GitHub API response to work with search
//         $.each(Response.collection, function(index, item) {

//         response.results.push({title:item.prefLabel, obj:item})
         
//         });
//         return response;
//       },
//       url: 'https://data.bioontology.org/search?suggest=true&ontologies=RXNORM&semantic…ties&display_context=false&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d&q={query}'
//     },
    
//     minCharacters : 3,
//     onSelect:function(result, response){
//         console.log(result, response)

//          var med = result.obj;
//         console.log("clicked: " + JSON.stringify(med));
//         medsResults.set([med]);
//         Session.set("biolog:medications/meds.results", med);

//           if (medsResults.get() && medsResults.get().length > 0) {
//                 Session.set("biolog:medications/meds.results", medsResults.get()[0]);
//                 medsResults.set([]);
//                 return submitBioolookupMeds();
//             }
//         // Session.set("biolog:medications/meds.results", result.obj);
//         //         medsResults.set([]);
//     }
//   })
// ;
    
// };
Template["biologBioontologyMedsContent"].events({
    "input .prompt": function(event, template) {
        console.log("input .prompt", template.find("#biologBioontologySearchMedsBox").value);

        //if return character, submit the form
        if (event.which === 13) {
            if (Session.get("biolog:medications/meds.results")) {
                return submitBioolookupMeds();
            }
            if (medsResults.get() && medsResults.get().length > 0) {
                Session.set("biolog:medications/meds.results", medsResults.get()[0]);
                medsResults.set([]);
                return submitBioolookupMeds();
            }
        }

        Session.set("biolog:medications/meds.results", null);
        var q = template.find("#biologBioontologySearchMedsBox").value;

        biolog.Bioontology.searchMeds(q, function(err, meds) {
            if (err) {
                return medsResults.set([]);
            }
            medsResults.set(meds);
        });

        //var url = getUrlLookupMeds(q);
        //HTTP.get(url, function (err, response) {
        //    if (err) {
        //        return medsResults.set([]);
        //    }
        //    var json = JSON.parse(response.content);
        //    //console.log("Received data: " + JSON.stringify(json.collection));
        //    medsResults.set(json.collection);
        //});
    },

    "click .biologBioontologyMedsResult": function(event, template) {
        var med = this;
        //console.log("clicked: " + JSON.stringify(selectedMed));
        medsResults.set([med]);
        Session.set("biolog:medications/meds.results", med);
    }
});


submitBioolookupMeds = function() {
    Session.set("biolog:medications/meds.modal.open", null);
    var med = Session.get("biolog:medications/meds.results");
    var ptid = getPatient()._id;

    saveMedFactWithIngredientsAndClasses(ptid, med);
};

saveMedFactWithIngredientsAndClasses = function(ptid, med, callback) {
    //console.log("Saving med: " + JSON.stringify(med));
    if (!med) return;
    delete med.semanticType;

    biolog.Medications.constructMedFact(ptid, med, function(err, fact) {
        if (err) return callback(err);

        saveProperty(fact, function(err, success) {
            if (err) {
                var msg = "Unable to save medication fact: " + err + "\n" + JSON.stringify(fact);
                console.error(msg);
                if (callback) callback(msg);
                return;
            }


            var ingredients = fact.data[biolog.Medications.PREDICATE_INGREDIENT._id];
            console.log("\n\nNext add med classes: " + JSON.stringify(ingredients));
            var ingredientCuis = Object.keys(ingredients);

            biolog.Bioontology.addMedClassesForEachGenericCui(ingredientCuis,
                function(medClass) {
                    var addingError = biolog.Medications.addMedClass(fact, medClass);
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

//var fact = Medications.createMedFact(ptid, med);
//
//biolog.Bioontology.getIngredients(med,
//    function(err, ingreds) {
//        if (err) {
//            var msg = "Unable to addIngredients: " + err;
//            console.error(msg);
//            if (callback) callback(msg);
//            return;
//        }
//        for (var ii in ingreds) {
//            var ingredient = ingreds[ii];
//            var addingError = Medications.addMedIngredient(fact, ingredient);
//            if (addingError) return callback(addingError);
//        }
//
//        var ingredsArr = [];
//        var ingredients = fact.data[Medications.PREDICATE_INGREDIENT._id];
//        console.log("\n\nNext add med classes: " + JSON.stringify(ingredients));
//        var ingredientCuis = Object.keys(ingredients);
//
//        biolog.Bioontology.getMedClassesForEachGenericCui(ingredientCuis,
//            function(err, medClasses) {
//                if (err) {
//                    console.error("Error adding med class: " + err);
//                }
//
//                for (var i in medClasses) {
//                    var medClass = medClasses[i];
//                    var addingError = Medications.addMedClass(fact, medClass);
//                    if (addingError) return callback(addingError);
//                }
//                //console.log("\n\n\nSaving med fact:" + JSON.stringify(fact));
//                saveProperty(fact, function(err, success) {
//                    if (err) {
//                        var msg = "Unable to save medication fact: " + err + "\n" + JSON.stringify(fact);
//                        console.error(msg);
//                        if (callback) callback(msg);
//                        return;
//                    }
//                    if (callback) return callback(null, fact);
//                });
//            }
//        );
//    }
//);



Template["biologMeds"].rendered = function () {
        console.log("search");
 

    $('.ui.search')
  .search({
    apiSettings: {
         onResponse: function(searchResults) {
        var
          response = {
            results :[]
            
          }
        ;
        // translate GitHub API response to work with search
        $.each(searchResults.collection, function(index, item) {

        response.results.push({title:item.prefLabel, obj:item})
         
        });
        return response;
      },
      url: 'https://data.bioontology.org/search?suggest=true&ontologies=RXNORM&semantic…ties&display_context=false&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d&q={query}'
    },
    
  
    onSelect:function(result, response){
        var self = this;
        console.log(result, response)
        result.obj.properties = result.obj.properties || [];
        var med = result.obj;
       // biolog.Medications.constructMedFact(getPatient()._id, result.obj, function(err, data){
       // if(!err){
          //  var med = data;
        //     console.log("clicked: " + JSON.stringify(med));
        // medsResults.set([med]);
        // Session.set("biolog:medications/med.editing", med);

        //   if (medsResults.get() && medsResults.get().length > 0) {
        //         Session.set("biolog:medications/meds.results", medsResults.get()[0]);
        //         medsResults.set([]);
        //         // Session.set("biolog:medications/med.editing", med );
        //         //return submitBioolookupMeds();
        //     } 
         med.properties = med.properties || []
        medsResults.set([med]);
        Session.set("biolog:medications/meds.results", med); 
         submitBioolookupMeds();
       Meteor.setTimeout(function(){

         $(self).search('set value', "")
         Bert.alert({
  title: 'Medication saved!',
  message:  result.title + "Added successfully ",
  type: 'cus-success',
  style: 'growl-top-right',
  icon: 'icon checkmark'
});
     }, 100)
         
        //}
      // });
         

   
        // Session.set("biolog:medications/meds.results", result.obj);
        //         medsResults.set([]);
        
        
    },
    onResultsClose:function(){
        console.log(this)
       
    }

  })
;
};



Template["biologMeds"].helpers({
    currentMeds: function() {
        if (!getPatient()) return;
        var result = getPatientMedsCurrent(getPatient()._id).fetch();
        return result;
    },

    pastMeds: function() {
        if (!getPatient()) return;
        console.log("past")
        var result = getPatientMedsPast(getPatient()._id).fetch();
        return result;
    },
    results: function() {
        return medsResults.get();
    }
});

Template["biologMedsItem"].events({
    "click .biologMedsItem": function(event, template) {
        //console.log("clicked: " + JSON.stringify(this));
        Session.set("biolog:medications/med.editing", this);
        //Session.set("biologMed.modal.open", true);

    }
});





Template["biologMedsItem"].rendered = function () {
       $('.ui.rating.meds-item').rating({
    maxRating: 5
  }).rating('disable');
       $('.header.meds-item ')
  .popup({
    inline   : true,
    hoverable: true,
    delay: {
      show: 300,
      hide: 600
    }
  })
  $('.ingredient-label.label').popup();
;
};
Template["biologMedsItem"].helpers({

    strength: function() {
        var med = this;
        var ingredients = biolog.Medications.getMedIngredients(med);
        var display = "";
        for (var ingredientIdx in ingredients) {
            console.log(1, ingredientIdx)
            var ingredient = ingredients[ingredientIdx];
            var strength = biolog.Medications.getIngredientStrength(med, ingredient.obj);
            if (strength){
                  // if (display.length > 0) display += " + ";
            display += "<span class='ui  olive tiny label ingredient-label' data-variation='mini'  data-content='"+ ingredient.text + " " + strength + " mg'"+"> ";
            display += ingredient.text + " " + strength + " mg";
            display += "</span>";
        }
        else{
             display += "<span class='ui  olive tiny label ingredient-label' data-variation='mini'  data-content='"+ ingredient.text + "'> ";
            display += ingredient.text ;
            display += "</span>";
        }
            } strength = "";
          
        if (display.length === 0) return "?";
        return display;
    },

    frequency: function() {
        var freq = biolog.Medications.getMedFrequency(this);
        if (!freq) return "? frequency";
        return biolog.Medications.MED_FREQUENCIES[freq];
    },

    timing: function() {
        if (this.startDate && this.endDate) {
            return moment(this.startDate).format("MMM Do YY") + " to " + moment(this.endDate).format("MMM Do YY");
        }
        if (this.startDate && !this.endDate) {
            return "since " + moment(this.startDate).format("MMM Do YY");
        }
        if (!this.startDate && this.endDate) {
            return "stopped " +  moment(this.endDate).format("MMM Do YY");
        }
    },
     medRating: function() {
        var med = this;
        console.log(this);
        if (!med) return;
        var ratingVal = getFactRating(med);
        //console.log("ratingVal=" + ratingVal);
        //$('.ui.rating.med').rating('set rating', ratingVal);
        return ratingVal;
    }


});




Tracker.autorun(function() {
    if (Session.get("biolog:medications/med.editing")) {
        console.log("Showing modal:" + JSON.stringify(Session.get("biolog:medications/med.editing")));
        $('#medModal').modal({
            closable: true,
            onApprove: function() {
                updateMed();
                $('.ui.rating.med').rating('clear rating');
                $('#medStrength').val('');
                $('#medStartDate').val('');
                $('#medEndDate').val('');
                /**
                * Created by Rashid on 5/19/15.
                   Remove the medication from current session and save it to the collection 
                */
                var postFacts = Session.get("postFacts");
                var modal = this;
                if (postFacts) {
                    var posts = _.reject(postFacts, function(element) {

                        if (element && element.objName) {
                            return element.objName.toLowerCase() == $.trim($(modal).find(".ui.label.huge").text().toLowerCase());
                        }


                    });
                    Session.setAuth("postFacts", posts)

                }

                Session.set("biolog:medications/med.editing", null);
                return true;
            },
            onDeny: function() {
                Session.set("biolog:medications/med.editing", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog:medications/med.editing", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog:medications/meds.modal.open"));
        $('#medModal').modal('hide');
    }
});


Template["biologMedModal"].rendered = function() {
    $('.ui.rating.med')
        .rating({
            //initialRating: 2,
            maxRating: 5
        });
        $("#medFrequency").dropdown();
         $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 80, // Creates a dropdown of 15 years to control year,
    max:1998,
     format: 'yyyy/mm/dd',
    formatSubmit: 'yyyy/mm/dd',
    close: 'Ok',

  });
};


Template["biologMedModal"].helpers({
    medName: function() {
        var med = Session.get("biolog:medications/med.editing");
        console.log(med)
        return biolog.Medications.getMedName(med);
    },

    ingredients: function() {
        var med = Session.get("biolog:medications/med.editing");
        //console.log("med=" + JSON.stringify(med));
        var medIngredients = biolog.Medications.getMedIngredients(med);

        return medIngredients;
    },

    ingredientStrength: function(cui) {
        var med = Session.get("biolog:medications/med.editing");
        if (!med) return;
        return biolog.Medications.getIngredientStrength(med, cui);
    },

    //medFrequency: function() {
    //    var med = Session.get("biolog:medications/med.editing");
    //    if (!med) return;
    //    return getMedFrequency(med);
    //},

    medStartDate: function() {
        var med = Session.get("biolog:medications/med.editing");
        if (!med) return;
        var dateStr = moment(med.startDate).format("LL");
        return dateStr;
    },

    medEndDate: function() {
        var med = Session.get("biolog:medications/med.editing");
        if (!med) return;
        //return med.endDate;
        if (!med.endDate) return "";
        var dateStr = moment(med.endDate).format("LL");
        return dateStr;
    },


    //medTaking: function() {
    //    var med = Session.get("biolog:medications/med.editing");
    //    if (!med) return;
    //    return med.endFlag;
    //},

    medTakingChecked: function() {
        var med = Session.get("biolog:medications/med.editing");
        if (!med) return;
        if (med.endFlag == 1) {
            return "checked";
        }
        return "";
    },

    medFrequencySelected: function(aFreqVal) {
        var med = Session.get("biolog:medications/med.editing");
        if (!med) return;
        var freqVal = biolog.Medications.getMedFrequency(med);
        if (!freqVal) {
            if (aFreqVal == "1") return "selected";
            return "";
        }
        if (freqVal == aFreqVal) return "selected";
        return "";
    },

    medFrequencyLabel: function(freqVal) {
        return biolog.Medications.MED_FREQUENCIES[freqVal];
    },

    medRating: function() {
        var med = Session.get("biolog:medications/med.editing");
        if (!med) return;
        var ratingVal = getFactRating(med);
        //console.log("ratingVal=" + ratingVal);
        $('.ui.rating.med').rating('set rating', ratingVal);
        return ratingVal;
    }
});


/**
 * Save the medicine based on the user input
 */
updateMed = function() {
    var med = Session.get("biolog:medications/med.editing");
    delete med._id;
    delete med.semanticType;
    //console.log("\n\nSaving med: " + JSON.stringify(med));
    if (!med) return;
    var frequency = $("#medFrequency").val();
    var rating = null;
    rating = $('.ui.rating.med').rating('get rating');
    if (rating) {
        setFactRating(med, String(rating));
    }
    biolog.Medications.setMedFrequency(med, frequency);

    //setMedStrength(med, strength);
    var ingredients = biolog.Medications.getMedIngredients(med);
    for (var ingredientIdx in ingredients) {
        var ingredient = ingredients[ingredientIdx];
        var inputId = "#medStrength-" + ingredient.obj;
        var ingredientStrength = $(inputId).val();
        console.log("ingredient: " + ingredient.text + " has id: " + inputId + " has strength:" + ingredientStrength);
        biolog.Medications.setIngredientStrength(med, ingredient.obj, ingredientStrength);
    }

    var startDateStr = $("#medStartDate").val();
    if (startDateStr) {
        var startDate = new Date(startDateStr);
        startDate.setTime(startDate.getTime() + startDate.getTimezoneOffset() * 60 * 1000);
        med.startDate = startDate;
    } else {
        med.startDate = null;
    }

    var endDateStr = $("#medEndDate").val();
    console.log("endDateStr='" + endDateStr + "'");
    if (endDateStr) {
        var endDate = new Date(endDateStr);
        endDate.setTime(endDate.getTime() + endDate.getTimezoneOffset() * 60 * 1000);
        med.endDate = endDate;
        console.log("set endDate=" + endDate);
    } else {
        med.endDate = null;
    }
    med.endFlag = 0;
    if ($("#medEndFlag").prop("checked")) med.endFlag = 1;

    saveProperty(med, function(err, success) {
        if (err) {
            console.error("Unable to save med: " + err + "\n" + JSON.stringify(med));
            return;
        }

        console.log("Saved med: " + JSON.stringify(med));
    })
};