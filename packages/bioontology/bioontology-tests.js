/**
 * To run these tests:
 *
 * VELOCITY_TEST_PACKAGES=1 meteor test-packages --driver-package velocity:html-reporter biolog:bioontology --settings private/settings.json
 */


describe('test Bioontology settings', function () {
    it('expect Bioontology settings to be present', function () {
        expect(Bioontology.getApiKey()).toBeDefined();
        expect(Bioontology.getUrlSearch()).toBeDefined();
        expect(Bioontology.getUrlAnnotator()).toBeDefined();
    });
});

describe('test Bioontology annotator', function () {
    it('expect Bioontology annotator to annotate known text', function () {
        var text = "I have a bad diabetes and I think I got it because I took steroids and also crestor.";
        Bioontology.annotate(text, function(err, annotations){
            expect(err).toBeNull();
            expect(annotations).toBeDefined();
            console.log("Bioontology annotations=" + JSON.stringify(annotations, null, "  "));
        });

    });
});
