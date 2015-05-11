//'use strict';

//if (Meteor.isServer) {



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
        "keydown .prompt": function(event, template) {
            var textVal = template.find("#biolookup-searchBox").value;
            console.log("Keydown!" + textVal);
            var bioportalConfig = YAML.eval(Assets.getText('config/bioportal.yml'));
            var url = bioportalConfig.baseurl + "search?display_links=false&q=" + encodeURIComponent(searchString) + "&apikey=" + bioportalConfig.apikey;


            HTTP.get(url, params, function(err, response) {
                if (err) {
                    console.error("Error in bioolookup: " + err );
                    results.set(null);
                    return;
                }
                var json = JSON.parse(response.content);
                //var data = {
                //    total: 100,
                //    results: json.collection
                //};

                console.log("Received data: " + JSON.stringify(json.collection));
                results.set(json.collection);


            });

            //results.set([
            //    { title: 'Andorra' },
            //    { title: 'United Arab Emirates' },
            //    { title: 'Afghanistan' },
            //    { title: 'Antigua' },
            //    { title: 'Anguilla' },
            //    { title: 'Albania' },
            //    { title: 'Armenia' },
            //    { title: 'Netherlands Antilles' },
            //    { title: 'Angola' },
            //    { title: 'Argentina' },
            //    { title: 'American Samoa' },
            //    { title: 'Austria' },
            //    { title: 'Australia' },
            //    { title: 'Aruba' },
            //    { title: 'Aland Islands' },
            //    { title: 'Azerbaijan' },
            //    { title: 'Bosnia' },
            //    { title: 'Barbados' },
            //    { title: 'Bangladesh' },
            //    { title: 'Belgium' },
            //    { title: 'Burkina Faso' },
            //    { title: 'Bulgaria' },
            //    { title: 'Bahrain' },
            //    { title: 'Burundi' }
            //    // etc
            //]);
        }
    });

}
//To change the search index: EasySearch.changeProperty('bioolookup', 'ontologies', 'RXNORM');