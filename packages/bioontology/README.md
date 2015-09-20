## biolog:bioontology
This Meteor package provides an API for interacting with a [Bioontology Bioportal](http://bioportal.bioontology.org/) server,
particularly for health-related reasons.
The National Center for Biomedical Ontology is kind enough to host a server for public use,
but you can alternatively host your own Bioontology server.

This package permits you to use any Bioontology server.

This package enables you to perform these operations:

1. Search against Bioontolgy server, any ontologies
2. Annotate free text against any ontologies
3. Lookup health conditions/diseases for their disease class information, against these 2 ontologies: MEDLINEPLUS, ICD10CM
4. Lookup medicines for their ingredients + medicine class information, against the RXNORM ontology

Please see API documentation below.

### Installation

### Setup of Biolog
Biolog requires a **settings.json** file in the **private** directory.
The file looks like this.

    {
      "public": {
        "bioontology": {
          "baseUrl": "http://data.bioontology.org",
          "apiKey": "put-your-apikey-here"
        }
      }
    }


To start your application, you will need to reference this settings file.  So instead of starting your application like this

    meteor

instead run this

    meteor run --settings private/settings.json


### Running Unit Tests
To run the Bioontology package tests, first stop your application.  Then run this:

    VELOCITY_TEST_PACKAGES=1 meteor test-packages --driver-package velocity:html-reporter biolog:bioontology --settings private/settings.json

Then browse to localhost:3000

### Usage of this package
For an example of how this package can be used in the real world to look up and store medication information, see here

### API Documentation

Function      | Description
------------- | -------------
Bioontology.getUrlSearch(ontologies, q) | Get the URL to look up any entity within the provided ontology or comma-separated list of ontologies
Bioontology.getUrlSearchSemanticTypes(ontologies, semanticTypes, q) | Get the URL to look up any entity within the provided ontologies, limiting to the list of semantic types
Bioontology.searchConditions(q, callback) | Search for conditions matching the provided query - @param q - the query to search.  Expected to be a string that the user is entering in a text box.  Optimized for typeahead functionality; @param callback - the callback to which the result array is passed
Bioontology.getConditionClasses(condition, callback) | For a given condition item (found by calling searchConditions() ), lookup its classes (parents, grandparents, ... in the ontology).  To the callback, send (err, conditionClassesArray).
Bioontology.searchMeds(q, callback) | Search for medicines matching the provided query - @param q - the query to search.  Expected to be a string that the user is entering in a text box.  Optimized for typeahead functionality; @param callback - the callback to which the result array is passed
Bioontology.getIngredients(med, callback) | Query bioontology to get ingredients for a medicine item found. Typically such medicines would have been found by calling Bioontology.searchMeds().  To the callback, send (err, medicineIngredientsArray)
Bioontology.getMedClassesForEachGenericCui(ingredientCuis, finalCallback) | For each medicine ingredient, lookup med classes - @param ingredientCuis - array of med ingredients; @param finalCallback - called when complete with arguments (error, medicineCLassesArray)
Bioontology.getItemCui(item) | get the (first) CUI for an item found by searching Bioontology
Bioontology.getItemPreferredLabel(item) | get the preferred label for an item
Bioontology.getItemAlternateLabels(item) | get alternate labels for an item (if any)
Bioontology.getItemSemanticTypes(item) | get semantic types for an item
Bioontology.annotate(text, ontologies, callback) | annotated the provided text against the list of ontologies
Bioontology.annotateHealth(text, callback) | annotated the provided text against our list of health of ontologies


