//'use strict';

if (Meteor.isServer) {

    var Future = Npm.require('fibers/future');

    bioolookupSearch = function (name, searchString, params, callback) {
        var fut;
        if (!callback) fut = new Future();
        var bioportalConfig = YAML.eval(Assets.getText('config/bioportal.yml'));
        var url = bioportalConfig.baseurl + "search?display_links=false&q=" + encodeURIComponent(searchString) + "&apikey=" + bioportalConfig.apikey;
        console.log("bioolookupSearch: params=" + JSON.stringify(params.ontologies));
        console.log("bioolookupSearch: url=" + url);
        if (! params) params = {};
        HTTP.get(url, params, function(err, results) {
            if (err) {
                console.error("Error in bioolookup: " + err );
                if (fut) fut.return(null);
                return;
            }
            var json = JSON.parse(results.content);
            var data = {
                total: 100,
                results: json.collection
            };


            if (callback) {
                return callback(data);
            } else {
                console.log("Returned results to Future: " + JSON.stringify(data));
                return fut.return(data);
            }
        });

        if (!callback) return fut.wait();
    };


    EasySearch.createSearcher('bioontology', {
        search: bioolookupSearch,
        createSearchIndex: function(name, options) {
            //do nothing.
        }
    });

}

EasySearch.createSearchIndex('bioolookup', {
    use : 'bioontology',
    collection: Entities,
    query: function(q) {
        console.log("Query for: " + JSON.stringify(q));
        return q;
    },
    props: {
        ontologies: 'RXNORM'
    }
});

if (Meteor.isClient) {
    //Template.bioolookup.rendered
    Template.bioolookup.helpers({});

    Template.bioolookup.events({});

}
//To change the search index: EasySearch.changeProperty('bioolookup', 'ontologies', 'RXNORM');