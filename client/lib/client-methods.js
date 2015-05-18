/**
 * Created by dd on 3/28/15.
 */


addProperty = function(fact, callback) {
    Meteor.call("addProperty", fact, function(response) {
        if (callback) return callback(response);
        if (response) {
            if (response.success) {
                console.log("Successfully added fact and property.")
            } else {
                console.log("Error adding property: " + response.error);
            }
        }
    });
};

updateProperty = function(fact, callback) {
    console.log("updateProperty: " + JSON.stringify(fact));
    Meteor.call("updateProperty", fact, function(response) {
        if (callback) return callback(response);
        if (response) {
            if (response.success) {
                console.log("Successfully inserted fact and updated property.")
            } else {
                console.log("Error updating property: " + response.error);
            }
        }
    });
};

setProperty = function(fact, callback) {
    console.log("setProperty: " + JSON.stringify(fact));
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