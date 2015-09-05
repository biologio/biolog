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

    api.use([
            'session',
            'iron:router',
            'jquery',
            'templating',
            'reactive-var',
            'biolog:bioontology',
            'dandv:jquery-rateit'
        ],
        'client');

    //api.addFiles('db/bioontology-publications.js', 'server');

    api.addFiles([
            'api/condition-fact-api.js',
            'view/conditions.html',
            'view/conditions.js',
            'api/med-fact-api.js',
            'view/meds.html',
            'view/meds.js'
        ],
        'client');

    api.addFiles('routes/bioontology-routes.js', 'client');
    api.export('BioontologyConditions', 'client');
    api.export('BioontologyMedications', 'client');
});

Package.onTest(function(api) {
    api.use('tinytest');
    api.use('biolog:bioontology');
    api.use('biolog:bioontology-facts');
    api.addFiles('bioontology-facts-tests.js');
});
