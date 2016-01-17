Package.describe({
  name: 'biolog:risk-calculator',
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
  api.versionsFrom('1.2.1');
  api.use(['ecmascript','templating',
        'iron:router',
        'aldeed:collection2',
        'fourseven:scss']);

  
  api.addFiles('client/sass/app.sass', ['client']);
  api.addFiles('client/views/riskCalculator.html', ['client']);
  api.addFiles('risk-calculator.js', ['client']);
  api.addFiles('server/subscribe.js', ['server']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('risk-calculator');
  api.addFiles('risk-calculator-tests.js');
});
