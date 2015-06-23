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
//    return "http://bioportal.smart-bio.org:8080/search?ontologies=" + conditionOntology + "&suggest=true" +
//        //"&semantic_types=T116,T109,T121,T002,T197,T127" +
//        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
//        "&display_context=false&q=" + encodeURIComponent(q) +
//        "&apikey=95d31cce-3247-4186-ae95-97c61884c50a";
//};

conditionOntology = "LOINC";

//REMOTE
getUrlLookupConditions = function(q) {
    return "http://data.bioontology.org/search?ontologies=" + conditionOntology + "&suggest=true" +
        //"&semantic_types=T116,T109,T121,T002,T197,T127" +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + encodeURIComponent(q) +
        "&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d";
};


addConditionClasses = function(condition, fact, callback) {
    //add current condition as a class
    addConditionClass(fact, condition);
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
            "http://www.w3.org/2002/07/owl#Class": {
                "collection": [],
                "display": "prefLabel,synonym,semanticTypes,cui"
            }
        };
        for (var ancestorIdx in json) {
            var ancestor = json[ancestorIdx];
            var clazz = ancestor["@id"];
            batchData["http://www.w3.org/2002/07/owl#Class"].collection.push({
                "class": clazz,
                "ontology": "http://data.bioontology.org/ontologies/" + conditionOntology
            });
        }
        HTTP.post(batchUrl, {data: batchData}, function(err, result) {
            if (err) {
                console.error("Unable to batch refine condition ancestors at url: " + batchUrl + ":\n" + err + "\nbatchData=" + JSON.stringify(batchData));
                callback(err);
            }
            console.log("Batch queried these ancestors: " + JSON.stringify(result.data, null , "  "));

            for (var ancestorIdx in result.data["http://www.w3.org/2002/07/owl#Class"]) {
                var ancestor = result.data["http://www.w3.org/2002/07/owl#Class"][ancestorIdx];
                addConditionClass(fact, ancestor);
            }
            callback();
        });

    });
};


