/**
 * Created by Dave Donohue on 2015-09-04.
 * This is the API for the biolog:bioontology package for Meteor.
 */

Bioontology = {
    ONTOLOGIES_CONDITIONS: "MEDLINEPLUS,ICD10CM",
    ONTOLOGIES_MEDS: "RXNORM",
    ONTOLOGIES_ANNOTATOR: "MEDLINEPLUS,ICD10CM,RXNORM",
    ONTOLOGY_MESH: "MESH",
    SEMANTIC_TYPES_MEDS: "T116,T109,T121,T002,T197,T127",
    URI_MESH_TRADENAME_OF: "http://purl.bioontology.org/ontology/MESH/tradename_of",
    URI_RXNORM_TRADENAME_OF: "http://purl.bioontology.org/ontology/RXNORM/tradename_of",
    URI_ALT_LABEL: "http://www.w3.org/2004/02/skos/core#altLabel"
};

Bioontology.getApiKey = function() {
    return Meteor.settings.public.bioontology.apiKey;
};

Bioontology.getBaseUrl = function() {
    if (Meteor.settings.public.bioontology.baseUrl) {
        return Meteor.settings.public.bioontology.baseUrl;
    }
    return "http://data.bioontology.org";
};

Bioontology.getBaseUrlSearch = function() {
    return Bioontology.getBaseUrl() + "/search";
};


/**
 * Get the URL to look up a query term using the MESH ontology
 * @param q
 * @returns {string}
 */
Bioontology.getUrlLookupMesh = function(q) {
    var apiKey = Bioontology.getApiKey();
    var searchUrl = Bioontology.getBaseUrlSearch();
    return searchUrl + "?suggest=false" +
        "&ontologies=" + Bioontology.ONTOLOGY_MESH +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + encodeURIComponent(q) +
        "&apikey=" + apiKey;
};


/**
 * Get the URL to look up any entity within the provided ontology
 * @param ontology
 * @param entity
 * @returns {string}
 */
Bioontology.getUrlLookup = function(ontology, entity) {
    var apiKey = Bioontology.getApiKey();
    var searchUrl = Bioontology.getBaseUrlSearch();
    return searchUrl + "?suggest=false" +
        "&ontologies=" + ontology +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + encodeURIComponent(entity) +
        "&apikey=" + apiKey;
};

/**
 * Get the URL to look up any entity within the provided ontology
 * @param ontology
 * @param q - the query
 * @returns {string}
 */
Bioontology.getUrlSearch = function(ontology, q) {
    var apiKey = Bioontology.getApiKey();
    var searchUrl = Bioontology.getBaseUrlSearch();
    return searchUrl + "?suggest=true" +
        "&ontologies=" + ontology +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + encodeURIComponent(q) +
        "&apikey=" + apiKey;
};

/**
 * Get the URL to look up any entity within the provided ontologies
 * @param ontologies
 * @param entity
 * @returns {string}
 */
Bioontology.getUrlSearchSemanticTypes = function(ontologies, semanticTypes, q) {
    var apiKey = Bioontology.getApiKey();
    var searchUrl = Bioontology.getBaseUrlSearch();
    return searchUrl + "?suggest=true" +
        "&ontologies=" + ontologies +
        "&semantic_types=" + semanticTypes +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + encodeURIComponent(q) +
        "&apikey=" + apiKey;
};

/**
 * Get the URL for looking up an OWL class
 * @param ontology - must be a single ontology
 * @param purlUrl
 * @returns {string}
 */
Bioontology.getUrlLookupClass = function(ontology, purlUrl) {
    var url = Bioontology.getBaseUrl() + "/ontologies/" + ontology + "/classes/" +
        encodeURIComponent(purlUrl) + "?apikey=" + Bioontology.getApiKey();
    return url;
};


/**
 * Get the URL for performing a batch query (to lookup multiple classes)
 * @returns {string}
 */
Bioontology.getUrlBatchQuery = function() {
    var url = Bioontology.getBaseUrl() + "/batch?apikey=" + Bioontology.getApiKey();
    return url;
};

/**
 * Get the URL to lookup a user-provided query string
 * @param q
 * @param apiKey
 * @param searchUrl
 * @returns {string}
 */
Bioontology.getUrlSearchConditions = function(q) {
    return Bioontology.getUrlSearch(Bioontology.ONTOLOGIES_CONDITIONS, q);
};


Bioontology.addConditionClasses = function(condition, apiKey, callbackForEachClassFound, finalCallback) {
    //add current condition as a class
    callbackForEachClassFound(condition);
    //get ancestors
    var ancestorsUrl = condition.links.ancestors;
    if (!ancestorsUrl) {
        return finalCallback("No ancestor links found for this condition");
    }
    ancestorsUrl += "?apikey=" + apiKey;
    HTTP.get(ancestorsUrl, function (err, response) {
        if (err) {
            console.error("Unable to look up condition ancestors at url: " + ancestorsUrl + ":\n" + err);
            finalCallback(err);
        }
        var json = JSON.parse(response.content);
        console.log("\n\nReceived condition ancestors from: " + ancestorsUrl);

        //batch query
        var batchUrl = Bioontology.getUrlBatchQuery();
        var batchData = {
            "http://www.w3.org/2002/07/owl#Class": {
                "collection": [],
                "display": "prefLabel,synonym,semanticTypes,cui"
            }
        };
        for (var ancestorIdx in json) {
            var ancestor = json[ancestorIdx];
            var clazz = ancestor["@id"];
            var theOntology = ancestor.links.ontology;
            batchData["http://www.w3.org/2002/07/owl#Class"].collection.push({
                "class": clazz,
                "ontology": theOntology
                //"ontology": "http://data.bioontology.org/ontologies/" + BIOONTOLOGY_ONTOLOGY_CONDITIONS
            });
        }
        console.log("assembled batchData for batch lookup of disease class CUIs:" + JSON.stringify(batchData));
        HTTP.post(batchUrl, {data: batchData}, function(err, result) {
            if (err) {
                console.error("Unable to batch refine condition ancestors at url: " + batchUrl + ":\n" + err + "\nbatchData=" + JSON.stringify(batchData));
                finalCallback(err);
            }
            console.log("Batch queried these ancestors: " + JSON.stringify(result.data, null , "  "));

            for (var ancestorIdx in result.data["http://www.w3.org/2002/07/owl#Class"]) {
                var ancestor = result.data["http://www.w3.org/2002/07/owl#Class"][ancestorIdx];
                callbackForEachClassFound(ancestor);
            }
            finalCallback();
        });

    });
};


/**
 * Search for conditions matching the provided query
 * @param q - the query to search.  Expected to be a string that the user is entering in a text box.  Optimized for typeahead functionality
 * @param callback - the callback to which the result array is passed
 */
Bioontology.searchConditions = function(q, callback) {
    var url = Bioontology.getUrlSearchConditions(q);
    HTTP.get(url, function (err, response) {
        if (err) {
            return callback(err);
        }
        var json = JSON.parse(response.content);
        return callback(null, json.collection);
    });
};


//MEDICATIONS:

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

Bioontology.addIngredients = function(med, callbackForEachIngredient, callback) {
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


Bioontology.addMedClassesForEachGenericCui = function(ingredientCuis, callbackForEachMedClass, callback) {
    if (!ingredientCuis) return callback("No ingredient CUIs were provided");
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
                return callback(err);
            }
            var uris = props["http://purl.bioontology.org/ontology/MESH/isa"];
            if (! uris) {
                callback("No classes found");
            }

            Bioontology.addMedClassesForEachClassUri(uris, callbackForEachMedClass, function(err) {
                if (err) return asyncCallback(err);
                asyncCallback();
            });
        });
    }, callback);
};

Bioontology.addMedClassesForEachClassUri = function(classUris, callbackForEachMedClass, callback) {
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

/**
 * Given an item retrieved from Bioontology, get the CUI
 * @param condition
 */
Bioontology.getItemCui = function(item) {
    var cuis = item.cui;
    if (! cuis) return;
    if ( typeof cuis === 'string') return cuis;
    if( Object.prototype.toString.call( cuis ) === '[object Array]' ) {
        return cuis[0];
    }
};

/**
 * Given an item retrieved from Bioontology, get the preferred label
 * @param condition
 */
Bioontology.getItemPreferredLabel = function(item) {
    if (!item) return;
    return item.prefLabel;
};

/**
 * Given an item retrieved from Bioontology, get the alternate labels (if any)
 * @param condition
 */
Bioontology.getItemAlternateLabels = function(item) {
    if (!item || !item.properties) return;
    return item.properties[Bioontology.URI_ALT_LABEL];
};

/**
 * Given an item retrieved from Bioontology, get the alternate labels (if any)
 * @param condition
 */
Bioontology.getItemSemanticTypes = function(item) {
    if (!item) return;
    return item.semanticType;
};