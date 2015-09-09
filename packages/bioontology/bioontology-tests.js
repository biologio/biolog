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

