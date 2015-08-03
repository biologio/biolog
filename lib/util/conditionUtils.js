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
createCondition = function(patientId, conditionInfo) {
    var cui = conditionInfo.cui[0];
    var conditionObj = new Condition({
        subj: patientId,
        pred: conditionPredicate._id,
        obj: cui,
        objName: conditionInfo.prefLabel,
        data: {},
        startDate: new Date(),
        endFlag: 1
    });

    return conditionObj;
};





