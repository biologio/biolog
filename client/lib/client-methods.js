/**
 * Created by dd on 3/28/15.
 */

saveProperty = function(fact, callback) {
    //console.log("saveProperty: " + JSON.stringify(fact));
    Meteor.call("setProperty", fact, function(response) {
        if (callback) return callback(response);
        if (response) {
            if (response.success) {
                console.log("Successfully inserted fact and set property.")
            } else {
                console.log("Error setting property: " + response.error);
            }
        }
    });
};

saveFact = function(fact, callback) {
    //console.log("saveProperty: " + JSON.stringify(fact));
    Meteor.call("setFact", fact, function(response) {
        if (callback) return callback(response);
        if (response) {
            if (response.success) {
                console.log("Successfully inserted fact.")
            } else {
                console.log("Error setting fact: " + response.error);
            }
        }
    });
};
