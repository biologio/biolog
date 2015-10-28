Package.describe({
  name: 'biolog:conditions',
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
            'gwendall:template-animations'
        ],
        'client');

    api.addFiles('conditions.js');
    api.addFiles([
            'view/conds.html',
            'view/conds.js'
        ],
        'client');
    api.addFiles([
            'server/conditions-server.js'
        ],
        'server');
    api.export('Conditions');
});

Package.onTest(function(api) {
    api.use('clinical:verification');
    api.use('biolog:conditions');
    api.addFiles('conditions-tests.js');
});
