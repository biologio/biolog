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
    //return getValuePath(medFact, "data['medication/strength'].num");
    return getValuePath(medFact, "data.medication/strength.num");
};

getMedFrequency = function(medFact) {
    if (! medFact) return;
    return getValuePath(medFact, "data.medication/frequency.text");
    //return getValuePath(medFact, "data['medication/frequency'].text");
};

setMedStrength = function(medFact, strength) {
    if (! medFact) return;
    if (! strength || !isNumber(strength)) return;
    var strengthNum = Number(strength);
    var strengthFact = {
        pred: 'medication/strength',
        text: strength,
        num: strengthNum
    }
    //setValuePath(medFact, "data['medication/strength']", strengthFact);
    setValuePath(medFact, "data.medication/strength", strengthFact);
};

setMedFrequency = function(medFact, frequency) {
    if (! medFact) return;
    if (! frequency || !isNumber(frequency)) return;
    var frequencyNum = Number(frequency);
    var frequencyFact = {
        pred: 'medication/frequency',
        text: frequency,
        num: frequencyNum
    }
    //setValuePath(medFact, "data['medication/frequency']", frequencyFact);
    setValuePath(medFact, "data.medication/frequency", frequencyFact);
};