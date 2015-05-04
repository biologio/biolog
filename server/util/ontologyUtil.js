/**
 * Created by dd on 5/3/15.
 */

getOntologySearchUrl = function(queryTerm) {
    check(queryTerm, String);
    //return "testing 1234567890";
    var bioportalConfig = YAML.eval(Assets.getText('ontologies/bioportal.yml'));
    var url = bioportalConfig.baseurl + "search?q=" + encodeURIComponent(queryTerm);
    console.log("url=" + url);
    return url;
};