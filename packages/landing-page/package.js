Package.describe({
    name: "biolog:landing-page",
    summary: "Landing page with app features",
    version: "0.0.1"

});

Package.onUse(function(api) {
    api.use([
        'less',
        'templating',
        'spacebars'
    ], 'client');


    api.add_files("layout/landingLayout.html", ["client"]);
    api.add_files("views/landing.html", ["client"]);
    api.add_files("js/landing.js", ["client"]);
    api.add_files("css/landing.css", ["client"]);
 
});
