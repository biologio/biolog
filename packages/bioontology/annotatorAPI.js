/**
 * Created by dd on 9/7/15.
 */




Bioontology.getBaseUrlAnnotator = function() {
    return Bioontology.getBaseUrl() + "/annotator";
};

/**
 *
 * @param ontology
 * @param q
 * @returns {string}
 */
Bioontology.getUrlAnnotator = function(ontology, q) {
    var apiKey = Bioontology.getApiKey();
    var url = Bioontology.getBaseUrlAnnotator();
    return url + "?suggest=true" +
        "&ontologies=" + ontology +
        "&include=prefLabel,synonym,definition,notation,cui,semanticType,properties" +
        "&display_context=false" +
        "&apikey=" + apiKey;
};

/**
 * Annotate a block of text against the desired ontologies
 * @param text
 * @param ontologies
 * @param callback
 */
Bioontology.annotate = function(text, ontologies, callback) {
    var url = Bioontology.getUrlAnnotator(ontologies, text);
    //console.log("Bioontology.annotate at URL=" + url);
    HTTP.post(url,
        {data: {"text": text}},
        function (err, response) {
        if (err) {
            return callback(err);
        }
        var json = JSON.parse(response.content);
        return callback(null, json);
    });
};

/**
 * Annotate a block of text against Bioontology
 * @param text
 * @param callback
 */
Bioontology.annotateHealth = function(text, callback) {
    return Bioontology.annotate(text, Bioontology.ONTOLOGIES_HEALTH, callback);
};