
Meteor.methods({
    "biolog.searchEvents": function(q) {
        console.log("searchEvents: search for: " + q);
        var searchSync = Meteor.wrapAsync(biolog.Bioontology.searchEvents);
        try {
            var results = searchSync(q);
            //console.log("searchConditions: found: ", conditionsResults);
            return results;
        } catch(err) {
            console.error("ERROR searchEvents: q=" + q, err);
            return [];
        }

    }
});