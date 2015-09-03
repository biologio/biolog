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

Template.bioolookupConditionsButton.events({
    "click #bioolookupConditionsButton": function() {
        Session.set("biolog.bioolookup.conditions.modal.open", false);
        Session.set("biolog.bioolookup.conditions.modal.open", true);
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
        var url = getUrlLookupConditions(q, apiKey);
        //console.log("bioolookupContent url=" + url);
        HTTP.get(url, function (err, response) {
            if (err) {
                return conditionsResults.set([]);
            }
            var json = JSON.parse(response.content);
            //console.log("Received data: " + JSON.stringify(json.collection));
            conditionsResults.set(json.collection);
        });
    },

    "click .bioolookupConditionsResult": function(event, template) {
        var selectedCondition = this;
        console.log("clicked: " + JSON.stringify(selectedCondition));
        conditionsResults.set([selectedCondition]);
        Session.set("biolog.bioolookup.conditions.results", selectedCondition);
    }
});

//TODO lookup generic
//TODO lookup drug class
submitBioolookupConditions = function() {
    Session.set("biolog.bioolookup.conditions.modal.open", null);
    var cond = Session.get("biolog.bioolookup.conditions.results");
    //console.log("Saving med: " + JSON.stringify(med));
    if (!cond) return;

    var fact = createConditionFact(getPatient()._id, cond);

    addConditionClasses(cond, fact, function(err) {
        if (err) {
            console.error("Unable to addClasses: " + err);
        }

        saveProperty(fact, function(err, success) {
            if (err) {
                console.error("Unable to save condition fact: " + err + "\n" + JSON.stringify(fact));
                return;
            }
        });
    });
};

