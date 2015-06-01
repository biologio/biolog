/**
 * Created by dd on 5/15/15.
 */

/**
 * Provides the URL for doing a typeahead search on the given query
 * @param q
 * @returns {string}
 */
//LOCAL
//getUrlLookupMeds = function(q) {
//    return "http://bioportal.smart-bio.org:8080/search?ontologies=RXNORM&suggest=true" +
//        "&semantic_types=T116,T109,T121,T002,T197,T127" +
//        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
//        "&display_context=false&q=" + encodeURIComponent(q) +
//        "&apikey=95d31cce-3247-4186-ae95-97c61884c50a";
//};

//REMOTE
getUrlLookupMeds = function(q) {
    return "http://data.bioontology.org/search?ontologies=RXNORM&suggest=true" +
        "&semantic_types=T116,T109,T121,T002,T197,T127" +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + encodeURIComponent(q) +
        "&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d";
};
/**
 * Provides the URL for doing a lookup of a single entity on MESH, which provides greater detail than most ontologies.
 * @param q
 * @returns {string}
 */
//LOCAL
//getUrlLookupMesh = function(q) {
//return "http://bioportal.smart-bio.org:8080/search?suggest=false" +
//"&ontologies=MESH" +
//    "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
//    "&display_context=false&q=" + q +
//    "&apikey=95d31cce-3247-4186-ae95-97c61884c50a";
//};

//REMOTE
getUrlLookupMesh = function(q) {
    return "http://data.bioontology.org/search?suggest=false" +
        "&ontologies=MESH" +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + q +
        "&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d";
};

getUrlLookupClass = function(ontology, purlUrl) {
    var url = "http://data.bioontology.org/ontologies/" + ontology + "/classes/" +
        encodeURIComponent(purlUrl) + "?apikey=89b05cf1-2e81-48f6-baad-58236f6af05d";
    return url;
};

//TODO handle combination drugs
addIngredientsAndClasses = function(med, fact, callback) {
    var uriEntries = med.properties["http://purl.bioontology.org/ontology/MESH/tradename_of"];
    if (!uriEntries) {
        uriEntries = med.properties["http://purl.bioontology.org/ontology/RXNORM/tradename_of"];
    }
    if (!uriEntries) {
        return callback("No generic info present");
    };
    var genericUris = [];
    for (var uriIdx in uriEntries) {
        var uriEntry = uriEntries[uriIdx];
        var uriItems = uriEntry.split(",");
        for (var itemIdx in uriItems) {
            var uriItem = uriItems[itemIdx];
            genericUris.push(uriItem);
        }
    }
    async.each(genericUris, function(uri, callbk) {
        //lookup each uri and add it as a medication/ingredient
        var lookupUrl = getUrlLookupClass("RXNORM", uri);
        //var lookupUrl = getUrlLookupMeds(encodeURIComponent(genericUrl));
        //console.log("Looking up generic at: " + lookupUrl);
        HTTP.get(lookupUrl, function (err, response) {
            if (err) {
                console.error("Unable to look up generic ar url: " + lookupUrl + ":\n" + err);
                callbk(err);
            }
            var json = JSON.parse(response.content);
            //console.log("\n\nReceived ingredient: " + JSON.stringify(json));
            var addingError = addMedIngredientAndClasses(fact, json);
            if (addingError) return callbk(addingError);
            callbk();
        });
    }, callback);


};





addMedClasses = function(med, fact, callback) {
    var cui = med.cui[0];
    //if (!med) cui = med.cui[0];
    if (!cui) {
        var err = "Unable to find CUI for med: " + JSON.stringify(med);
        console.error(err);
        return callback(err);
    }
    var url = getUrlLookupMesh(cui);
    console.log("\n\nLooking up drug classes at: " + url);
    HTTP.get(url, function (err, response) {
        if (err) {
            console.error("Unable to look up drug class at url: " + url + ":\n" + err);
            callback(err);
        }
        var json = JSON.parse(response.content);

        var props = json.collection[0].properties;
        if (!props) props = json.collection.properties;
        if (!props) {
            var err = "Unable to find properties from: " + url;
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

        addMedClassesForEach(uris, fact, callback);


        //console.log("Received drug class data: " + JSON.stringify(json));
        //callback(null, json);
    });
};

addMedClassesForEach = function(uris, fact, callback) {
    if (!uris) return callback("No medicine URIs were provided");
    async.each(uris, function(uri, callbk) {
        //lookup each uri and add it as a medication/ingredient
        var lookupUrl = getUrlLookupClass("MESH", uri);
        //var lookupUrl = getUrlLookupMeds(encodeURIComponent(genericUrl));
        //console.log("Looking up generic at: " + lookupUrl);
        HTTP.get(lookupUrl, function (err, response) {
            if (err) {
                console.error("Unable to look up med class at url: " + lookupUrl + ":\n" + err);
                callbk(err);
            }
            var json = JSON.parse(response.content);
            //console.log("\n\nReceived ingredient: " + JSON.stringify(json));
            var addingError = addMedClass(fact, json);
            if (addingError) return callbk(addingError);
            callbk();
        });
    }, callback);
}