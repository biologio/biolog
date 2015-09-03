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
 *
 * Ontology Candidates
 * ICPC2P
 * ICD10
 *
 * Conditions we want to find:
 * nosebleed - NDFRT, MEDDRA, MEDLINEPLUS, VANDF, WHO-ART, MESH, SNOMEDCT
 * high blood pressure - MEDLINEPLUS, ICPC2P, NCIT, MESH, CRISP, SNOMEDCT, SOPHARM, RCD, EFO, CSSO, ICD10CM, SNMI, MP
 * kidney stones - MEDLINEPLUS, OMIM, MEDDRA, LOINC, BDO, MESH, NDFRT, EFO, DOID, HP, MP
 */
BIOONTOLOGY_ONTOLOGY_CONDITIONS = "MEDLINEPLUS,ICD10CM";

//if (Meteor.settings.bioontology.BIOONTOLOGY_ONTOLOGY_CONDITIONS) {
//    BIOONTOLOGY_ONTOLOGY_CONDITIONS = Meteor.settings.bioontology.BIOONTOLOGY_ONTOLOGY_CONDITIONS
//}

//var bSettings = Meteor.settings.bioontology.cond;
//if (! bSettings || ! bSettings.apiKey) return;
//var searchUrl = "http://data.bioontology.org/search";
//if (bSettings.searchUrl) {
//    searchUrl = bSettings.searchUrl;
//}
//var apiKey = bSettings.apiKey;

/**
 * Gets the URL for searching the bioontology server for health conditions.  uses these ontologies: MEDLINEPLUS,ICD10CM to find a combination of
 * clinical + plain language terms (e.g. it can find "nosebleed" or also "epistaxis").
 * @param q - the query that the user has typed
 * @param apiKey - (required) the API key
 * @param searchUrl - (optional) the URL to the Biontology server's search service
 * @returns {string} the URL that looks up matching conditions,
 */
getUrlLookupConditions = function(q, apiKey, searchUrl) {
    if (!searchUrl) searchUrl = "http://data.bioontology.org/search";
    return searchUrl + "?ontologies=" + BIOONTOLOGY_ONTOLOGY_CONDITIONS + "&suggest=true" +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + encodeURIComponent(q) +
        "&apikey=" + apiKey;
};

/**
 * Given a condition result object found from the Bioontology server, performs a series of queries on the Bioontology server.
 * It then adds all disease classes (parent categories, grandparents, etc) to the provided callbackForEachClassFound.
 * @param condition - the Bioontology result object
 * @param apiKey - the Bioontology API key
 * @param callbackForEachClassFound - this is called for each disease class to be added
 * @param finalCallback
 */
addConditionClasses = function(condition, apiKey, callbackForEachClassFound, finalCallback) {
    //add current condition as a class
    callbackForEachClassFound(condition);
    //get ancestors
    var ancestorsUrl = condition.links.ancestors;
    ancestorsUrl += "?apikey=" + apiKey;
    HTTP.get(ancestorsUrl, function (err, response) {
        if (err) {
            console.error("Unable to look up condition ancestors at url: " + ancestorsUrl + ":\n" + err);
            finalCallback(err);
        }
        var json = JSON.parse(response.content);
        console.log("\n\nReceived condition ancestors from: " + ancestorsUrl);

        //batch query
        var batchUrl = getUrlBatchQuery();
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


