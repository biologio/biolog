Meteor.methods({
    /* save an rule and associated methods */

    saveRule: function (rule) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            var message = "User not authenticated";
            console.error(message);
            return { success: false, message: message};
        }

        //make sure the rule  does not already exists
        var alreadyExisting = Rules.findOne(rule._id);
        var theDate = new Date();
        if (alreadyExisting) {
            if (rule.creator != Meteor.userId()) {
                var message = "Rule already exists";
                console.error(message);
                return { success: false, message: message };
            }
        } else {
            rule._id = new Meteor.Collection.ObjectID()._str;
            rule.creator = Meteor.userId();
            rule.created = theDate;
            rule.updater = Meteor.userId();
            rule.updated = theDate;
            rule.source = "biolog/server/rules.js";
            console.log("Inserting rule: " + JSON.stringify(rule, null, "  "));
            Entities.insert(rule);
            return {success: true};
        }

        //update the rule
        rule._id = alreadyExisting._id;
        rule.updater = Meteor.userId();
        rule.updated = theDate;
        console.log("Updating rule: " + JSON.stringify(rule, null, "  "));

        Entities.update(rule._id, rule);

        return {success: true};

    }
});