
Meteor.startup(function(){


 BrowserPolicy.framing.allowAll()
BrowserPolicy.content.allowOriginForAll("*.googleapis.com");
BrowserPolicy.content.allowOriginForAll("*.gstatic.com");
BrowserPolicy.content.allowOriginForAll("*.bootstrapcdn.com");
BrowserPolicy.content.allowImageOrigin("*.gravatar.com");
BrowserPolicy.content.allowOriginForAll("*.ionicframework.com");
BrowserPolicy.content.allowOriginForAll("*.vimeo.com");
BrowserPolicy.content.allowOriginForAll("*.youtube.com");
BrowserPolicy.content.allowOriginForAll("*.cloudfront.net");


BrowserPolicy.content.allowFontDataUrl();
BrowserPolicy.content.allowFrameOrigin('*.youtube.com');
 BrowserPolicy.content.allowEval()
 
 BrowserPolicy.content.allowFrameOrigin("*.vimeo.com")
 BrowserPolicy.content.allowEval()

// Need to run this at the end so that it overrides normal broswer policy settings.
if (process.env.NODE_ENV === "development") {
    console.log("In development mode. Allowing all framing so that mocha-web can run for tests.");
    BrowserPolicy.content.allowOriginForAll("localhost:*");
    BrowserPolicy.content.allowConnectOrigin("ws://localhost:5000");
    BrowserPolicy.content.allowConnectOrigin("ws://localhost:3000");

}

})

/**
 * Prevent the user from updating record to isAdmin or whatever
 * See https://dweldon.silvrback.com/common-mistakes
 */
Meteor.users.deny({
    update: function() {
        return true;
    }

    });