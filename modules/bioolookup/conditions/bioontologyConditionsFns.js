/**
 * Created by dd on 5/15/15.
 */

/**
 * Provides the URL for doing a typeahead search on the given query
 * @param q
 * @returns {string}
 *
 * T047=diabetes
 * T046=epistaxis
 * T184=pain groin
 * T033=enlarged prostate
 */
//LOCAL
//getUrlLookupConditions = function(q) {
//    return "http://bioportal.smart-bio.org:8080/search?ontologies=RCD&suggest=true" +
//        //"&semantic_types=T116,T109,T121,T002,T197,T127" +
//        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
//        "&display_context=false&q=" + encodeURIComponent(q) +
//        "&apikey=95d31cce-3247-4186-ae95-97c61884c50a";
//};

//REMOTE
getUrlLookupConditions = function(q) {
    return "http://data.bioontology.org/search?ontologies=RCD&suggest=true" +
        //"&semantic_types=T116,T109,T121,T002,T197,T127" +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + encodeURIComponent(q) +
        "&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d";
};


addConditionClasses = function(condition, fact, callback) {
    //get ancestors
    var ancestorsUrl = condition.links.ancestors;
    ancestorsUrl += "?apikey=" + getBioontologyApikey();
    HTTP.get(ancestorsUrl, function (err, response) {
        if (err) {
            console.error("Unable to look up condition ancestors at url: " + ancestorsUrl + ":\n" + err);
            callback(err);
        }
        var json = JSON.parse(response.content);
        console.log("\n\nReceived condition ancestors from: " + ancestorsUrl);

        //batch query
        var batchUrl = getUrlBatchQuery();
        var batchData = {
            "collection": [],
            "display": "prefLabel,synonym,semanticTypes,cui"
        };
        for (var ancestorIdx in json) {
            var ancestor = json[ancestorIdx];
            var clazz = ancestor["@id"];
            batchData.collection.push({
                "class": clazz,
                "ontology": "http://data.bioontology.org/ontologies/RCD"
            });
        }
        HTTP.post(batchUrl, {data: batchData}, function(err, result) {
            if (err) {
                console.error("Unable to batch refine condition ancestors at url: " + batchUrl + ":\n" + err + "\nbatchData=" + JSON.stringify(batchData));
                callback(err);
            }
            console.log("Batch queried these ancestors: " + JSON.stringify(result.data, null , "  "));
        });


        //var uriEntries = condition.properties["http://www.w3.org/2000/01/rdf-schema#subClassOf"];
        //if (!uriEntries) {
        //    console.log("No superclass info present");
        //    return callback();
        //};
        //var uris = [];
        //for (var uriIdx in uriEntries) {
        //    var uriEntry = uriEntries[uriIdx];
        //    var uriItems = uriEntry.split(",");
        //    for (var itemIdx in uriItems) {
        //        var uriItem = uriItems[itemIdx];
        //        uris.push(uriItem);
        //    }
        //}
        //async.each(uris, function(uri, callbk) {
        //    //lookup each uri and add it as a conditionication/ingredient
        //    var lookupUrl = getUrlLookupClass("RCD", uri);
        //    //var lookupUrl = getUrlLookupConditions(encodeURIComponent(genericUrl));
        //    console.log("Looking up condition class at: " + lookupUrl);
        //    HTTP.get(lookupUrl, function (err, response) {
        //        if (err) {
        //            console.error("Unable to look up condition class at url: " + lookupUrl + ":\n" + err);
        //            callbk(err);
        //        }
        //        var json = JSON.parse(response.content);
        //        console.log("\n\nReceived condition class from: " + lookupUrl);
        //        var addingError = addConditionClass(fact, json);
        //        if (addingError) return callbk(addingError);
        //        callbk();
        //    });
        //}, callback);
        //
        //var addingError = addConditionClass(fact, json);
        //if (addingError) return callbk(addingError);
        //callbk();
    });
};





//addConditionClasses = function(condition, fact, callback) {
//    var cui = condition.cui[0];
//    //if (!condition) cui = condition.cui[0];
//    if (!cui) {
//        var err = "Unable to find CUI for condition: " + JSON.stringify(condition);
//        console.error(err);
//        return callback(err);
//    }
//    var url = getUrlLookupMesh(cui);
//    console.log("\n\nLooking up drug classes at: " + url);
//    HTTP.get(url, function (err, response) {
//        if (err) {
//            console.error("Unable to look up drug class at url: " + url + ":\n" + err);
//            callback(err);
//        }
//        var json = JSON.parse(response.content);
//
//        var props = json.collection[0].properties;
//        if (!props) props = json.collection.properties;
//        if (!props) {
//            var err = "Unable to find properties from: " + url;
//            console.error(err);
//            return callback(err);
//        }
//        var uris = props["http://purl.bioontology.org/ontology/MESH/isa"];
//        if (! uris) {
//            callback("No classes found");
//        }
//
//        //for (var classIdx in classes) {
//        //    var drugClassUri = classes[classIdx];
//        //    console.log("\n\nlookup drug class: " + drugClassUri);
//        //}
//
//        addConditionClassesForEachGenericCui(uris, fact, callback);
//
//
//        //console.log("Received drug class data: " + JSON.stringify(json));
//        //callback(null, json);
//    });
//};

addConditionClassesForEachGenericCui = function(ingredientCuis, fact, callback) {
    if (!ingredientCuis) return callback("No ingredient CUIs were provided");
    async.each(ingredientCuis, function(cui, callbk) {
        //lookup each uri and add it as a conditionication/ingredient
        var lookupUrl = getUrlLookupMesh(cui);
        //var lookupUrl = getUrlLookupConditions(encodeURIComponent(genericUrl));
        console.log("\n\nLooking up condition class at: " + lookupUrl);
        HTTP.get(lookupUrl, function (err, response) {
            if (err) {
                console.error("Unable to look up condition class at url: " + lookupUrl + ":\n" + err);
                callbk(err);
            }
            var json = JSON.parse(response.content);
            //console.log("\n\nReceived ingredient: " + JSON.stringify(json));

            var props;
            try {
                props = json.collection[0].properties;
            } catch (unable) {
                //try again
            }
            if (!props) {
                try {
                    props = json.collection.properties;
                } catch (unable) {
                    //still unable
                }
            }
            if (!props) {
                var err = "Unable to find properties from: " + lookupUrl;
                console.error(err);
                return callback(err);
            }
            var uris = props["http://purl.bioontology.org/ontology/MESH/isa"];
            if (! uris) {
                callback("No classes found");
            }

            //for (var classIdx in classes) {
            //    var drugClassUri = classes[classIdx];
            //    console.log("\n\nlookup drug class: " + drugClassUri);
            //}

            addConditionClassesForEachClassUri(uris, fact, function(err) {
                if (err) return callbk(err);
                callbk();
            });
        });
    }, callback);
};


addConditionClassesForEachClassUri = function(classUris, fact, callback) {
    if (!classUris) return callback("No class URIs were provided");
    async.each(classUris, function(uri, callbk) {
        var lookupUrl = getUrlLookupClass("MESH", uri);
        //var lookupUrl = getUrlLookupConditions(encodeURIComponent(genericUrl));
        console.log("\n\nGetting condition class at: " + lookupUrl);
        HTTP.get(lookupUrl, function (err, response) {
            var json = JSON.parse(response.content);
            var addingError = addConditionClass(fact, json);
            if (addingError) return callbk(addingError);
            callbk();
        });
    }, callback);
};
