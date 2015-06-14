/**
 * Created by dd on 2015-06-12.
 * This provides functions for helping processing of conditionications
 */


/**
 * Create a conditionication fact object, from a object obtained from lookup of RXNORM on bioontology
 * @param patientId
 * @param condition
 * @returns {{subj: *, pred: (conditionicationPredicate._id|*), obj: *, objName: *, startDate: Date, endFlag: number}}
 */
createConditionFact = function(patientId, condition) {
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

getConditionName = function(conditionFact) {
    if (! conditionFact) return;
    return conditionFact.objName;
};



getConditionSeverity = function(conditionFact) {
    if (! conditionFact) return;
    return conditionFact.num;
};



setConditionSeverity = function(conditionFact, severity) {
    if (! conditionFact) return;
    if (! severity || !isNumber(severity)) return;
    var severityNum = Number(severity);
    if (severityNum < 0 || severityNum > 10) return;
    conditionFact.num = severityNum;
};



addConditionClass = function(conditionFact, clazz) {
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



