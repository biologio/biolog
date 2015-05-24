/**
 * Created by dd on 5/24/15.
 * This provides functions for helping processing of medications
 */

getMedName = function(medFact) {
    if (! medFact) return;
    return medFact.objName;
};

getMedStrength = function(medFact) {
    if (! medFact) return;
    return getValuePath(medFact, "data['medication/strength'].num");
};

getMedFrequency = function(medFact) {
    if (! medFact) return;
    return getValuePath(medFact, "data['medication/frequency'].text");
};

