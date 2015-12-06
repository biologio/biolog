Package.describe({
  name: 'biolog:health-events',
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
    api.use(['tracker', 'biolog:biolog-core'], ['client', 'server']);

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

    api.addFiles('events.js');
    api.addFiles([
            'view/evts.html',
            'view/evts.js'
        ],
        'client');
    api.addFiles([
            'server/events-server.js'
        ],
        'server');
    api.export('Events');
});

Package.onTest(function(api) {
    api.use('clinical:verification');
    api.use('biolog:conditions');
    api.addFiles('conditions-tests.js');
});
