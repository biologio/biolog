//'use strict';

if (Meteor.isServer) {

    var lookupBioontology = function(ontologies, query, callback) {
        var bioportalConfig = YAML.eval(Assets.getText('config/bioportal.yml'));
        var url = bioportalConfig.baseurl + "search?display_links=false&q=" + encodeURIComponent(q) + "&ontologies=" + ontologies + "&apikey=" + bioportalConfig.apikey;

        HTTP.get(url, params, function (err, response) {
            if (err) {
                return callback(err);
            }
            var json = JSON.parse(response.content);
            console.log("Received data: " + JSON.stringify(json.collection));
            return callback(null, json.collection);
        });
    };

    var lookupBioontologySync = Meteor.wrapAsync(lookupBioontology);

    Meteor.methods({
        bioolookup: function (collection, query) {
            return lookupBioontologySync(collection, query);
        }
    });
}

//bioolookupSearch = function (name, searchString, params, callback) {
//    var Future = Npm.require('fibers/future');
//    var future;
//    if (!callback) future = new Future();
//    var bioportalConfig = YAML.eval(Assets.getText('config/bioportal.yml'));
//    var url = bioportalConfig.baseurl + "search?display_links=false&q=" + encodeURIComponent(searchString) + "&apikey=" + bioportalConfig.apikey;
//    console.log("bioolookupSearch: params=" + JSON.stringify(params.ontologies));
//    console.log("bioolookupSearch: url=" + url);
//    if (! params) params = {};
//    HTTP.get(url, params, function(err, results) {
//        if (err) {
//            console.error("Error in bioolookup: " + err );
//            if (future) future.return(null);
//            return;
//        }
//        var json = JSON.parse(results.content);
//        var data = {
//            total: 100,
//            results: json.collection
//        };
//
//
//        if (callback) {
//            return callback(data);
//        } else {
//            console.log("Returned results to Future: " + JSON.stringify(data));
//            return future.return(data);
//        }
//    });
//
//    if (!callback) return future.wait();
//};
//
//
//EasySearch.createSearcher('bioontology', {
//    search: function (name, searchString, params, callback) {
//        var data = {
//            total: 2,
//            results: [
//                {prefLabel: "one"},
//                {prefLabel: "two"}
//            ]
//        };
//        return data;
//    },
//
//    createSearchIndex: function(name, options) {
//        //do nothing.
//    }
//});
//
//
//EasySearch.createSearchIndex('bioolookup', {
//    use : 'bioontology',
//    collection: Entities,
//    query: function(q) {
//        console.log("Query for: " + JSON.stringify(q));
//        return q;
//    },
//    props: {
//        ontologies: 'RXNORM'
//    }
//});

var results = new ReactiveVar();

if (Meteor.isClient) {
    Template.bioolookup.rendered = function() {
        $('.ui.search')
            .search({
                source: results,
                searchFullText: false
            })
        ;
    };

    Template.bioolookup.helpers({
        results: function() {
            return results.get();
        }
    });

    Template.bioolookup.events({
        "input .prompt": function(event, template) {
            var q = template.find("#biolookup-searchBox").value;
            //console.log("input!" + q);
            //var lookupResponse = Meteor.call("bioolookup", "RXNORM", q);
            //console.log("Received response: " + JSON.stringify(lookupResponse));
            //semantic_types=T116,T109,T121
            var url = "http://bioportal.smart-bio.org:8080/search?semantic_types=T116,T109,T121display_links=false&q=" + encodeURIComponent(q) + "*&ontologies=RXNORM&apikey=95d31cce-3247-4186-ae95-97c61884c50a";


            HTTP.get(url, function (err, response) {
                if (err) {
                    return results.set([]);
                }
                var json = JSON.parse(response.content);
                //console.log("Received data: " + JSON.stringify(json.collection));
                results.set(json.collection);
            });
        },

        "click .bioolookup-result": function(event, template) {
            console.log("clicked: " + JSON.stringify(this));
        }
    });

}
//To change the search index: EasySearch.changeProperty('bioolookup', 'ontologies', 'RXNORM');