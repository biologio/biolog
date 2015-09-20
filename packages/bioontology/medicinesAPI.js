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
Bioontology.getIngredients = function(med, callback) {
    var uriEntries = med.properties[Bioontology.URI_MESH_TRADENAME_OF];
    if (!uriEntries) {
        uriEntries = med.properties[Bioontology.URI_RXNORM_TRADENAME_OF];
    }

    var ingredients = [];
    if (!uriEntries) {
        console.log("No generic info present - add self as the sole ingredient");
        ingredients.push(med);
        return callback(null, ingredients);
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
            ingredients.push(json);
            asyncCallback();
        });
    }, function() {
        callback(null, ingredients);
    });
};


/**
 * For each medicine ingredient, lookup med classes
 * @param ingredients - array of med ingredients, as found from search of bioontology
 * We expect some ingredients to lack class information
 * @param callback - called when complete
 * @returns {*}
 */
Bioontology.getMedClassesForEachIngredient = function(ingredients, callback) {
    var classes = [];
    var cuis = [];
    for (var ii in ingredients) {
        var ingredient = ingredients[ii];
        var cui = Bioontology.getItemCui(ingredient);
        cuis.push(cui);
    }
    if (!cuis) return callback("No ingredients with CUIs were provided");
    console.log("\n\n**** getMedClassesForEachIngredient: lookup these ingredients:" + cuis);
    async.each(cuis, function(cui, asyncCallback) {
        //lookup each uri and add it as a medication/ingredient
        var lookupUrl = Bioontology.getUrlLookupMesh(cui);
        console.log("\n\nLooking up med classes at: " + lookupUrl);
        HTTP.get(lookupUrl, function (err, response) {
            if (err) {
                console.error("Unable to look up med classes at url: " + lookupUrl + ":\n" + err);
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
                return callback(err);
            }
            var uris = props["http://purl.bioontology.org/ontology/MESH/isa"];
            if (! uris) {
                var err = "No classes found for ingredient: " + cui;
                console.log(err);
                //return callback(err);
                return asyncCallback();
            }

            console.log("For ingredient: " + cui + ", found this link to class info: " + uris);
            Bioontology.getMedClassesForEachClassUri(uris, function(err, subClasses) {
                if (err) {
                    console.error("ERROR looking up classes for ingredient: " + cui + ": " + err);
                    return asyncCallback(err);
                }
                classes = classes.concat(subClasses);
                asyncCallback();
            });
        });
    }, function() {
        callback(null, classes);
    });
};

/**
 * Internal method for looking up all medication classes, given a URL to that info (on bioontology server).
 * If exception occurs, abort and return an error to the callback
 * @param classUris
 * @param callback
 * @returns {*} calls callback, with first arg=error and 2nd arg=an array of classes
 */
Bioontology.getMedClassesForEachClassUri = function(classUris, callback) {
    if (!classUris) return callback("No class URIs were provided");
    var classes = [];
    async.each(classUris, function(uri, asyncCallback) {
        var lookupUrl = Bioontology.getUrlLookupClass("MESH", uri);
        console.log("\n\nGetting med class at: " + lookupUrl);
        HTTP.get(lookupUrl, function (err, response) {
            if (err) return callback(err);
            var json = JSON.parse(response.content);
            console.log("\n\n****For drug class: " + uri + ", found these details: " + JSON.stringify(json, null, "  "));
            //classes = classes.concat(json);
            classes.push(json);
            asyncCallback();
        });
    }, function() {
        callback(null, classes);
    });
};

//Bioontology.getMedClassesForEachClassUri = function(classUris, callbackForEachMedClass, callback) {
//    if (!classUris) return callback("No class URIs were provided");
//    async.each(classUris, function(uri, asyncCallback) {
//        var lookupUrl = Bioontology.getUrlLookupClass("MESH", uri);
//        //console.log("\n\nGetting med class at: " + lookupUrl);
//        HTTP.get(lookupUrl, function (err, response) {
//            var json = JSON.parse(response.content);
//            callbackForEachMedClass(json);
//            asyncCallback();
//        });
//    }, callback);
//};
