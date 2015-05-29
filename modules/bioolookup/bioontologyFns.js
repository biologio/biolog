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
//getUrlDetailMesh = function(q) {
//    return "http://bioportal.smart-bio.org:8080/search?ontologies=MESH&suggest=false" +
//        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
//        "&display_context=false&q=" + encodeURIComponent(q) +
//        "&apikey=95d31cce-3247-4186-ae95-97c61884c50a";
//};

//REMOTE
getUrlDetailMesh = function(q) {
    return "http://data.bioontology.org/search?ontologies=SNOMEDCT&suggest=false" +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + encodeURIComponent(q) +
        "&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d";
};