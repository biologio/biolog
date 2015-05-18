
Meteor.methods({
    /* save an entity and associated methods */

    getEntity: function(id) {
        check(id, String);
        var entity = Entities.findOne(id);
        return entity;
    },

    addEntity: function (entity) {
        check(entity, {
            _id: String,
            name: String,
            source: String,
            etypes: [String]
        });
        // Make sure the user is logged in before inserting a task
        if (!this.userId) {
            var message = "User not authenticated";
            console.error(message);
            return { success: false, message: message};
        }

        //make sure the entity  does not already exists
        check(entity._id, String);
        var alreadyExisting = Entities.findOne(entity._id);
        if (alreadyExisting) {
            var message = "Entity already exists";
            console.error(message);
            return { success: false, message: message};
        }

        entity.creator = this.userId;
        entity.updater = this.userId;
        entity.owners = [this.userId];
        var theDate = new Date();
        entity.created = theDate;
        entity.updated = theDate;
        entity.valid = 1;
        if (!entity.source) entity.source = "biolog/server/entities";
        console.log("Inserting entity: " + JSON.stringify(entity));
        Entities.insert(entity);

        return {success: true};

    }
});