/**
 * Created by dd on 5/24/15.
 */

getFactRating = function(fact) {
    return getValuePath(fact, "data['rating'].num");
};

setFactRating = function(fact, val) {
    if (! fact) return;
    if (! val || !isNumber(val)) return;
    var valNum = Number(val);
    var valFact = {
        pred: 'rating',
        text: val,
        num: valNum
    }
    setValuePath(fact, "data['rating']", valFact);
};