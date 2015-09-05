## Codebase Documentation

The documents the biolog.io codebase.

### Data Model
Biolog.io uses a generic and extensible data model.

**Entities** - The **Entities** Meteor collection (the  **biolog_entities** MongoDB collection) contains Patients.
It can in principle contain any other entity (thing)

**Facts** - The **Entities** Meteor collection (the  **biolog_entities** MongoDB collection) contains any data about the patient.  It contains this data in the format Subject - Predicate- Value or Object.
Facts contain statements.  The subject can be any entity but for biolog.io purposes, the Entity is generally a patient.

### Data API
Biolog.io offers a data API, which permits easy use of this data model.

#### Client Functions
**saveProperty(fact, callback)** - When saving a fact that is intended to be stored as a current structured value (for rule purposes), this function should be called.
Examples: any measurement like blood pressure, any condition like headache, any medication.
This function saves the fact in the facts collection, and also updates the value associated with the patient entity.

**saveFact(fact, callback)** - When saving a fact that is NOT intended to be stored as a current structured value, this function is called.
Examples: any nonstructured info like a free-text post in the feed, that is not intended to have rules applied against it.

#### How to create a fact
Here is an example of a fact containing S, P, Object

```
createMedFact = function(patientId, med) {
       var cui = med.cui[0];
       var fact = {
           subj: patientId,
           pred: Medications.PREDICATE._id,
           obj: cui,
           objName: med.prefLabel,
           startDate: new Date(),
           endFlag: 1
       };

       return fact;
   };
```

Here is an example of creating a fact that is structured S, P, Value.

```
setFactRating = function(fact, val) {
    if (! fact) return;
    if (! val || !isNumber(val)) return;
    var valNum = Number(val);
    var valFact = {
        pred: 'rating',
        text: val,
        num: valNum
    }
    //setValuePath(fact, "data['rating']", valFact);
    setValuePath(fact, "data.rating", valFact);
};
```

#### How to store feed posts
I recommend you store these as a fact.  Use the **saveFact** function to store on the server
The fact should be structured as follows

```
var postFact = {
subj: getPatient()._id,
pred: "patient/post",
text: postText,
valid: 1,
creator: userId
}
