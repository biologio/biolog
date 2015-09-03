/**
 * Created by dd on 2015-05-12
 */



/**
 * Provides the URL for doing a lookup of a single entity on MESH, which provides greater detail than most ontologies.
 * @param q
 * @returns {string}
 */
//LOCAL
getUrlLookupMesh = function(q) {
return "http://bioportal.smart-bio.org:8080/search?suggest=false" +
"&ontologies=MESH" +
    "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
    "&display_context=false&q=" + q +
    "&apikey=95d31cce-3247-4186-ae95-97c61884c50a";
};

//REMOTE
//getUrlLookupMesh = function(q) {
//    return "http://data.bioontology.org/search?suggest=false" +
//        "&ontologies=MESH" +
//        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
//        "&display_context=false&q=" + q +
//        "&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d";
//};



//LOCAL
//getUrlLookup = function(ontology, q) {
//    return "http://bioportal.smart-bio.org:8080/search?suggest=false" +
//        "&ontologies=" + ontology +
//        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
//        "&display_context=false&q=" + q +
//        "&apikey=95d31cce-3247-4186-ae95-97c61884c50a";
//};

//REMOTE
getUrlLookup = function(ontology, q) {
    return "http://data.bioontology.org/search?suggest=false" +
        "&ontologies=" + ontology +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + q +
        "&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d";
};



//LOCAL
//getUrlLookupClass = function(ontology, purlUrl) {
//    var url = "http://bioportal.smart-bio.org:8080/ontologies/" + ontology + "/classes/" +
//        encodeURIComponent(purlUrl) + "?apikey=95d31cce-3247-4186-ae95-97c61884c50a";
//    return url;
//};


//REMOTE
getUrlLookupClass = function(ontology, purlUrl) {
    var url = "http://data.bioontology.org/ontologies/" + ontology + "/classes/" +
        encodeURIComponent(purlUrl) + "?apikey=89b05cf1-2e81-48f6-baad-58236f6af05d";
    return url;
};


//LOCAL
//getUrlBatchQuery = function() {
//    var url = "http://data.bioontology.org/batch?apikey=95d31cce-3247-4186-ae95-97c61884c50a";
//    return url;
//}

//REMOTE
getUrlBatchQuery = function() {
    var url = "http://data.bioontology.org/batch?apikey=89b05cf1-2e81-48f6-baad-58236f6af05d";
    return url;
};


//LOCAL
//getBioontologyApikey = function() {
//    return "95d31cce-3247-4186-ae95-97c61884c50a";
//};


//REMOTE
getBioontologyApikey = function() {
    return "89b05cf1-2e81-48f6-baad-58236f6af05d";
};