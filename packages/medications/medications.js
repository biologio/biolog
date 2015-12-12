/**
 * Created by dd on 9/4/15.
 */

biolog.Medications = {
    PREDICATE: {
        _id: "patient/medication",
        name: "medication",
        nameLC: "medication",
        description: "a medication that a person (patient) takes or has taken in the past",
        subjectEtypes: ["patient"],
        objectEtypes: ["medication"],
        creator: "dave"
    },

    PREDICATE_INGREDIENT: {
        _id: "medication/ingredient",
        name: "ingredient",
        nameLC: "ingredient",
        description: "an ingredient of a medication",
        subjectEtypes: ["medication"],
        objectEtypes: ["medication"],
        creator: "dave"
    },

    MED_FREQUENCIES: {
        ".2" : "5 times a day",
        ".25": "4 times a day",
        ".33": "3 times a day",
        ".5" : "twice a day",
        "1"  : "daily",
        "2"  : "every 2 days",
        "3"  : "every 3 days",
        "4"  : "every 4 days",
        "5"  : "every 5 days",
        "6"  : "every 6 days",
        "7"  : "weekly",
        "14"  : "every 2 weeks",
        "21"  : "every 3 weeks",
        "30"  : "monthly"
    }
};


/**
 * Create a medication fact object, from a object obtained from lookup of RXNORM on bioontology
 * @param patientId
 * @param med
 * @returns {{subj: *, pred: (medicationPredicate._id|*), obj: *, objName: *, startDate: Date, endFlag: number}}
 */
biolog.Medications.createMedFact = function(patientId, med) {
    var cui = biolog.Bioontology.getItemCui(med);
    var name = biolog.Bioontology.getItemPreferredLabel(med);
    var fact = {
        subj: patientId,
        pred: biolog.Medications.PREDICATE._id,
        obj: cui,
        objName: name,
        startDate: new Date(),
        endFlag: 1
    };

    return fact;
};

biolog.Medications.getMedName = function(medFact) {
    if (! medFact) return;
    return medFact.objName;
};

biolog.Medications.getMedFrequency = function(medFact) {
    if (! medFact) return;
    //return getValuePath(medFact, "data.medication/frequency").text;
    return getValuePath(medFact, "data.medication/frequency.text");
};

biolog.Medications.setMedFrequency = function(medFact, frequency) {
    if (! medFact) return;
    if (! frequency || !isNumber(frequency)) return;
    var frequencyNum = Number(frequency);
    var frequencyFact = {
        pred: 'medication/frequency',
        text: frequency,
        num: frequencyNum
    };
    //setValuePath(medFact, "data['medication/frequency']", frequencyFact);
    setValuePath(medFact, "data.medication/frequency", frequencyFact);
};

biolog.Medications.getMedIngredients = function(medFact) {
    if (!medFact) return;
    var ingredients = getValuePath(medFact, "data." + biolog.Medications.PREDICATE_INGREDIENT._id);
    var ingredientsArr = [];
    for (var cui in ingredients) {
        var ingredient = ingredients[cui];
        ingredientsArr.push(ingredient);
    }
    return ingredientsArr;
};


biolog.Medications.addMedIngredient = function(medFact, ingredient) {
    if (! medFact) return "No fact specified";
    if (! ingredient) return ("no ingredient specified");
    var cui = biolog.Bioontology.getItemCui(ingredient);
    //if (! cui) cui = ingredient.cui[0];
    if (! cui) return "ingredient lacks a cui";
    var prefLabel = biolog.Bioontology.getItemPreferredLabel(ingredient);
    if (!prefLabel) return "ingredient lacks a prefLabel";
    prefLabel = prefLabel.toLowerCase();
    var signature = "data." + biolog.Medications.PREDICATE_INGREDIENT._id + "." + cui;

    var ingrObj = {
        obj: cui,
        text: prefLabel
    };
    setValuePath(medFact, signature, ingrObj);
};


biolog.Medications.addMedClass = function(medFact, clazz) {
    var cui = biolog.Bioontology.getItemCui(clazz);
    if (! cui) return "med class lacks a cui";
    var prefLabel = biolog.Bioontology.getItemPreferredLabel(clazz);
    if (!prefLabel) return "med class lacks a prefLabel";
    var signature = "data.medication/class." + cui;

    var obj = {
        obj: cui,
        text: prefLabel
    };
    setValuePath(medFact, signature, obj);
};


biolog.Medications.getIngredientStrength = function(medFact, ingredientCui) {
    if (! medFact || !ingredientCui) return;
    var strength;
    try {
        strength = medFact.data[biolog.Medications.PREDICATE_INGREDIENT._id][ingredientCui].num;
    } catch (unable) {
        //return null
    }
    return strength;
};


biolog.Medications.setIngredientStrength = function(medFact, ingredientCui, strength) {
    if (! medFact || !ingredientCui) return;
    if (! strength || !isNumber(strength)) return;
    var ingredient;
    try {
        ingredient = medFact.data[biolog.Medications.PREDICATE_INGREDIENT._id][ingredientCui];
    } catch (unable) {
        //return null
    }
    if (!ingredient) return;
    var strengthNum = Number(strength);
    ingredient.num = strengthNum;
};


/**
 * Given a medicine result (from biolog.Bioontology), create a fact, with ingredients and their classes added to it
 * When finished, call the callback, with first argument is any error and second argument is the medication fact.
 * @param ptid
 * @param med
 * @param callback
 */
biolog.Medications.constructMedFact = function(ptid, med, callback) {
    var fact = biolog.Medications.createMedFact(ptid, med);
    fact.semanticType = biolog.Bioontology.getItemSemanticTypes(med);
    biolog.Bioontology.getIngredients(med,
        function(err, ingreds) {
            if (err) {
                var msg = "Unable to addIngredients: " + err;
                console.error(msg);
                if (callback) callback(msg);
                return;
            }
            for (var ii in ingreds) {
                var ingredient = ingreds[ii];
                var addingError = biolog.Medications.addMedIngredient(fact, ingredient);
                if (addingError) return callback(addingError);
            }

            var ingredsArr = [];
            var ingredients = fact.data[biolog.Medications.PREDICATE_INGREDIENT._id];
            console.log("\n\nNext add med classes: " + JSON.stringify(ingredients));

            biolog.Bioontology.getMedClassesForEachIngredient(ingredients,
                function(err, medClasses) {
                    if (err) {
                        console.error("Error adding med class: " + err);
                        return callback(err);
                    }

                    for (var i in medClasses) {
                        var medClass = medClasses[i];
                        var addingError = biolog.Medications.addMedClass(fact, medClass);
                        if (addingError) return callback(addingError);
                    }

                    return callback(null, fact);
                }
            );
        }
    );
};