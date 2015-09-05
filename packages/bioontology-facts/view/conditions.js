/**
 * Created by dd on 5/16/15.
 */

Tracker.autorun(function () {
    if (Session.get("biolog.bioolookup.conditions.modal.open")) {
        $('#bioolookupConditionsModal').modal({
            closable  : true,
            onApprove    : function(){
                Session.set("biolog.bioolookup.conditions.modal.open", null);
                submitBioolookupConditions();
                return true;
            },
            onDeny    : function(){
                Session.set("biolog.bioolookup.conditions.modal.open", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog.bioolookup.conditions.modal.open", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog.bioolookup.conditions.modal.open"));
        $('#bioolookupConditionsModal').modal('hide');
    }
});




var conditionsResults = new ReactiveVar();


Template.bioolookupConditionsContent.helpers({
    results: function() {
        return conditionsResults.get();
    },

    altLabels: function() {
        var obj = this;
        var altLabels = obj.properties["http://www.w3.org/2004/02/skos/core#altLabel"];
        return altLabels;
    }
});

Template.bioolookupConditionsContent.events({
    "input .prompt": function(event, template) {
        //if return character, submit the form
        if (event.which === 13) {
            if (Session.get("biolog.bioolookup.conditions.results")) {
                return submitBioolookupConditions();
            }
            if (conditionsResults.get() && conditionsResults.get().length > 0) {
                Session.set("biolog.bioolookup.conditions.results", conditionsResults.get()[0]);
                conditionsResults.set([]);
                return submitBioolookupConditions();
            }
        }



        Session.set("biolog.bioolookup.conditions.results", null);
        var q = template.find("#biolookupSearchConditionsBox").value;
        //var apiKey = Bioontology.getApiKey();
        //var url = Bioontology.getUrlSearchConditions(q);

        Bioontology.searchConditions(q, function(err, conditions) {
            if (err) {
                return conditionsResults.set([]);
            }
            conditionsResults.set(conditions);
        });
        //HTTP.get(url, function (err, response) {
        //    if (err) {
        //        return conditionsResults.set([]);
        //    }
        //    var json = JSON.parse(response.content);
        //    //console.log("Received data: " + JSON.stringify(json.collection));
        //    conditionsResults.set(json.collection);
        //});
    },

    "click .bioolookupConditionsResult": function(event, template) {
        var selectedCondition = this;
        console.log("clicked: " + JSON.stringify(selectedCondition));
        conditionsResults.set([selectedCondition]);
        Session.set("biolog.bioolookup.conditions.results", selectedCondition);
    }
});

//TODO fix this
submitBioolookupConditions = function() {
    Session.set("biolog.bioolookup.conditions.modal.open", null);
    var cond = Session.get("biolog.bioolookup.conditions.results");
    //console.log("Saving med: " + JSON.stringify(med));
    if (!cond) return;

    var fact = createConditionFact(getPatient()._id, cond);

    Bioontology.addConditionClasses(cond, Bioontology.getApiKey(),
        //callback to add a condition:
        function(conditionToAdd) {
            //add condition to the fact
            BioontologyConditions.addConditionClass(fact, conditionToAdd);
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
};





conditionFrowns = new ReactiveVar();

var getFrowns = function() {
    var condition = Session.get("biolog.condition.editing");
    if (!condition) return;
    var frowns = BioontologyConditions.getConditionSeverity(condition);
    return frowns;
};


Template.conditions.helpers({
    currentConditions: function () {

        if (!getPatient()) return;
        var result = getPatientConditionsCurrent(getPatient()._id).fetch();
        //console.log("currentConditions: result=" + JSON.stringify(result));
        return result;
    },

    pastConditions: function () {
        if (!getPatient()) return;
        var result = getPatientConditionsPast(getPatient()._id).fetch();
        return result;
    }
});

Template.conditionsItem.rendered = function() {
    $('.rateit').rateit();
    $('.rateit').bind(getFrowns);
};

Template.conditionsItem.events({
    "click .conditionsItem": function(event, template) {
        //console.log("clicked: " + JSON.stringify(this));
        Session.set("biolog.condition.editing", this);
        //Session.set("biolog.condition.modal.open", true);
    }
});



Template.bioolookupConditionsButton.events({
    "click #bioolookupConditionsButton": function() {
        Session.set("biolog.bioolookup.conditions.modal.open", false);
        Session.set("biolog.bioolookup.conditions.modal.open", true);
    }
});



Template.conditionsItem.helpers({

    frowns: function() {
        var sev = BioontologyConditions.getConditionSeverity(this);
        return sev;
    },

    timing: function() {
        if (this.startDate && this.endDate) {
            return yyyy_mm_dd(this.startDate) + " to " + yyyy_mm_dd(this.endDate);
        }
        if (this.startDate && ! this.endDate) {
            return "since " + yyyy_mm_dd(this.startDate);
        }
        if (! this.startDate && this.endDate) {
            return "stopped " + yyyy_mm_dd(this.endDate);
        }
    }


});




Tracker.autorun(function () {
    if (Session.get("biolog.condition.editing")) {
        //console.log("Showing modal:" + JSON.stringify(Session.get("biolog.condition.editing")));
        $('#conditionModal').modal({
            closable  : true,
            onApprove    : function(){
                updateCondition();

                Session.set("biolog.condition.editing", null);
                return true;
            },
            onDeny    : function(){
                Session.set("biolog.condition.editing", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog.condition.editing", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog.bioolookup.conditions.modal.open"));
        $('#conditionModal').modal('hide');
    }
});


Template.conditionModal.rendered = function() {
    $('.rateit').rateit();
    //$('.rateit').bind(getFrowns);
};

Template.conditionModal.events({
    //"click .rateit": function(event, template) {
    //    console.log("click .rateit");
    //    var changedElementId = event.currentTarget.id;
    //    var condition = Session.get("biolog.condition.editing");
    //    var val = $('#' + changedElementId).rateit('value');
    //    conditionFrowns.set(val);
    //    console.log("Set conditionFrowns=" + conditionFrowns.get());
    //    setConditionSeverity(condition, val);
    //    //Session.set("selectedDiagnosis", condition);
    //}
});


Template.conditionModal.helpers({
    conditionName: function() {
        var condition = Session.get("biolog.condition.editing");
        return BioontologyConditions.getConditionName(condition);
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
        var condition = Session.get("biolog.condition.editing");
        if (!condition) return;
        var dateStr = yyyy_mm_dd(condition.startDate);
        return dateStr;
    },

    conditionEndDate: function() {
        var condition = Session.get("biolog.condition.editing");
        if (!condition) return;
        //return condition.endDate;
        if (!condition.endDate) return "";
        var dateStr = yyyy_mm_dd(condition.endDate);
        return dateStr;
    },

    conditionSinceBirthChecked: function() {
        var condition = Session.get("biolog.condition.editing");
        if (!condition) return;
        if (condition.startFlag == 1) {
            return "checked";
        }
        return "";
    },

    conditionOngoingChecked: function() {
        var condition = Session.get("biolog.condition.editing");
        if (!condition) return;
        if (condition.endFlag == 1) {
            return "checked";
        }
        return "";
    },

    conditionFrequencySelected: function(aFreqVal) {
        var condition = Session.get("biolog.condition.editing");
        if (!condition) return;
        var freqVal = getConditionFrequency(condition);
        if (!freqVal) {
            if (aFreqVal=="1") return "selected";
            return "";
        }
        if (freqVal == aFreqVal) return "selected";
        return "";
    },

    conditionFrequencyLabel: function(freqVal) {
        return conditionFrequencies[freqVal];
    }

    //frowns: function() {
    //    var condition = Session.get("biolog.condition.editing");
    //    if (!condition) return;
    //    var ratingVal = getConditionSeverity(condition);
    //    return ratingVal;
    //}
});



updateCondition = function() {
    var condition = Session.get("biolog.condition.editing");
    delete condition._id;
    //console.log("\n\nSaving condition: " + JSON.stringify(condition));
    if (!condition) return;

    var startDateStr = $("#conditionStartDate").val();
    if (startDateStr) {
        var startDate = new Date(startDateStr);
        startDate.setTime( startDate.getTime() + startDate.getTimezoneOffset()*60*1000 );
        condition.startDate = startDate;
    } else {
        condition.startDate = null;
    }

    var endDateStr = $("#conditionEndDate").val();
    console.log("endDateStr='" + endDateStr + "'");
    if (endDateStr) {
        var endDate = new Date(endDateStr);
        endDate.setTime( endDate.getTime() + endDate.getTimezoneOffset()*60*1000 );
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
    BioontologyConditions.setConditionSeverity(condition, frownsRating);

    saveProperty(condition, function(err, success) {
        if (err) {
            console.error("Unable to save condition: " + err + "\n" + JSON.stringify(condition));
            return;
        }
        console.log("Saved condition: " + JSON.stringify(condition));
    });
};


