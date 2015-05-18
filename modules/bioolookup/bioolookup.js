//'use strict';

//if (Meteor.isServer) {
//
//    var lookupBioontology = function(ontologies, query, callback) {
//        var bioportalConfig = YAML.eval(Assets.getText('config/bioportal.yml'));
//        var url = bioportalConfig.baseurl + "search?display_links=false&q=" + encodeURIComponent(q) + "&ontologies=" + ontologies + "&apikey=" + bioportalConfig.apikey;
//
//        HTTP.get(url, params, function (err, response) {
//            if (err) {
//                return callback(err);
//            }
//            var json = JSON.parse(response.content);
//            console.log("Received data: " + JSON.stringify(json.collection));
//            return callback(null, json.collection);
//        });
//    };
//
//    var lookupBioontologySync = Meteor.wrapAsync(lookupBioontology);
//
//    Meteor.methods({
//        bioolookup: function (collection, query) {
//            return lookupBioontologySync(collection, query);
//        }
//    });
//}
