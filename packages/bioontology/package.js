Package.describe({
  name: 'biolog:bioontology',
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
    api.use('http@1.1.0');
    api.use('peerlibrary:async');
    api.addFiles([
        'bioontologyAPI.js', 'conditionsAPI.js', 'medicinesAPI.js', 'annotatorAPI.js'
        ],
        ['client', 'server']);
    api.export('Bioontology', ['client', 'server']);
});

Package.onTest(function(api) {
    api.versionsFrom('1.1.0.3');
    api.use('http@1.1.0');
    api.use('peerlibrary:async');
    api.use('sanjo:jasmine@0.18.0');
    //api.use('rsbatech:robotframework');
    api.use('biolog:bioontology');
    api.addFiles('bioontology-tests.js');
});
