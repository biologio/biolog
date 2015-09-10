/**
 * To run these tests:
 *
 * VELOCITY_TEST_PACKAGES=1 meteor test-packages --driver-package velocity:html-reporter biolog:bioontology --settings private/settings.json
 */
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] == obj) {
            return true;
        }
    }
    return false;
}

describe('test Bioontology settings', function () {
    it('expect Bioontology settings to be present', function () {
        expect(Bioontology.getApiKey()).toBeDefined();
        expect(Bioontology.getUrlSearch()).toBeDefined();
        expect(Bioontology.getUrlAnnotator()).toBeDefined();
    });
});

describe('test Bioontology annotator', function () {
    var theError = null;
    var theAnnotations = null;
    beforeEach(function(done) {
        var text = "I have a bad diabetes and I think I got it because I took steroids and also crestor.";

        Bioontology.annotate(text, function(err, annotations){
            theError = err;
            theAnnotations = annotations;
            done();
        });

    });

    it('expect Bioontology annotator to annotate known text', function () {
        expect(theError).toBeNull();
        expect(theAnnotations).toBeDefined();
        //console.log("Bioontology annotations=" + JSON.stringify(theAnnotations, null, "  "));
        var a0 = theAnnotations[0];
        var a1 = theAnnotations[1];
        var a2 = theAnnotations[2];
        expect(Bioontology.getItemCui(a0.annotatedClass)).toEqual("C0011849");
        expect(Bioontology.getItemPreferredLabel(a0.annotatedClass)).toEqual("Diabetes Mellitus");
        var altLabels = Bioontology.getItemAlternateLabels(a0.annotatedClass);
        expect(contains(altLabels, "Diabetes")).toBe(true);
        var semanticTypes = Bioontology.getItemSemanticTypes(a0.annotatedClass);
        expect(contains(semanticTypes, "T047")).toBe(true);

        expect(Bioontology.getItemCui(a1.annotatedClass)).toEqual("C0038317");
        expect(Bioontology.getItemPreferredLabel(a1.annotatedClass)).toEqual("Steroids");

        expect(Bioontology.getItemCui(a2.annotatedClass)).toEqual("C1098080");
        expect(Bioontology.getItemPreferredLabel(a2.annotatedClass)).toEqual("Crestor");
    });
});
