
Meteor.methods({
    searchConditions: function(q) {
        console.log("searchConditions: search for: " + q);
        var searchSync = Meteor.wrapAsync(Bioontology.searchConditions);
        try {
            var conditionsResults = searchSync(q);
            return conditionsResults;
        } catch(err) {
            console.error("ERROR searchConditions: q=" + q, err);
            return [];
        }

    },

    getConditionClasses: function(condition) {
        var getConditionClassesSync = Meteor.wrapAsync(Bioontology.getConditionClasses);
        try {
            var conditionClasses = getConditionClassesSync(condition);
            return conditionClasses;
        } catch(err) {
            console.error("ERROR getConditionClasses: ", err);
            return [];
        }
    }
});