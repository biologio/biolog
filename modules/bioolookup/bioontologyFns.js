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
//    "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
//    "&display_context=false&q=" + q +
//    "&apikey=95d31cce-3247-4186-ae95-97c61884c50a";
//};

//REMOTE
getUrlLookupMesh = function(q) {
    return "http://data.bioontology.org/search?suggest=false" +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + q +
        "&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d";
};

getUrlLookupClass = function(ontology, purlUrl) {
    var url = "http://data.bioontology.org/ontologies/" + ontology + "/classes/" +
        encodeURIComponent(purlUrl) + "?apikey=89b05cf1-2e81-48f6-baad-58236f6af05d";
    return url;
};


lookupGeneric = function(med, callback) {
    var genericUrl = med.properties["http://purl.bioontology.org/ontology/MESH/tradename_of"];
    if (!genericUrl) {
        genericUrl = med.properties["http://purl.bioontology.org/ontology/RXNORM/tradename_of"];
    }
    if (!genericUrl) {
        return callback("No generic info present");
    };
    var lookupUrl = getUrlLookupClass("RXNORM", genericUrl);
    //var lookupUrl = getUrlLookupMeds(encodeURIComponent(genericUrl));
    console.log("Looking up generic at: " + lookupUrl);
    HTTP.get(lookupUrl, function (err, response) {
        if (err) {
            console.error("Unable to look up generic ar url: " + genericUrl + ":\n" + err);
            callback(err);
        }
        var json = JSON.parse(response.content);
        console.log("Received generic data: " + JSON.stringify(json));
        callback(null, json);
    });
};

lookupDrugClasses = function(med, callback) {
    var url = getUrlLookupMesh(med.cui);
    console.log("Looking up generic at: " + url);
    HTTP.get(url, function (err, response) {
        if (err) {
            console.error("Unable to look up drug class ar url: " + url + ":\n" + err);
            callback(err);
        }
        var json = JSON.parse(response.content);
        console.log("Received drug class data: " + JSON.stringify(json));
        callback(null, json);
    });
};