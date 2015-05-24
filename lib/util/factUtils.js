/**
 * Created by dd on 5/24/15.
 */

getFactRating = function(fact) {
    return getValuePath(fact, "data['rating'].num");
};