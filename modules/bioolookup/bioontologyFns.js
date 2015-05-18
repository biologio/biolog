/**
 * Created by dd on 5/15/15.
 */

/**
 * Provides the URL for doing a typeahead search on the given query
 * @param q
 * @returns {string}
 */
getUrlLookupMeds = function(q) {
    return "http://bioportal.smart-bio.org:8080/search?ontologies=RXNORM&suggest=true" +
        "&semantic_types=T116,T109,T121,T002,T197,T127" +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + encodeURIComponent(q) +
        "&apikey=95d31cce-3247-4186-ae95-97c61884c50a";
};

/**
 * Provides the URL for doing a lookup of a single entity on MESH, which provides greater detail than most ontologies.
 * @param q
 * @returns {string}
 */
getUrlDetailMesh = function(q) {
    return "http://bioportal.smart-bio.org:8080/search?ontologies=MESH&suggest=false" +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false&q=" + encodeURIComponent(q) +
        "&apikey=95d31cce-3247-4186-ae95-97c61884c50a";
};