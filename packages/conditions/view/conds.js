/**
 * Created by dd on 5/16/15.
 */
Router.route('/conditions', function() {
    this.render('biolog.conditions');
});


Tracker.autorun(function() {
    if (Session.get("biolog:conditions/conditions.modal.open")) {
        $('#biologBioontologyConditionsModal').modal({
            closable: true,
            onApprove: function() {
                Session.set("biolog:conditions/conditions.modal.open", null);
                submitBioolookupConditions();
                return true;
            },
            onDeny: function() {
                Session.set("biolog:conditions/conditions.modal.open", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog:conditions/conditions.modal.open", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog:conditions/conditions.modal.open"));
        $('#biologBioontologyConditionsModal').modal('hide');
    }
});




var conditionsResults = new ReactiveVar();


Template["biologBioontologyConditionsContent"].helpers({
    results: function() {
        return conditionsResults.get();
    },

    altLabels: function() {
        var obj = this;
        var altLabels = obj.properties["http://www.w3.org/2004/02/skos/core#altLabel"];
        return altLabels;
    }
});

Template["biologBioontologyConditionsContent"].events({
    "input .prompt": function(event, template) {
        //if return character, submit the form
        if (event.which === 13) {
            if (Session.get("biolog.bioontology.conditions.results")) {
                return submitBioolookupConditions();
            }
            if (conditionsResults.get() && conditionsResults.get().length > 0) {
                Session.set("biolog.bioontology.conditions.results", conditionsResults.get()[0]);
                conditionsResults.set([]);
                return submitBioolookupConditions();
            }
        }



        Session.set("biolog.bioontology.conditions.results", null);
        var q = template.find("#biologBioontologySearchConditionsBox").value;
        //var apiKey = Bioontology.getApiKey();
        //var url = Bioontology.getUrlSearchConditions(q);

        biolog.Bioontology.searchConditions(q, function(err, conditions) {
            if (err) {
                return conditionsResults.set([]);
            }
            conditionsResults.set(conditions);
        });

        //Meteor.call("searchConditions", q, function(err, conditions) {
        //    if (err) {
        //        console.error("Error searching for conditions: ", err);
        //        conditionsResults.set([]);
        //    } else {
        //        //console.log("conds: received results: ", conditions);
        //        conditionsResults.set(conditions);
        //    }
        //});
    },

    "click .biologBioontologyConditionsResult": function(event, template) {
        var selectedCondition = this;
        //console.log("clicked: " + JSON.stringify(selectedCondition));
        conditionsResults.set([selectedCondition]);
        Session.set("biolog.bioontology.conditions.results", selectedCondition);
    }
});


submitBioolookupConditions = function() {
    Session.set("biolog:conditions/conditions.modal.open", null);
    var cond = Session.get("biolog.bioontology.conditions.results");
    console.log("Saving condition: " + JSON.stringify(cond));
    if (!cond) return;
    delete cond.semanticType;
    biolog.Conditions.constructConditionFact(getPatient()._id, cond, function(err, fact){
        if (err) {
            return console.error(err);
        }
        saveProperty(fact, function(err, success) {
            if (err) {
                console.error("Unable to save condition fact: " + err + "\n" + JSON.stringify(fact));
                return;
            }


            //saveProperty(fact, function(err, success) {
            //    if (err) {
            //        console.error("Unable to save condition fact: " + err + "\n" + JSON.stringify(fact));
            //        return;
            //    }
            //});
        });

    });
};

    //var fact = Conditions.createConditionFact(getPatient()._id, cond);
    //Bioontology.getConditionClasses(cond,
    //    //callback to add a condition:
    //    function(conditionToAdd) {
    //        //add condition to the fact
    //        Conditions.addConditionClass(fact, conditionToAdd);
    //    },
    //    //final callback:
    //    function(err) {
    //        if (err) {
    //            console.error("Unable to addClasses: " + JSON.stringify(err));
    //        }
    //
    //        saveProperty(fact, function(err, success) {
    //            if (err) {
    //                console.error("Unable to save condition fact: " + err + "\n" + JSON.stringify(fact));
    //                return;
    //            }
    //        });
    //});







conditionFrowns = new ReactiveVar();

var getFrowns = function() {
    var condition = Session.get("biolog:conditions/condition.editing");
    if (!condition) return;
    var frowns = biolog.Conditions.getConditionSeverity(condition);
    return frowns;
};


Template["biologConditions"].helpers({
    currentConditions: function() {

        if (!getPatient()) return;
        var result = getPatientConditionsCurrent(getPatient()._id).fetch();
        //console.log("currentConditions: result=" + JSON.stringify(result));
        return result;
    },

    pastConditions: function() {
        if (!getPatient()) return;
        var result = getPatientConditionsPast(getPatient()._id).fetch();
        return result;
    }
});
Template["biologConditions"].rendered = function () {
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
      url: 'https://data.bioontology.org/search?suggest=true&ontologies=MEDLINEPLUS,ICD10CM&include=prefLabel,synonym,definition,notation,cui,semanticType,properties&display_context=false&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d&q={query}'
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
        conditionsResults.set([med]);



        Session.set("biolog.bioontology.conditions.results", med); 
         submitBioolookupConditions();
       Meteor.setTimeout(function(){

         $(self).search('set value', "")
         Bert.alert({
  title: 'Condition saved!',
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

Template["biologConditionsItem"].rendered = function() {
    $('.rateit').rateit();
    $('.rateit').bind(getFrowns);
     $('.header.meds-item ')
  .popup({
    inline   : true,
    hoverable: true,
    delay: {
      show: 300,
      hide: 600
    }
  })
};

Template["biologConditionsItem"].events({
    "click .biologConditionsItem": function(event, template) {
        //console.log("clicked: " + JSON.stringify(this));
        Session.set("biolog:conditions/condition.editing", this);
        //Session.set("biolog.condition.modal.open", true);
    }
});



Template["biologBioontologyConditionsButton"].events({
    "click #biologBioontologyConditionsButton": function() {
        Session.set("biolog:conditions/conditions.modal.open", false);
        Session.set("biolog:conditions/conditions.modal.open", true);
    }
});



Template["biologConditionsItem"].helpers({

    frowns: function() {
        var sev = biolog.Conditions.getConditionSeverity(this);
        return sev;
    },

    timing: function() {
        if (this.startDate && this.endDate) {
            return moment(this.startDate).format("MMM Do YY") + " to " + moment(this.endDate).format("MMM Do YY");
        }
        if (this.startDate && !this.endDate) {
            return "since " +  moment(this.startDate).format("MMM Do YY");
        }
        if (!this.startDate && this.endDate) {
            return "stopped " + moment(this.endDate).format("MMM Do YY");
        }
    }


});




Tracker.autorun(function() {
    if (Session.get("biolog:conditions/condition.editing")) {
        //console.log("Showing modal:" + JSON.stringify(Session.get("biolog:conditions/condition.editing")));
        $('#conditionModal').modal({
            closable: true,
            onApprove: function() {
                updateCondition();
                /**
                 * Created by Rashid on 5/19/15.
                    Remove the condition from current session and save it to the collection 
                 */
                var postFacts = Session.get("postFacts");
                if (postFacts) {
                    var modal = this;
                    var posts = _.reject(postFacts, function(element) {
                        if(element && element.objName){
                        return element.objName.toLowerCase() == $.trim($(modal).find(".header").text().toLowerCase());
                          }
                    });
                    Session.setAuth("postFacts", posts)
                }

                Session.set("biolog:conditions/condition.editing", null);
                return true;
            },
            onDeny: function() {
                Session.set("biolog:conditions/condition.editing", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog:conditions/condition.editing", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog:conditions/conditions.modal.open"));
        $('#conditionModal').modal('hide');
    }
});


Template["biologConditionModal"].rendered = function() {
    $('.rateit').rateit();
    //$('.rateit').bind(getFrowns);
     $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 80, // Creates a dropdown of 15 years to control year,
    max:1998,
    //format: 'dd mmm, yyyy',
    formatSubmit: 'yyyy/mm/dd',
    close: 'Ok',

  });
};

Template["biologConditionModal"].events({
    //"click .rateit": function(event, template) {
    //    console.log("click .rateit");
    //    var changedElementId = event.currentTarget.id;
    //    var condition = Session.get("biolog:conditions/condition.editing");
    //    var val = $('#' + changedElementId).rateit('value');
    //    conditionFrowns.set(val);
    //    console.log("Set conditionFrowns=" + conditionFrowns.get());
    //    setConditionSeverity(condition, val);
    //    //Session.set("selectedDiagnosis", condition);
    //}
});


Template["biologConditionModal"].helpers({
    conditionName: function() {
        var condition = Session.get("biolog:conditions/condition.editing");
        return biolog.Conditions.getConditionName(condition);
    },

    frowns: function() {
        var frowns = getFrowns();
        if (!frowns) {
            $('#conditionSeverityFrowns').rateit('reset');
            return;
        }
        $('#conditionSeverityFrowns').rateit('value', frowns);
        return frowns;
    },

    conditionStartDate: function() {
        var condition = Session.get("biolog:conditions/condition.editing");
        if (!condition) return;
        var dateStr = moment(condition.startDate).format("LL");
        // yyyy_mm_dd(condition.startDate);
        console.log(dateStr)
        return dateStr;
    },

    conditionEndDate: function() {
        var condition = Session.get("biolog:conditions/condition.editing");
        if (!condition) return;
        //return condition.endDate;
        if (!condition.endDate) return "";
        var dateStr = moment(condition.endDate).format("LL");
        return dateStr;
    },

    conditionSinceBirthChecked: function() {
        var condition = Session.get("biolog:conditions/condition.editing");
        if (!condition) return;
        if (condition.startFlag == 1) {
            return "checked";
        }
        return "";
    },

    conditionOngoingChecked: function() {
        var condition = Session.get("biolog:conditions/condition.editing");
        if (!condition) return;
        if (condition.endFlag == 1) {
            return "checked";
        }
        return "";
    },

    conditionFrequencySelected: function(aFreqVal) {
        var condition = Session.get("biolog:conditions/condition.editing");
        if (!condition) return;
        var freqVal = getConditionFrequency(condition);
        if (!freqVal) {
            if (aFreqVal == "1") return "selected";
            return "";
        }
        if (freqVal == aFreqVal) return "selected";
        return "";
    },

    conditionFrequencyLabel: function(freqVal) {
        return conditionFrequencies[freqVal];
    }

    //frowns: function() {
    //    var condition = Session.get("biolog:conditions/condition.editing");
    //    if (!condition) return;
    //    var ratingVal = getConditionSeverity(condition);
    //    return ratingVal;
    //}
});



updateCondition = function() {
    var condition = Session.get("biolog:conditions/condition.editing");
    delete condition._id;
    delete condition.semanticType;
    //console.log("\n\nSaving condition: " + JSON.stringify(condition));
    if (!condition) return;

    var startDateStr = $("#conditionStartDate").val();
    if (startDateStr) {
        var startDate = new Date(startDateStr);
        startDate.setTime(startDate.getTime() + startDate.getTimezoneOffset() * 60 * 1000);
        condition.startDate = startDate;
    } else {
        condition.startDate = null;
    }

    var endDateStr = $("#conditionEndDate").val();
    console.log("endDateStr='" + endDateStr + "'");
    if (endDateStr) {
        var endDate = new Date(endDateStr);
        endDate.setTime(endDate.getTime() + endDate.getTimezoneOffset() * 60 * 1000);
        condition.endDate = endDate;
        console.log("set endDate=" + endDate);
    } else {
        condition.endDate = null;
    }
    condition.endFlag = 0;
    if ($("#conditionEndFlag").prop("checked")) condition.endFlag = 1;

    //add frowns rating
    //setConditionSeverity(condition, conditionFrowns.get());
    var frownsRating = $('#conditionSeverityFrowns').rateit('value');
    console.log("frownsRating=" + frownsRating);
    biolog.Conditions.setConditionSeverity(condition, frownsRating);

    saveProperty(condition, function(err, success) {
        if (err) {
            console.error("Unable to save condition: " + err + "\n" + JSON.stringify(condition));
            return;
        }
        console.log("Saved condition: " + JSON.stringify(condition));
    });
};
