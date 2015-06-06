/**
 * Created by dd on 5/24/15.
 * This provides functions for helping processing of medications
 */

medFrequencies = {
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
};

/**
 * Create a medication fact object, from a object obtained from lookup of RXNORM on bioontology
 * @param patientId
 * @param med
 * @returns {{subj: *, pred: (medicationPredicate._id|*), obj: *, objName: *, startDate: Date, endFlag: number}}
 */
createMedFact = function(patientId, med) {
    var cui = med.cui[0];
    var fact = {
        subj: patientId,
        pred: medicationPredicate._id,
        obj: cui,
        objName: med.prefLabel,
        startDate: new Date(),
        endFlag: 1
    };

    return fact;
};

getMedName = function(medFact) {
    if (! medFact) return;
    return medFact.objName;
};



getMedFrequency = function(medFact) {
    if (! medFact) return;
    //return getValuePath(medFact, "data.medication/frequency").text;
    return getValuePath(medFact, "data.medication/frequency.text");
};



setMedFrequency = function(medFact, frequency) {
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


getMedIngredients = function(medFact) {
    if (!medFact) return;
    var ingredients = getValuePath(medFact, "data.medication/ingredient");
    var ingredientsArr = [];
    for (var cui in ingredients) {
        var ingredient = ingredients[cui];
        ingredientsArr.push(ingredient);
    }
    return ingredientsArr;
};


addMedIngredient = function(medFact, ingredient) {
    if (! medFact) return "No fact specified";
    if (! ingredient) return ("no ingredient specified");
    var cui = ingredient.cui[0];
    //if (! cui) cui = ingredient.cui[0];
    if (! cui) return "ingredient lacks a cui";
    var prefLabel = ingredient.prefLabel;
    if (!prefLabel) return "ingredient lacks a prefLabel";
    var signature = "data.medication/ingredient." + cui;

    var ingrObj = {
        obj: cui,
        text: prefLabel
    };
    setValuePath(medFact, signature, ingrObj);

    //add medication classes to a temporary field in the fact
    //var classes = ingredient.properties["http://purl.bioontology.org/ontology/MESH/isa"];
    //if (!medFact.medClasses) medFact.medClasses = [];
    //medFact.medClasses.push(classes);
};


addMedClass = function(medFact, clazz) {
    var cui = clazz.cui[0];
    //if (! cui) cui = clazz.cui[0];
    if (! cui) return "med class lacks a cui";
    var prefLabel = clazz.prefLabel;
    if (!prefLabel) return "med class lacks a prefLabel";
    var signature = "data.medication/class." + cui;

    var obj = {
        obj: cui,
        text: prefLabel
    };
    setValuePath(medFact, signature, obj);
};



getIngredientStrength = function(medFact, ingredientCui) {
    if (! medFact || !ingredientCui) return;
    var strength;
    try {
        strength = medFact.data["medication/ingredient"][ingredientCui].num;
    } catch (unable) {
        //return null
    }
    return strength;
};

setIngredientStrength = function(medFact, ingredientCui, strength) {
    if (! medFact || !ingredientCui) return;
    if (! strength || !isNumber(strength)) return;
    var ingredient;
    try {
        ingredient = medFact.data["medication/ingredient"][ingredientCui];
    } catch (unable) {
        //return null
    }
    if (!ingredient) return;
    var strengthNum = Number(strength);
    ingredient.num = strengthNum;
};


//getMedStrength = function(medFact) {
//    if (! medFact) return;
//    return getValuePath(medFact, "data.medication/strength.num");
//    //return getValuePath(medFact, "data.medication/strength").num;
//};
//
//setMedStrength = function(medFact, strength) {
//    if (! medFact) return;
//    if (! strength || !isNumber(strength)) return;
//    var strengthNum = Number(strength);
//    var strengthFact = {
//        pred: 'medication/strength',
//        text: strength,
//        num: strengthNum
//    };
//    //setValuePath(medFact, "data['medication/strength']", strengthFact);
//    setValuePath(medFact, "data.medication/strength", strengthFact);
//};



