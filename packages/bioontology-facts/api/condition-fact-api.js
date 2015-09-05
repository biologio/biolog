/**
 * Created by dd on 8/30/15.
 */

BioontologyConditions = {};
/**
 * Create a condition fact object, from a Biontology search result object from lookup of MEDLINEPLUS,ICD10CM
 * The fact states: this patient has this condition.
 * @param patientId
 * @param condition
 * @returns Biolog fact object
 */
BioontologyConditions.createConditionFact = function(patientId, condition) {
    var cui = condition.cui[0];
    var fact = {
        subj: patientId,
        pred: conditionPredicate._id,
        obj: cui,
        objName: condition.prefLabel,
        startDate: new Date(),
        endFlag: 1
    };
    return fact;
};

/**
 * Get the name of a condition
 * @param conditionFact
 * @returns the name of the condition
 */
BioontologyConditions.getConditionName = function(conditionFact) {
    if (! conditionFact) return;
    return conditionFact.objName;
};

/**
 * Get the severity rating of a condition, on a 5-frown scale
 * @param conditionFact
 * @returns the severity rating
 */
BioontologyConditions.getConditionSeverity = function(conditionFact) {
    if (! conditionFact) return;
    return conditionFact.num;
};

/**
 * Set the severity rating of a condition, on a 5-frown scale
 * @param conditionFact
 * @param severity
 */
BioontologyConditions.setConditionSeverity = function(conditionFact, severity) {
    if (! conditionFact) return;
    //console.log("setConditionSeverity=" + severity);
    if (!isNumber(severity)) return;
    var severityNum = Number(severity);
    if (severityNum < 0 || severityNum > 10) return;
    conditionFact.num = severityNum;
};


/**
 * add a parent category ("class") to a condition fact.
 * @param conditionFact
 * @param clazz - the object from within the Bioontology search results, which contains the class information
 */
BioontologyConditions.addConditionClass = function(conditionFact, clazz) {
    console.log("Adding condition class: " + JSON.stringify(clazz));
    var cuiVal = clazz.cui;
    var cuis = [cuiVal];
    if (Array.isArray(cuiVal)) {
        cuis = cuiVal;
    }

    for (var cuiIdx in cuis) {
        var cui = cuis[cuiIdx];
        if (! cui) continue;
        var prefLabel = clazz.prefLabel;
        if (!prefLabel) prefLabel = cui;
        var signature = "data.condition/class." + cui;
        var obj = {
            obj: cui,
            text: prefLabel
        };
        setValuePath(conditionFact, signature, obj);
    }
};

/**
 * Given a condition result object found from the Bioontology server, performs a series of queries on the Bioontology server.
 * It then adds all disease classes (parent categories, grandparents, etc) to the provided Fact object.
 * @param condition
 * @param fact
 * @param apiKey - the Bioontology API key
 * @param callback
 */
BioontologyConditions.addConditionClassesToFacts = function(condition, fact, apiKey, callback) {
    //add current condition as a class
    //addConditionClass(fact, condition);

    //To the provided fact, add parent classes of this condition as a class
    return BioontologyConditions.addConditionClasses(condition, apiKey, function(ancestor) {
        addConditionClass(fact, ancestor);
    }, callback);
};


