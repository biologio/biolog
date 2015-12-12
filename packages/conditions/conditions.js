/**
 * Created by dd on 8/30/15.
 */

biolog.Conditions = {
    PREDICATE: {
        _id: "patient/condition",
        name: "condition",
        nameLC: "condition",
        description: "a health condition or diagnosis that a person (patient) has or had in the past",
        subjectEtypes: ["patient"],
        objectEtypes: ["healthcondition"],
        creator: "dave"
    }
};

/**
 * Create a condition fact object, from a Biontology search result object from lookup of MEDLINEPLUS,ICD10CM
 * The fact states: this patient has this condition.
 * @param patientId
 * @param bioontologyConditionItem
 * @returns Biolog fact object
 */
biolog.Conditions.createConditionFact = function(patientId, bioontologyConditionItem) {
    var cui = biolog.Bioontology.getItemCui(bioontologyConditionItem);
    if (! cui) return console.error("Unable to get CUI for condition: " + JSON.stringify(bioontologyConditionItem));
    var name = biolog.Bioontology.getItemPreferredLabel(bioontologyConditionItem);
    var fact = {
        subj: patientId,
        pred: biolog.Conditions.PREDICATE._id,
        obj: cui,
        objName: name,
        startDate: new Date(),
        endFlag: 1
    };
    return fact;
};

/**
 * Get the name of a condition
 * @param conditionFact
 * @returns the name of the condition
 */
biolog.Conditions.getConditionName = function(conditionFact) {
    if (! conditionFact) return;
    return conditionFact.objName;
};

/**
 * Get the severity rating of a condition, on a 5-frown scale
 * @param conditionFact
 * @returns the severity rating
 */
biolog.Conditions.getConditionSeverity = function(conditionFact) {
    if (! conditionFact) return;
    return conditionFact.num;
};

/**
 * Set the severity rating of a condition, on a 5-frown scale
 * @param conditionFact
 * @param severity
 */
biolog.Conditions.setConditionSeverity = function(conditionFact, severity) {
    if (! conditionFact) return;
    //console.log("setConditionSeverity=" + severity);
    if (!isNumber(severity)) return;
    var severityNum = Number(severity);
    if (severityNum < 0 || severityNum > 10) return;
    conditionFact.num = severityNum;
};


/**
 * add a parent category ("class") to a condition fact.
 * @param conditionFact
 * @param clazz - the object from within the biolog.Bioontology search results, which contains the class information
 */
biolog.Conditions.addConditionClass = function(conditionFact, clazz) {
    //console.log("Adding condition class: " + JSON.stringify(clazz));
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
        var signature = "data.condition/class." + cui;
        var obj = {
            obj: cui,
            text: prefLabel
        };
        setValuePath(conditionFact, signature, obj);
    }
};

/**
 * Given a condition result object found from the biolog.Bioontology server, performs a series of queries on the biolog.Bioontology server.
 * It then adds all disease classes (parent categories, grandparents, etc) to the provided Fact object.
 * @param condition
 * @param fact
 * @param callback
 */
biolog.Conditions.addConditionClassesToFacts = function(condition, fact, callback) {
    //add current condition as a class
    //addConditionClass(fact, condition);

    //To the provided fact, add parent classes of this condition as a class
    return biolog.Bioontology.getItemClasses(condition, function(err, classes) {
        if (err) {
            return callback(err);
        }
        for (var ci in classes) {
            var ancestorClass = classes[ci];
            addConditionClass(fact, ancestorClass);
        }
        callback(null, fact);
    });
};



/**
 * Given a condition result (from biolog.Bioontology), create a fact, with its classes added to it
 * When finished, call the callback, with first argument is any error and second argument is the condition fact.
 * @param ptid
 * @param condition
 * @param callback
 */
biolog.Conditions.constructConditionFact = function(ptid, condition, callback) {
    var fact = biolog.Conditions.createConditionFact(ptid, condition);
    fact.semanticType = biolog.Bioontology.getItemSemanticTypes(condition);

    Meteor.call("biolog.bioontology.getItemClasses", condition, function(classes) {
        for (var ci in classes) {
            var clazz = classes[ci];
            var addingError = biolog.Conditions.addConditionClass(fact, clazz);
            if (addingError) return callback(addingError);
        }

        return callback(null, fact);
    });
};
