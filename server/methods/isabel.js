/**
 * Created by dd on 3/11/15.
 */


Meteor.methods({
    isabel: function(dob, sex, pregnant, region, diagnoses) {
        if (!dob || !sex || !pregnant || !region || !diagnoses) return;
        this.unblock();
        var isabelConfig = Meteor.settings.isabel;

        var isabelId = isabelConfig.isabelId;
        var isabelPassword = isabelConfig.isabelPassword;
        var url = "http://www.isabelhealthcare.com/private/emr_diagnosis.jsp?" +
            "searchType=0&specialties=28&action=login&id=" + isabelId + "&password=" + isabelPassword +
            "&dob=" + dob + "&sex=" + sex + "&pregnant=" + pregnant + "&region=" + region +
            "&querytext=" + diagnoses + "&suggest=Suggest+Differential+Diagnosis&web_service=json" +
            "&flag=sortbyRW_advanced&callback=isabel";
        console.log("Isabel URL: " + url);

        var result = HTTP.get(url, {timeout: 20000});
        var contentString = result.content.substring(7, result.content.length - 2);
        var content = JSON.parse(contentString);
        var diagnoses = content.Diagnosis_checklist.diagnosis;

        //console.log("diagnoses from Isabel=" + JSON.stringify(diagnoses));
        //lookup CUIs from snomed id
        var batchData = {
            "http://www.w3.org/2002/07/owl#Class": {
                "collection": [],
                "display": "prefLabel,synonym,semanticTypes,cui"
            }
        };

        var snomedUris = [];
        for (var dxi in diagnoses) {
            var diagnosis = diagnoses[dxi];
            //console.log("\n\ndiagnosis=" + JSON.stringify(diagnosis));
            var snomedId = diagnosis.snomed_diagnoses_id;
            var snomedUri = "http://purl.bioontology.org/ontology/SNOMEDCT/" + snomedId;
            snomedUris.push(snomedUri);

            batchData["http://www.w3.org/2002/07/owl#Class"].collection.push({
                "class": snomedUri,
                "ontology": "http://data.bioontology.org/ontologies/SNOMEDCT"
            });
        }

        if (!snomedUris) return diagnoses;

        var postAsync = Meteor.wrapAsync(HTTP.post);

        try {
            var result = postAsync(Bioontology.getUrlBatchQuery(), {data: batchData});
            //console.log("Batch queried SNOMED IDs: " + JSON.stringify(result.data, null , "  "));

            for (var idx in result.data["http://www.w3.org/2002/07/owl#Class"]) {
                var obj = result.data["http://www.w3.org/2002/07/owl#Class"][idx];
                var uri = obj["@id"];
                var prefixLength = uri.lastIndexOf("/") + 1;
                var id = uri.substring(prefixLength);
                var cuis = obj.cui;
                //console.log("cuis = " + cuis + "; id=" + id);

                for (var dxi in diagnoses) {
                    if (diagnoses[dxi].snomed_diagnoses_id == id) {
                        diagnoses[dxi].cuis = cuis;
                        break;
                    }
                }

            }

            return diagnoses;
        } catch (err) {
            console.error("Unable to batch refine condition ancestors:\n" + err);
            return diagnoses;
        }
    }
});