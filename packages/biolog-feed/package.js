Package.describe({
    name: "biolog:feed",
    summary: "Feed page for listing user activity",
    version: "0.1.0"

});

Package.onUse(function(api) {


    api.use([
        'templating',
        'iron:router',
        'fourseven:scss',
        'momentjs:moment',
        'risul:autocomplete'

    ], ['client']);

    // i18n config (must come first)



    api.add_files("client/js/materialize.min.js", ["client"]);
    api.add_files("client/templates/loading.html", ["client"]);
    api.add_files("client/templates/feed.html", ["client"]);
    api.add_files("client/_partials/_footer.html", ["client"]);
    api.add_files("lib/route.js", ["client"]);

    api.add_files("scss.json", ["client", "server"]);

    api.add_files("client/js/feed.js", ["client"]);
    api.add_files("client/css/material.css", ["client"]);
    api.add_files("client/css/feed.scss", ["client"]);


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

});
