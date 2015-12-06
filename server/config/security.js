// BrowserPolicy.content.allowOriginForAll("*.googleapis.com");
// BrowserPolicy.content.allowOriginForAll("*.gstatic.com");
// BrowserPolicy.content.allowOriginForAll("*.bootstrapcdn.com");
// BrowserPolicy.content.allowImageOrigin("*.gravatar.com");
// BrowserPolicy.content.allowOriginForAll("*.ionicframework.com");
// BrowserPolicy.content.allowOriginForAll("*.cloudfront.net");
//  BrowserPolicy.content.allowOriginForAll("*.youtube.com");
//   BrowserPolicy.content.allowOriginForAll("*.youtu.be");
// BrowserPolicy.content.allowEval()
// BrowserPolicy.content.allowFontDataUrl();

// BrowserPolicy.content.allowOriginForAll("*.eager.io");
// BrowserPolicy.content.allowInlineStyles();

// BrowserPolicy.content.allowDataUrlForAll();

// //BrowserPolicy.framing.restrictToOrigin("https://youtube.com")
// BrowserPolicy.content.allowFrameOrigin("https://youtu.be") 
// BrowserPolicy.content.allowFrameOrigin("https://youtube.com") 
// //BrowserPolicy.framing.restrictToOrigin("https://youtu.be")

//  //BrowserPolicy.content.allowOriginForAll("*.youtube.com");
//  //BrowserPolicy.content.allowFrameOrigin("https://youtube.com") 
// //BrowserPolicy.content.allowFrameOrigin("https://youtube.com") 
// //BrowserPolicy.content.allowEval()
// //BrowserPolicy.content.allowFontDataUrl();
// // Need to run this at the end so that it overrides normal broswer policy settings.
// if (process.env.NODE_ENV === "development") {
//     console.log("In development mode. Allowing all framing so that mocha-web can run for tests.");
//     BrowserPolicy.content.allowOriginForAll("localhost:*");
//     BrowserPolicy.content.allowConnectOrigin("ws://localhost:5000");
//     BrowserPolicy.content.allowConnectOrigin("ws://localhost:3000");

// }

// /**
//  * Prevent the user from updating record to isAdmin or whatever
//  * See https://dweldon.silvrback.com/common-mistakes
//  */
// Meteor.users.deny({
//     update: function() {
//         return true;
//     }
// });
Meteor.startup(function(){


 BrowserPolicy.framing.allowAll()
BrowserPolicy.content.allowOriginForAll("*.googleapis.com");
BrowserPolicy.content.allowOriginForAll("*.gstatic.com");
BrowserPolicy.content.allowOriginForAll("*.bootstrapcdn.com");
BrowserPolicy.content.allowImageOrigin("*.gravatar.com");
BrowserPolicy.content.allowOriginForAll("*.ionicframework.com");
BrowserPolicy.content.allowOriginForAll("*.youtube.com");
BrowserPolicy.content.allowOriginForAll("*.cloudfront.net");

BrowserPolicy.content.allowEval()
BrowserPolicy.content.allowFontDataUrl();
BrowserPolicy.content.allowFrameOrigin('youtube.com');

 BrowserPolicy.content.allowFrameOrigin("youtube.com")
BrowserPolicy.framing.restrictToOrigin('youtube.com');

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