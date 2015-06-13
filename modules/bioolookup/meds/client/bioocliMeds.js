/**
 * Created by dd on 5/16/15.
 */

Tracker.autorun(function () {
    if (Session.get("biolog.bioolookup.meds.modal.open")) {
        $('#bioolookupMedsModal').modal({
            closable  : true,
            onApprove    : function(){
                Session.set("biolog.bioolookup.meds.modal.open", null);
                submitBioolookupMeds();
                return true;
            },
            onDeny    : function(){
                Session.set("biolog.bioolookup.meds.modal.open", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog.bioolookup.meds.modal.open", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog.bioolookup.meds.modal.open"));
        $('#bioolookupMedsModal').modal('hide');
    }
});

Template.bioolookupMedsButton.events({
    "click #bioolookupMedsButton": function() {
        Session.set("biolog.bioolookup.meds.modal.open", true);
    }
});


var medsResults = new ReactiveVar();


Template.bioolookupMedsContent.helpers({
    results: function() {
        return medsResults.get();
    }
});

Template.bioolookupMedsContent.events({
    "input .prompt": function(event, template) {
        //if return character, submit the form
        if (event.which === 13) {
            if (Session.get("biolog.bioolookup.meds.results")) {
                return submitBioolookupMeds();
            }
            if (medsResults.get() && medsResults.get().length > 0) {
                Session.set("biolog.bioolookup.meds.results", medsResults.get()[0]);
                medsResults.set([]);
                return submitBioolookupMeds();
            }
        }

        Session.set("biolog.bioolookup.meds.results", null);
        var q = template.find("#biolookupSearchMedsBox").value;
        var url = getUrlLookupMeds(q);
        //console.log("bioolookupContent url=" + url);
        HTTP.get(url, function (err, response) {
            if (err) {
                return medsResults.set([]);
            }
            var json = JSON.parse(response.content);
            //console.log("Received data: " + JSON.stringify(json.collection));
            medsResults.set(json.collection);
        });
    },

    "click .bioolookupMedsResult": function(event, template) {
        var med = this;
        //console.log("clicked: " + JSON.stringify(selectedMed));
        medsResults.set([med]);
        Session.set("biolog.bioolookup.meds.results", med);
    }
});

//TODO lookup generic
//TODO lookup drug class
submitBioolookupMeds = function() {
    Session.set("biolog.bioolookup.meds.modal.open", null);
    var med = Session.get("biolog.bioolookup.meds.results");
    //console.log("Saving med: " + JSON.stringify(med));
    if (!med) return;

    var fact = createMedFact(getPatient()._id, med);

    addIngredients(med, fact, function(err) {
        if (err) {
            console.error("Unable to addIngredients: " + err);
        }

        var ingredients = fact.data["medication/ingredient"];
        console.log("\n\nNext add med classes: " + JSON.stringify(ingredients));
        var ingredientCuis = Object.keys(ingredients);

        addMedClassesForEachGenericCui(ingredientCuis, fact, function(err, result) {
            if (err) {
                console.error("Error adding med class: " + err);
            }
            console.log("\n\n\nSaving med fact:" + JSON.stringify(fact));
            saveProperty(fact, function(err, success) {
                if (err) {
                    console.error("Unable to save medication fact: " + err + "\n" + JSON.stringify(fact));
                    return;
                }
            });

        })

    });
};

