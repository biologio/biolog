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
        "&display_context=false&text=" + encodeURIComponent(q) +
        "&apikey=" + apiKey;
};

Bioontology.annotate = function(q, callback) {
    var url = Bioontology.getUrlAnnotator(Bioontology.ONTOLOGIES_ANNOTATOR, q);
    console.log("Bioontology.annotate at URL=" + url);
    HTTP.get(url, function (err, response) {
        if (err) {
            return callback(err);
        }
        //console.log("Bioontology.annotate: response=" + JSON.stringify(response));
        var json = JSON.parse(response.content);
        return callback(null, json);
    });
};