Package.describe({
    name: "biolog:feed",
    summary: "Feed page for listing user activity",
    version: "0.2.0"

});

Package.onUse(function(api) {
    api.versionsFrom("METEOR@1.2.0.2");
    api.use('tracker');
    api.use('standard-app-packages')
    api.use('mongo', ['client', 'server']);
    api.use([
        'templating',
        'iron:router',
        'aldeed:collection2',
        'fourseven:scss',
        'momentjs:moment',
        'risul:autocomplete',
        'vazco:universe-html-purifier',
        'reactive-var',
        'biolog:bioontology',
        'biolog:medications',
        'biolog:conditions',
        'u2622:persistent-session',
        'dandv:jquery-rateit',
        'flemay:less-autoprefixer',
        'timmyg:wow',
        'themeteorchef:bert',
        'aldeed:template-extension'
      

    ]);

    // i18n config (must come first)



    
    api.add_files("client/templates/loading.html", ["client"]);
    api.add_files("client/templates/comments.html", ["client"]);
    api.add_files("client/templates/conditionsMedicationsFeed.html", ["client"]);
    api.add_files("client/js/conditionsMedicationsFeed.js", ["client"]);
    api.add_files("client/templates/conditionsMedicationsModals.html", ["client"]);
    api.add_files("client/templates/feed.html", ["client"]);
    api.add_files("client/js/materialize.js", ["client"]);
    api.add_files("client/js/feed.js", ["client"]);
    api.add_files("client/templates/footer.html", ["client"]);
    api.add_files("client/templates/biologFeedbackForm.html", ["client"]);
    api.add_files("client/js/biologFeedbackForm.js", ["client"]);
    api.add_files("lib/route.js", ["client"]);
    api.add_files("client/templates/layout/aboutusLayout.html", ["client"])
    api.add_files("client/templates/about.html", ["client"])
    api.add_files("client/js/about.js", ["client"]);
    api.add_files("lib/collections/collection.js", ["client", "server"]);
    api.add_files("server/publication.js", ["server"]);
    api.add_files("lib/methods.js", ["server"]);
    api.add_files("lib/subscribe.js", ["client"]);
    api.add_files("client/css/material.css", ["client"]);
    api.add_files("client/css/feed.scss", ["client"]);
    api.add_files("client/css/theme.css", ["client"]);


    // api.add_files("lib/client/semantic-ui/custom.semantic.json", ["client"]);

    // static assets; needs cleanup

    // api.addFiles([
    //   'public/img/cubes.png',
    //   'public/img/header-bg.png'

    // ], 'client');


    // i18n languages (must come last)

    // api.addFiles([
    //   'i18n/en.i18n.json'
    // ], ['client', 'server']);

  api.export("Feedback", ['client', 'server']);
   api.export("Feed", ['client']);
});