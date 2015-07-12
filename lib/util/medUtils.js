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
 * Create a medication object, from a object obtained from lookup of RXNORM on bioontology
 * @param patientId
 * @param med
 * @returns {{subj: *, pred: (medicationPredicate._id|*), obj: *, objName: *, startDate: Date, endFlag: number}}
 */
createMedication = function(patientId, med) {
    var cui = med.cui[0];
    var medication = new Medication({
        subj: patientId,
        pred: medicationPredicate._id,
        obj: cui,
        objName: med.prefLabel,
        startDate: new Date(),
        endFlag: 1
    });
    return medication;
};



