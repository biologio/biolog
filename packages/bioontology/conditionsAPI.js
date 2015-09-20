/**
 * Created by dd on 9/18/15.
 */

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

/**
 * For a given condition item (found by calling searchConditions() ), lookup its classes (parents, grandparents, ... in the ontology)
 * @param condition
 * @param callback
 * @returns {*}
 */
Bioontology.getConditionClasses = function(condition, callback) {
    var apiKey = Bioontology.getApiKey();
    var classes = [];
    //add current condition as a class
    classes.push(condition);
    //get ancestors
    var ancestorsUrl = condition.links.ancestors;
    if (!ancestorsUrl) {
        return callback("No ancestor links found for this condition");
    }
    ancestorsUrl += "?apikey=" + apiKey;
    HTTP.get(ancestorsUrl, function (err, response) {
        if (err) {
            console.error("Unable to look up condition ancestors at url: " + ancestorsUrl + ":\n" + err);
            callback(err);
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
                callback(err);
            }
            //console.log("Batch queried these ancestors: " + JSON.stringify(result.data, null , "  "));

            for (var ancestorIdx in result.data["http://www.w3.org/2002/07/owl#Class"]) {
                var ancestor = result.data["http://www.w3.org/2002/07/owl#Class"][ancestorIdx];
                classes.push(ancestor);
            }
            callback(null, classes);
        });

    });
};