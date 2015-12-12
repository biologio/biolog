/**
 * Created by dd on 8/30/15.
 */

biolog.Events = {
    PREDICATE: {
        _id: "patient/event",
        name: "event",
        nameLC: "event",
        description: "a health event that a person (patient) has experienced",
        subjectEtypes: ["patient"],
        objectEtypes: ["healthevent"],
        creator: "dave"
    }
};

/**
 * Create a event fact object, from a Biontology search result object from lookup of LOINC, MESH
 * The fact states: this patient has this event.
 * @param patientId
 * @param bioontologyEventItem
 * @returns Biolog fact object
 */
biolog.Events.createEventFact = function(patientId, bioontologyEventItem) {
    var cui = biolog.Bioontology.getItemCui(bioontologyEventItem);
    if (! cui) return console.error("Unable to get CUI for event: " + JSON.stringify(bioontologyEventItem));
    var name = biolog.Bioontology.getItemPreferredLabel(bioontologyEventItem);
    var fact = {
        subj: patientId,
        pred: biolog.Events.PREDICATE._id,
        obj: cui,
        objName: name,
        startDate: new Date(),
        endFlag: 1
    };
    return fact;
};

/**
 * Get the name of a event
 * @param eventFact
 * @returns the name of the event
 */
biolog.Events.getEventName = function(eventFact) {
    if (! eventFact) return;
    return eventFact.objName;
};

/**
 * Get the severity rating of a event, on a 5-frown scale
 * @param eventFact
 * @returns the severity rating
 */
biolog.Events.getEventSeverity = function(eventFact) {
    if (! eventFact) return;
    return eventFact.num;
};

/**
 * Set the severity rating of a event, on a 5-frown scale
 * @param eventFact
 * @param severity
 */
biolog.Events.setEventSeverity = function(eventFact, severity) {
    if (! eventFact) return;
    //console.log("setEventSeverity=" + severity);
    if (!isNumber(severity)) return;
    var severityNum = Number(severity);
    if (severityNum < 0 || severityNum > 10) return;
    eventFact.num = severityNum;
};


/**
 * add a parent category ("class") to a event fact.
 * @param eventFact
 * @param clazz - the object from within the biolog.Bioontology search results, which contains the class information
 */
biolog.Events.addEventClass = function(eventFact, clazz) {
    //console.log("Adding event class: " + JSON.stringify(clazz));
    //var cuiVal = clazz.cui;
    var cuiVal = biolog.Bioontology.getItemCui(clazz);
    var cuis = [cuiVal];
    if (Array.isArray(cuiVal)) {
        cuis = cuiVal;
    }

    for (var cuiIdx in cuis) {
        var cui = cuis[cuiIdx];
        if (! cui) continue;
        var prefLabel = clazz.prefLabel;
        if (!prefLabel) prefLabel = cui;
        var signature = "data.event/class." + cui;
        var obj = {
            obj: cui,
            text: prefLabel
        };
        setValuePath(eventFact, signature, obj);
    }
};

/**
 * Given a event result object found from the biolog.Bioontology server, performs a series of queries on the biolog.Bioontology server.
 * It then adds all disease classes (parent categories, grandparents, etc) to the provided Fact object.
 * @param event
 * @param fact
 * @param callback
 */
biolog.Events.addEventClassesToFacts = function(event, fact, callback) {
    //add current event as a class
    //addEventClass(fact, event);

    //To the provided fact, add parent classes of this event as a class
    return biolog.Bioontology.getItemClasses(event, function(err, classes) {
        if (err) {
            return callback(err);
        }
        for (var ci in classes) {
            var ancestorClass = classes[ci];
            biolog.Events.addEventClass(fact, ancestorClass);
        }
        callback(null, fact);
    });
};



/**
 * Given a event result (from biolog.Bioontology), create a fact, with its classes added to it
 * When finished, call the callback, with first argument is any error and second argument is the event fact.
 * @param ptid
 * @param event
 * @param callback
 */
biolog.Events.constructEventFact = function(ptid, event, callback) {
    var fact = biolog.Events.createEventFact(ptid, event);
    fact.semanticType = biolog.Bioontology.getItemSemanticTypes(event);

    Meteor.call("biolog.bioontology.getItemClasses", event, function(classes) {
        for (var ci in classes) {
            var clazz = classes[ci];
            var addingError = biolog.Events.addEventClass(fact, clazz);
            if (addingError) return callback(addingError);
        }

        return callback(null, fact);
    });

};
