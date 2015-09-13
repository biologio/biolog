
//TODO deep copy, when we have sub-facts
var slimFact = function(fact) {
    var slimmed = _.clone(fact);
//    var slimmed = jQuery.extend(true, {}, fact);
    delete slimmed._id;
    delete slimmed.subj;
    delete slimmed.subjName;
    return slimmed;
};

/**
 * To add or change any new facts, we use these functions in the server code facts.js.
 addFact
 addProperty
 updateFact
 updateProperty
 setFact
 saveProperty
 In this js file, we distinguish between the ~Fact methods and the ~Property methods.
 The ~Fact methods simply add or update a fact in the database.
 The ~Property methods do 2 things: (1) add the fact by calling the corresponding ~Fact method, and (2) update that value in the owning entity.
 So use the ~Fact method to store a fact, which is either not tied to an entity in particular, or if we would never want to apply rules to that fact.
 Use the ~Property method to store a fact that applies to an entity and that fact is an inherent property of that entity.  And we might apply rules to it.

 Use the add~ method to add without concern for past facts or properties with the same subject entity and same predicate.
 Use the set~ method to invalidate any past facts or properties that have the same subject entity and predicate.
 Use the update~ method to overwrite any past facts or properties that have the same subject entity and predicate, without invalidating.
 */


var getDataForUpdate = function(item, userId) {
    var vals = {};
    for (var dataKey in item.data) {
        var obj = item.data[dataKey];
        var baseKey = "data['" + dataKey + "']";

        vals[baseKey] = {};

        //add each field the the vals to be upserted
        if (obj.pred) {
            vals[baseKey].pred = obj.pred;
        } else {
            vals[baseKey].pred = null;
        }
        if (obj.obj) {
            vals[baseKey].obj = obj.obj;
        } else {
            vals[baseKey].obj = null;
        }
        if (obj.objName) {
            vals[baseKey].objName = obj.objName;
        } else {
            vals[baseKey].objName = null;
        }
        //if (obj.etypes) {
        //    vals[baseKey].etypes = obj.etypes;
        //} else {
        //    vals[baseKey].etypes = null;
        //}
        if (obj.text) {
            vals[baseKey].text = obj.text;
        } else {
            vals[baseKey].text = null;
        }
        if (obj.num) {
            vals[baseKey].num = obj.num;
        } else {
            vals[baseKey].num = null;
        }
        if (obj.normVal) {
            vals[baseKey].normVal = obj.normVal;
        } else {
            vals[baseKey].normVal = null;
        }
        if (obj.unit) {
            vals[baseKey].unit = obj.unit;
        } else {
            vals[baseKey].unit = null;
        }
        if (obj.measure) {
            vals[baseKey].measure = obj.measure;
        } else {
            vals[baseKey].measure = null;
        }
        if (obj.valid) {
            vals[baseKey].valid = obj.valid;
        } else {
            vals[baseKey].valid = 1;
        }
        vals[baseKey].creator = userId;
        vals[baseKey].editors = [userId];
    }
    return vals;
};

var FactMethods;
Meteor.methods(FactMethods = {





    /**
     * Use this if you want to add a new fact, and override/ invalidate past values for the same Subject+Predicate (SP)
     * Requires special editor permission over the subject entity
     *
     * If fact with same SP does not exist, then return addFact().
     * If the the user is permitted (owner of the subject entity) then invalidate past facts with that SP and then call addFact.
     * Return true if the fact was added.
     */
    setFact: function(fact) {
        // Make sure the user is logged in before inserting a task
        if (!this.userId) {
            var message = "User not authenticated";
            console.error(message);
            return { success: false, error: message};
        }

        return _setFact(fact, this.userId);
    },



    /**
     * First call setFact.  If this returns true, then update the property if these conditions are met.
     * 1. The entity is not private, or the user is a trustee.
     * 2. The fact is current
     * 3. There is not already a property with the same signature (SPO or SP).
     *
     * Return true if the property was updated.
     * @param fact
     * @param skipFact if true, do not update the fact, only update the property
     */
    setProperty: function(fact, skipFact) {
        if (!this.userId) {
            var message = "User not authenticated";
            console.error(message);
            return { success: false, error: message};
        }
        check (skipFact, Match.Optional(Boolean));

        if (! skipFact) {
            //var result = FactMethods.setFact(fact);
            var result = _setFact(fact, this.userId);
            if (! result.success) {
                return result;
            }
        }

        return _setProperty(fact, this.userId, skipFact);
    }
});




_setFact = function(fact, userId) {
    //make sure the subject exists
    var subjId = fact.subj;
    var subj = Entities.findOne(subjId);
    if (! subj || subj.valid < 0) {
        var message = "Subject does not exist or is no longer valid: " + subjId;
        console.error(message);
        return { success: false, error: message};
    }

    //make sure this user is an editor or creator
    if (subj.creator != userId && subj.creator != userId && ! _.contains(subj.editors, userId)) {
        var message = "User: " + userId + " not authorized to set property on entity: " + fact.subj;
        console.error(message);
        return { success: false, error: message};
    }

    //find other existing valid facts with the same signature and invalidate them
    if (fact.obj) {
        Facts.update(
            { subj: fact.subj, pred: fact.pred, obj: fact.obj, valid: 1 },
            { $set: {
                valid: 0
            }}
        );
    } else {
        Facts.update(
            { subj: fact.subj, pred: fact.pred, valid: 1 },
            { $set: {
                valid: 0
            }}
        );
    }


    fact.creator = userId;
    //fact.updater = userId;
    var theDate = new Date();
    fact.created = theDate;
    //fact.updated = theDate;
    //if (!fact._id) fact._id = new Meteor.Collection.ObjectID()._str;
    //if (!fact.source) fact.source = "smartbio/server/facts";

    check(fact, {
        //_id: String,
        subj: String,
        pred: String,
        data: Match.Optional(Match.Any),
        obj: Match.Optional(String),
        subjName: Match.Optional(String),
        objName: Match.Optional(String),
        text: Match.Optional(String),
        startDate: Match.Optional(Match.OneOf(undefined, null, String, Date)),
        endDate: Match.Optional(Match.OneOf(undefined, null, String, Date)),
        startFlag: Match.Optional(Match.Any),
        endFlag: Match.Optional(Match.Any),
        created: Date,
        creator: Match.Optional(String),
        num: Match.Optional(Number),
       
        //updated: Match.OneOf(undefined, String, Date),
        //updater: Match.Optional(String),
        //source: String,
        valid: Match.Optional(Match.Integer),
         //updated:Rashid - 11-Sept 2015  
        postId: Match.Optional(String),
        likes: Match.Optional(Array)
    });

    fact._id = new Meteor.Collection.ObjectID()._str;
    console.log("Inserting fact: " + JSON.stringify(fact));
    Facts.insert(fact);

    return {success: true};
};


_setProperty = function(fact, userId, skipFact) {

    var subj = Entities.findOne(fact.subj);
    if (subj.creator != userId && ! _.contains(subj.editors, userId)) {
        var message = "User: " + userId + " not authorized to add property to entity: " + fact.subj;
        console.error(message);
        return { success: false, error: message};
    }

    var predSignature = "data." + fact.pred;
    if (fact.obj) {
        predSignature += "." + fact.obj;
    }
    //overwrite value with the new value
    var newProperty = {};
    //setValuePath(newProperty, predSignature, fact);
    //var newObj = fact;
    //if (fact.obj) {
    //    newObj = {};
    //    newObj[fact.obj] = fact;
    //}

    newProperty[predSignature] = fact;
    //delete newProperty[predSignature].pred;
    delete newProperty[predSignature].subj;

    console.log("_setProperty: newProperty=" + JSON.stringify(newProperty));

    Entities.update(subj._id,
        { $set: newProperty },
        { validate: false }
    );

    //add subfacts
    //if (fact.data) {
    //    var vals = getDataForUpdate(fact, userId);
    //    console.log("Upserting data into entity: " + JSON.stringify(vals));
    //    Entities.update(subj._id,
    //        { $set: vals },
    //        { validate: false }
    //    );
    //}

    return {success: true};
};









///**
// * Add a fact.  No special permissions needed.  Return true if successful.
// *
// * Use this if you want to add a new fact, with no special permissions and no need to invalidate past values
// * for the same subject and the same predicate (SP)
// *
// * Increment use count for the S & O entities referenced.
// * @param fact
// * @param mode
// */
//addFact: function (fact) {
//    // Make sure the user is logged in before inserting a task
//    if (! this.userId) {
//        var message = "User not authenticated";
//        console.error(message);
//        return { success: false, error: message};
//    }
//
//    return _addFact(fact, this.userId);
//},

///**
// * Use this if you want to add a new fact (that is also a property), with no special permissions and no need to invalidate past values
// * for the same subject and the same predicate (SP)
// *
// * Store a fact and also update a property of the subject.
// * When can properties be added?  These things must be true:
// * 1. The entity is not private, or the user is a trustee.
// * 2. The fact is current
// * 3. There is not already a property with the same signature (SPO or SP).
// *
// * First call addFact.  If this returns true, then update the property if the above conditions are met.  Return true if the property was added.
// * @param fact
// */
//addProperty: function(fact, skipFact) {
//
//    // Make sure the user is logged in before inserting a task
//    if (! this.userId) {
//        var message = "User not authenticated";
//        console.error(message);
//        return { success: false, error: message};
//    }
//
//    var storedFact = {};
//    if (! skipFact) {
//        //var result = FactMethods.addFact(fact);
//        var result = _addFact(fact, this.userId);
//        console.log("called addFact(): result=" + JSON.stringify(result));
//        if (! result.success) {
//            return result;
//        }
//        storedFact = result.fact;
//        console.log("storedFact=" + JSON.stringify(storedFact));
//    }
//
//    if (fact.valid <= 0) {
//        var message = "Fact is not valid: " + JSON.stringify(fact);
//        console.error(message);
//        return { success: false, error: message};
//    }
//
//    var subj = Entities.findOne(fact.subj);
//    if (subj.creator != this.userId && subj.editors && ! _.contains(subj.editors, this.userId)) {
//        var message = "User: " + this.userId + " not authorized to add property to entity: " + fact.subj;
//        console.error(message);
//        return { success: false, error: message};
//    }
//
//    var signature = "data." + fact.pred;
//    if (fact.obj) signature += "." + fact.obj;
//    if (getValuePath(subj, signature)) {
//        var message = "Entity: " + fact.subj + " already has property: " + signature;
//        console.error(message);
//        return { success: false, error: message};
//    }
//
//    var newProperty = {};
//    var slimmedFact = slimFact(fact);
//    newProperty[signature] = slimmedFact;
//    console.log("Saving newProperty for entity: " + fact.subj + " = " + JSON.stringify(newProperty));
//    Entities.upsert({_id: fact.subj},
//        { $set: newProperty },
//        { validate: false },
//        function(err, count) {
//            if (err) {
//                console.error("Error saving new property for entity: " + fact.subj + ": " + err);
//                return { success: false, error: err};
//            }
//            console.log("Saved " + count + " new property for entity: " + fact.subj);
//            return {success: true};
//        }
//    );
//
//
//},


/**
 * Use this method if you have a recently-created fact, and you wish to change a date or value
 *
 * Update an existing fact of the same id.  First check permissions and use count.
 * If use count > 0, then fail.  Return true if successful
 */
// updateFact: function (fact) {
//    // Make sure the user is logged in before inserting a task
//    console.log("Updating fact: " + fact._id);

//    if (!this.userId) {
//        var message = "User not authenticated";
//        console.error(message);
//        return { success: false, error: message};
//    }
//    return _updateFact(fact, this.userId);
// },


/**
 * Use this method if you have a recently-created fact (that is also a property), and you wish to change a date or value
 *
 * First call updateFact.  If this returns true, then update the property if these conditions are met.
 * 1. The entity is not private, or the user is a trustee.
 * 2. The fact is current
 * 3. There is not already a property with the same signature (SPO or SP).
 *
 * Return true if the property was updated.
 * @param fact
 * @param skipFact if true, do not update the fact, only update the property
 */
//updateProperty: function(fact, skipFact) {
//    console.log("updateProperty");
//    if (!this.userId) {
//        var message = "User not authenticated";
//        console.error(message);
//        return { success: false, error: message};
//    }
//
//    check (skipFact, Match.Optional(Boolean));
//
//    if (! skipFact) {
//        var result = _updateFact(fact);
//        if (! result.success) {
//            return result;
//        }
//    }
//
//    return _setProperty(fact, this.userId, true);
//},



//_addFact = function (fact, userId) {
//
//    //make sure the subject exists
//    var subjId = fact.subj;
//    var subj = Entities.findOne(subjId);
//    if (! subj || subj.valid < 0) {
//        var message = "Subject does not exist or is no longer valid";
//        console.error(message);
//        return { success: false, error: message};
//    }
//
//    fact.creator = userId;
//    //fact.updater = userId;
//    var theDate = new Date();
//    fact.created = theDate;
//    //fact.updated = theDate;
//    if (!fact._id) fact._id = new Meteor.Collection.ObjectID()._str;
//    //fact.source = "biolog/server/facts";
//    console.log("Inserting fact: " + JSON.stringify(fact));
//    Facts.insert(fact);
//
//    //next update the current data for the subject entity
//    var newEntityVals = {};
//    return {success: true, fact: fact};
//};
//
//
// _updateFact = function(fact, userId) {
//    var existingFact = Facts.findOne(fact._id);

//    //if previous fact not found, abort
//    if (!existingFact) {
//        var message = "No such fact to update";
//        console.error(message);
//        return { success: false, error: message};
//    }

//    //if not permitted, abort
//    if (existingFact.creator != userId && existingFact.editors && ! _.contains(existingFact.editors, userId)) {
//        var message = "User: " + userId + " not authorized to update fact: " + JSON.stringify(fact);
//        console.error(message);
//        return { success: false, error: message};
//    }

//    //if new fact has different subject or predicate than previous, abort
//    if (existingFact.subj != fact.subj) {
//        var message = "Subjects do not match";
//        console.error(message);
//        return { success: false, error: message};
//    }
//    if (existingFact.pred != fact.pred) {
//        var message = "Predicates do not match";
//        console.error(message);
//        return { success: false, error: message};
//    }

//    //todo: if the fact is already used, then mark it as not current and create a new fact
//    console.log("Updating fact which has data: " + JSON.stringify(fact.data));
//    Facts.upsert( fact._id,
//        {$set: {
//            //updated: new Date(),
//            //updater: userId,
//            valid: fact.valid,
//            obj: fact.obj,
//            num: fact.num,
//            text: fact.text,
//            startDate: fact.startDate,
//            startFlag: fact.startFlag,
//            endDate: fact.endDate,
//            endFlag: fact.endFlag
//        }},
//        {validate: false}
//    );

//    //if there is fact data, set that
//    if (fact.data) {
//        var vals = getDataForUpdate(fact, userId);
//        console.log("Upserting data into fact: " + JSON.stringify(vals));
//        Facts.upsert( fact._id,
//            {$set: vals},
//            {validate: false}
//        );
//    }
//    return {success: true};
// };