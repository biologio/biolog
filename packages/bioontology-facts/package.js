Package.describe({
    name: 'biolog:bioontology-facts',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.3');
    api.use('tracker');
    api.use('session', 'client');
    api.use('jquery', 'client');
    api.use('templating', 'client');
    api.use('reactive-var', 'client');
    api.use('biolog:bioontology', 'client');
    api.addFiles('api/condition-fact-api.js', 'client');
    api.addFiles('view/conditions.html', 'client');
    api.addFiles('view/conditions.js', 'client');

});

Package.onTest(function(api) {
    api.use('tinytest');
    api.use('biolog:bioontology');
    api.use('biolog:bioontology-facts');
    api.addFiles('bioontology-facts-tests.js');
});
