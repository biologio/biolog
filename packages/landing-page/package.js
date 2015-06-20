Package.describe({
    name: "biolog:landing-page",
    summary: "Landing page with app features",
    version: "0.0.1"

});

Package.onUse(function(api) {
    api.use([
        'less',
        'templating',
        'spacebars',
        'natestrauser:animate-css'

    ], 'client');


    api.add_files("layout/landingLayout.html", ["client"]);
    api.add_files("views/landing.html", ["client"]);
    api.add_files("views/grid.html", ["client"]);
     api.add_files("js/modernizr.js", ["client"]);
    api.add_files("js/landing.js", ["client"]);
    api.add_files("js/classie.js", ["client"]);
    api.add_files("js/grid.js", ["client"]);
    api.add_files("css/landing.css", ["client"]);
    api.add_files("css/grid.css", ["client"]);
 
});
