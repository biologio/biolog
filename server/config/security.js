BrowserPolicy.content.allowOriginForAll("*.googleapis.com");
BrowserPolicy.content.allowOriginForAll("*.gstatic.com");
BrowserPolicy.content.allowOriginForAll("*.bootstrapcdn.com");
BrowserPolicy.content.allowImageOrigin("*.gravatar.com");
BrowserPolicy.content.allowImageOrigin("*.ionicframework.com");
 BrowserPolicy.content.allowImageOrigin("*.cloudfront.net");
 BrowserPolicy.content.allowEval()
BrowserPolicy.content.allowFontDataUrl();

// Need to run this at the end so that it overrides normal broswer policy settings.
if (process.env.NODE_ENV === "development")
{
    console.log("In development mode. Allowing all framing so that mocha-web can run for tests.");
    BrowserPolicy.content.allowOriginForAll("localhost:*");
    BrowserPolicy.content.allowConnectOrigin("ws://localhost:5000");
    BrowserPolicy.content.allowConnectOrigin("ws://localhost:3000");
}

/**
 * Prevent the user from updating record to isAdmin or whatever
 * See https://dweldon.silvrback.com/common-mistakes
 */
Meteor.users.deny({
    update: function() {
        return true;
    }
});