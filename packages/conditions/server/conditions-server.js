
Meteor.methods({
    searchConditions: function(q) {
        console.log("searchConditions: search for: " + q);
        var searchSync = Meteor.wrapAsync(biolog.Bioontology.searchConditions);
        try {
            var conditionsResults = searchSync(q);
            //console.log("searchConditions: found: ", conditionsResults);
            return conditionsResults;
        } catch(err) {
            console.error("ERROR searchConditions: q=" + q, err);
            return [];
        }

    }

    //getConditionClasses: function(condition) {
    //    var getConditionClassesSync = Meteor.wrapAsync(Bioontology.getItemClasses);
    //    try {
    //        var conditionClasses = getConditionClassesSync(condition);
    //        return conditionClasses;
    //    } catch(err) {
    //        console.error("ERROR getConditionClasses: ", err);
    //        return [];
    //    }
    //}
});