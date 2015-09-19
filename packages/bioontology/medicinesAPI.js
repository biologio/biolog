/**
 * Provides the URL for doing a typeahead search on the given query term, for medications
 * @param q
 * @returns {string}
 */
Bioontology.getUrlSearchMeds = function(q) {
    return Bioontology.getUrlSearchSemanticTypes(Bioontology.ONTOLOGIES_MEDS, Bioontology.SEMANTIC_TYPES_MEDS, q);
};

/**
 * Search for medicines matching the provided query
 * @param q - the query to search.  Expected to be a string that the user is entering in a text box.  Optimized for typeahead functionality
 * @param callback - the callback to which the result array is passed
 */
Bioontology.searchMeds = function(q, callback) {
    var url = Bioontology.getUrlSearchMeds(q);
    HTTP.get(url, function (err, response) {
        if (err) {
            return callback(err);
        }
        var json = JSON.parse(response.content);
        return callback(null, json.collection);
    });
};

/**
 * Query bioontology to get ingredients for a medicine item found.
 * Typically such medicines would have been found by calling Bioontology.searchMeds()
 * @param med
 * @param callbackForEachIngredient
 * @param callback
 * @returns {*}
 */
Bioontology.getIngredients = function(med, callbackForEachIngredient, callback) {
    var uriEntries = med.properties[Bioontology.URI_MESH_TRADENAME_OF];
    if (!uriEntries) {
        uriEntries = med.properties[Bioontology.URI_RXNORM_TRADENAME_OF];
    }
    if (!uriEntries) {
        console.log("No generic info present - add self as the sole ingredient");
        callbackForEachIngredient(med);
        return callback();
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
    async.each(genericUris, function(uri, asyncCallback) {
        //lookup each uri and add it as a medication/ingredient
        var lookupUrl = Bioontology.getUrlLookupClass(Bioontology.ONTOLOGIES_MEDS, uri);
        HTTP.get(lookupUrl, function (err, response) {
            if (err) {
                console.error("Unable to look up generic ar url: " + lookupUrl + ":\n" + err);
                asyncCallback(err);
            }
            var json = JSON.parse(response.content);
            console.log("\n\nReceived ingredient from: " + lookupUrl);
            callbackForEachIngredient(json);
            asyncCallback();
        });
    }, callback);
};


/**
 * For each medicine ingredient, lookup med classes
 * @param ingredientCuis - array of med ingredients
 * @param callbackForEachMedClass - called for each class found
 * @param finalCallback - called when complete
 * @returns {*}
 */
Bioontology.getMedClassesForEachGenericCui = function(ingredientCuis, callbackForEachMedClass, finalCallback) {
    if (!ingredientCuis) return finalCallback("No ingredient CUIs were provided");
    async.each(ingredientCuis, function(cui, asyncCallback) {
        //lookup each uri and add it as a medication/ingredient
        var lookupUrl = Bioontology.getUrlLookupMesh(cui);
        console.log("\n\nLooking up med class at: " + lookupUrl);
        HTTP.get(lookupUrl, function (err, response) {
            if (err) {
                console.error("Unable to look up med class at url: " + lookupUrl + ":\n" + err);
                asyncCallback(err);
            }
            var json = JSON.parse(response.content);
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
                return finalCallback(err);
            }
            var uris = props["http://purl.bioontology.org/ontology/MESH/isa"];
            if (! uris) {
                finalCallback("No classes found");
            }

            Bioontology.getMedClassesForEachClassUri(uris, callbackForEachMedClass, function(err) {
                if (err) return asyncCallback(err);
                asyncCallback();
            });
        });
    }, finalCallback);
};

Bioontology.getMedClassesForEachClassUri = function(classUris, callbackForEachMedClass, callback) {
    if (!classUris) return callback("No class URIs were provided");
    async.each(classUris, function(uri, asyncCallback) {
        var lookupUrl = Bioontology.getUrlLookupClass("MESH", uri);
        //console.log("\n\nGetting med class at: " + lookupUrl);
        HTTP.get(lookupUrl, function (err, response) {
            var json = JSON.parse(response.content);
            callbackForEachMedClass(json);
            asyncCallback();
        });
    }, callback);
};
