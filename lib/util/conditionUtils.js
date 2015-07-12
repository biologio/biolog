/**
 * Created by dd on 2015-06-12.
 * This provides functions for helping processing of conditionications
 */


/**
 * Create a conditionication fact object, from a object obtained from lookup of RXNORM on bioontology
 * @param patientId
 * @param cond
 * @returns a new Condition object
 */
createCondition = function(patientId, cond) {
    var cui = condition.cui[0];
    var condition = new Condition({
        subj: patientId,
        pred: conditionPredicate._id,
        obj: cui,
        objName: condition.prefLabel,
        startDate: new Date(),
        endFlag: 1
    });

    return condition;
};





