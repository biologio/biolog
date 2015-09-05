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
        Session.set("biolog.bioolookup.meds.modal.open", false);
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


submitBioolookupMeds = function() {
    Session.set("biolog.bioolookup.meds.modal.open", null);
    var med = Session.get("biolog.bioolookup.meds.results");
    var ptid = getPatient()._id;

    saveMedFactWithIngredientsAndClasses(ptid, med);
};

saveMedFactWithIngredientsAndClasses = function(ptid, med, callback) {
    //console.log("Saving med: " + JSON.stringify(med));
    if (!med) return;

    var fact = BioontologyMedications.createMedFact(ptid, med);

    addIngredients(med, fact, function(err) {
        if (err) {
            var msg = "Unable to addIngredients: " + err;
            console.error(msg);
            if (callback) callback(msg);
            return;
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
                    var msg = "Unable to save medication fact: " + err + "\n" + JSON.stringify(fact);
                    console.error(msg);
                    if (callback) callback(msg);
                    return;
                }
                if (callback) return callback(null, fact);
            });
        });
    });
};





Template.meds.helpers({
    currentMeds: function () {
        if (!getPatient()) return;
        var result = getPatientMedsCurrent(getPatient()._id).fetch();
        return result;
    },

    pastMeds: function () {
        if (!getPatient()) return;
        var result = getPatientMedsPast(getPatient()._id).fetch();
        return result;
    }
});

Template.medsItem.events({
    "click .medsItem": function(event, template) {
        //console.log("clicked: " + JSON.stringify(this));
        Session.set("biolog.med.editing", this);
        //Session.set("biolog.med.modal.open", true);
    }
});






Template.medsItem.helpers({

    strength: function() {
        var med = this;
        var ingredients = BioontologyMedications.getMedIngredients(med);
        var display = "";
        for (var ingredientIdx in ingredients) {
            var ingredient = ingredients[ingredientIdx];
            var strength = BioontologyMedications.getIngredientStrength(med, ingredient.obj);
            if (!strength) strength = "?";
            if (display.length > 0) display += " + ";
            display += ingredient.text + " " + strength + " mg";
        }
        if (display.length === 0) return "?";
        return display;
    },

    frequency: function() {
        var freq = BioontologyMedications.getMedFrequency(this);
        if (!freq) return "? frequency";
        return BioontologyMedications.MED_FREQUENCIES[freq];
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
    if (Session.get("biolog.med.editing")) {
        //console.log("Showing modal:" + JSON.stringify(Session.get("biolog.med.editing")));
        $('#medModal').modal({
            closable  : true,
            onApprove    : function(){
                updateMed();
                $('.ui.rating').rating('clear rating');
                $('#medStrength').val('');
                $('#medStartDate').val('');
                $('#medEndDate').val('');
                Session.set("biolog.med.editing", null);
                return true;
            },
            onDeny    : function(){
                Session.set("biolog.med.editing", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog.med.editing", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog.bioolookup.meds.modal.open"));
        $('#medModal').modal('hide');
    }
});


Template.medModal.rendered = function() {
    $('.ui.rating')
        .rating({
            //initialRating: 2,
            maxRating: 5
        })
    ;
};


Template.medModal.helpers({
    medName: function() {
        var med = Session.get("biolog.med.editing");
        return BioontologyMedications.getMedName(med);
    },

    ingredients: function() {
        var med = Session.get("biolog.med.editing");
        //console.log("med=" + JSON.stringify(med));
        var medIngredients = BioontologyMedications.getMedIngredients(med);

        return medIngredients;
    },

    ingredientStrength: function(cui) {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        return BioontologyMedications.getIngredientStrength(med, cui);
    },

    //medFrequency: function() {
    //    var med = Session.get("biolog.med.editing");
    //    if (!med) return;
    //    return getMedFrequency(med);
    //},

    medStartDate: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        var dateStr = yyyy_mm_dd(med.startDate);
        return dateStr;
    },

    medEndDate: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        //return med.endDate;
        if (!med.endDate) return "";
        var dateStr = yyyy_mm_dd(med.endDate);
        return dateStr;
    },


    //medTaking: function() {
    //    var med = Session.get("biolog.med.editing");
    //    if (!med) return;
    //    return med.endFlag;
    //},

    medTakingChecked: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        if (med.endFlag == 1) {
            return "checked";
        }
        return "";
    },

    medFrequencySelected: function(aFreqVal) {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        var freqVal = BioontologyMedications.getMedFrequency(med);
        if (!freqVal) {
            if (aFreqVal=="1") return "selected";
            return "";
        }
        if (freqVal == aFreqVal) return "selected";
        return "";
    },

    medFrequencyLabel: function(freqVal) {
        return BioontologyMedications.MED_FREQUENCIES[freqVal];
    },

    medRating: function() {
        var med = Session.get("biolog.med.editing");
        if (!med) return;
        var ratingVal = getFactRating(med);
        //console.log("ratingVal=" + ratingVal);
        $('.ui.rating').rating('set rating', ratingVal);
        return ratingVal;
    }
});


/**
 * Save the medicine based on the user input
 */
updateMed = function() {
    var med = Session.get("biolog.med.editing");
    delete med._id;
    //console.log("\n\nSaving med: " + JSON.stringify(med));
    if (!med) return;
    var frequency = $("#medFrequency").val();
    var rating = null;
    rating = $('.ui.rating').rating('get rating');
    if (rating) {
        setFactRating(med, String(rating));
    }
    BioontologyMedications.setMedFrequency(med, frequency);

    //setMedStrength(med, strength);
    var ingredients = BioontologyMedications.getMedIngredients(med);
    for (var ingredientIdx in ingredients) {
        var ingredient = ingredients[ingredientIdx];
        var inputId = "#medStrength-" + ingredient.obj;
        var ingredientStrength = $(inputId).val();
        console.log("ingredient: " + ingredient.text + " has id: " + inputId + " has strength:" + ingredientStrength);
        BioontologyMedications.setIngredientStrength(med, ingredient.obj, ingredientStrength);
    }

    var startDateStr = $("#medStartDate").val();
    if (startDateStr) {
        var startDate = new Date(startDateStr);
        startDate.setTime( startDate.getTime() + startDate.getTimezoneOffset()*60*1000 );
        med.startDate = startDate;
    } else {
        med.startDate = null;
    }

    var endDateStr = $("#medEndDate").val();
    console.log("endDateStr='" + endDateStr + "'");
    if (endDateStr) {
        var endDate = new Date(endDateStr);
        endDate.setTime( endDate.getTime() + endDate.getTimezoneOffset()*60*1000 );
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


