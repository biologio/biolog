/**
 * Created by dd on 5/3/15.
 */

getOntologySearchUrl = function(queryTerm) {
    if (!queryTerm) {
        queryTerm = '';
    } else check(queryTerm, String);

    //return "testing 1234567890";
    var bioportalConfig = YAML.eval(Assets.getText('config/bioportal.yml'));
    var url = bioportalConfig.baseurl + "search?q=" + encodeURIComponent(queryTerm);
    console.log("url=" + url);
    return url;
};

//getOntologyPostParams = function() {
//    var bioportalConfig = YAML.eval(Assets.getText('ontologies/bioportal.yml'));
//}

//EasySearch.config({
//    'searchUrl' : 'localhost:8800',
//    ...
//});

doOntologySearch = function(queryTerm, params, callback) {
    var url = getOntologySearchUrl(queryTerm);
    doSearch(url, params, callback);
};