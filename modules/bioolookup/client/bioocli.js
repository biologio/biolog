/**
 * Created by dd on 5/16/15.
 */

Tracker.autorun(function () {
    if (Session.get("biolog.bioolookup.modal.open")) {
        console.log("Showing modal:" + Session.get("biolog.bioolookup.modal.open"));
        $('#bioolookupModal').modal({
            closable  : true,
            onApprove    : function(){
                Session.set("biolog.bioolookup.modal.open", null);
                submitBioolookup();
                return true;
            },
            onDeny    : function(){
                Session.set("biolog.bioolookup.modal.open", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog.bioolookup.modal.open", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog.bioolookup.modal.open"));
        $('#bioolookupModal').modal('hide');
    }
});

Template.bioolookupButton.events({
    "click #bioolookupButton": function() {
        Session.set("biolog.bioolookup.modal.open", true);
    }
});

Template.bioolookupModal.rendered = function() {

};

var results = new ReactiveVar();

//Template.bioolookupContent.rendered = function() {
//    $('.ui.search')
//        .search({
//            source: results,
//            searchFullText: false
//        })
//    ;
//};

Template.bioolookupContent.helpers({
    results: function() {
        return results.get();
    }
});

Template.bioolookupContent.events({
    "input .prompt": function(event, template) {
        //if return character, submit the form
        if (event.which === 13) {
            if (Session.get("biolog.bioolookup.results")) {
                return submitBioolookup();
            }
            if (results.get() && results.get().length > 0) {
                Session.set("biolog.bioolookup.results", results.get()[0]);
                results.set([]);
                return submitBioolookup();
            }
        }

        Session.set("biolog.bioolookup.results", null);
        var q = template.find("#biolookupSearchBox").value;
        var url = getUrlLookupMeds(q);

        HTTP.get(url, function (err, response) {
            if (err) {
                return results.set([]);
            }
            var json = JSON.parse(response.content);
            //console.log("Received data: " + JSON.stringify(json.collection));
            results.set(json.collection);
        });
    },

    "click .bioolookupResult": function(event, template) {
        //console.log("clicked: " + JSON.stringify(this));
        results.set([this]);
        Session.set("biolog.bioolookup.results", this);
    }
});

//TODO lookup generic
//TODO lookup drug class
submitBioolookup = function() {
    Session.set("biolog.bioolookup.modal.open", null);
    var med = Session.get("biolog.bioolookup.results");
    console.log("Saving med: " + JSON.stringify(med));
    if (!med) return;
    var fact = {
        subj: getPatient()._id,
        pred: medicationPredicate._id,
        obj: med.cui[0],
        objName: med.prefLabel,
        etypes: [medicationEtype._id],
        startDate: new Date(),
        endFlag: 1
    };
    addProperty(fact, function(err, success) {
        if (err) {
            console.error("Unable to save fact: " + err + "\n" + JSON.stringify(fact));
            return;
        }
        console.log("Saved fact: " + JSON.stringify(fact));
    })
}