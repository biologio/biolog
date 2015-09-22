/**
 * Created by dd on 8/30/15.
 */

Conditions = {
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
Conditions.createConditionFact = function(patientId, bioontologyConditionItem) {
    var cui = Bioontology.getItemCui(bioontologyConditionItem);
    if (! cui) return console.error("Unable to get CUI for condition: " + JSON.stringify(bioontologyConditionItem));
    var name = Bioontology.getItemPreferredLabel(bioontologyConditionItem);
    var fact = {
        subj: patientId,
        pred: Conditions.PREDICATE._id,
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
Conditions.getConditionName = function(conditionFact) {
    if (! conditionFact) return;
    return conditionFact.objName;
};

/**
 * Get the severity rating of a condition, on a 5-frown scale
 * @param conditionFact
 * @returns the severity rating
 */
Conditions.getConditionSeverity = function(conditionFact) {
    if (! conditionFact) return;
    return conditionFact.num;
};

/**
 * Set the severity rating of a condition, on a 5-frown scale
 * @param conditionFact
 * @param severity
 */
Conditions.setConditionSeverity = function(conditionFact, severity) {
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
 * @param clazz - the object from within the Bioontology search results, which contains the class information
 */
Conditions.addConditionClass = function(conditionFact, clazz) {
    //console.log("Adding condition class: " + JSON.stringify(clazz));
    //var cuiVal = clazz.cui;
    var cuiVal = Bioontology.getItemCui(clazz);
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
 * Given a condition result object found from the Bioontology server, performs a series of queries on the Bioontology server.
 * It then adds all disease classes (parent categories, grandparents, etc) to the provided Fact object.
 * @param condition
 * @param fact
 * @param callback
 */
Conditions.addConditionClassesToFacts = function(condition, fact, callback) {
    //add current condition as a class
    //addConditionClass(fact, condition);

    //To the provided fact, add parent classes of this condition as a class
    return Conditions.getConditionClasses(condition, function(err, classes) {
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
 * Given a condition result (from Bioontology), create a fact, with its classes added to it
 * When finished, call the callback, with first argument is any error and second argument is the condition fact.
 * @param ptid
 * @param condition
 * @param callback
 */
Conditions.constructConditionFact = function(ptid, condition, callback) {
    var fact = Conditions.createConditionFact(ptid, condition);

    Bioontology.getConditionClasses(condition,
        function(err, classes) {
            if (err) {
                var msg = "Unable to getConditionClasses: " + err;
                console.error(msg);
                if (callback) callback(msg);
                return;
            }
            for (var ci in classes) {
                var clazz = classes[ci];
                var addingError = Conditions.addConditionClass(fact, clazz);
                if (addingError) return callback(addingError);
            }

            return callback(null, fact);
        }
    );
};
