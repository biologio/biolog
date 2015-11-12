Template.conditionsMedicationsFeed.helpers({
    medications: function() {
        return Session.get("postFacts");
    },
    isMedcation: function() {
            if (this.pred === "patient/medication") {
                return true
            } else {
                return false;
            }
        }
        // function() {
        //     return Facts.find({
        //         $or: [{
        //             pred: "patient/medication",

    //         }, {
    //             pred: "patient/condition",
    //         }],
    //         $and: [{
    //             creator: Meteor.userId()
    //         }]
    //     }, {
    //         sort: {
    //             created: -1
    //         }
    //     })
    // }
});



Template.conditionsMedicationsFeed.events({
    "click .card, click .bubble, click .yes": function(event, template) {
        console.log(this);
        if (this.pred == "patient/medication") {
            Session.set("biolog:medications/med.editing", this);
        } else {
            //console.log("clicked: " + JSON.stringify(this));
            Session.set("biolog:conditions/condition.editing", this);
        }
        //Session.set("biolog.med.modal.open", true);
    },
    "click .ns-close, click .no": function(event, template) {
        //$(event.target)
        console.log(event.target)
            // $(event.target).parent(".ns-box").toggleClass("ns-show ns-hide");
        var postFacts = Session.get("postFacts");
        var self = this;
        var posts = _.reject(postFacts, function(element) {
            return element.obj == self.obj;

        });

        //postFacts = _.reject(postFacts, function(fact){ return fact.obj == self.obj });
        Session.setAuth("postFacts", posts)

        //$(event.target).parents(".bubble").removeClass("inserted slideInLeft").addClass("slideOutUp")
        //return false;
    }
});
Template.conditionsMedicationsFeed.rendered = function() {
    // ...

};
Template.conditionsMedicationsFeed.animations({

    ".notice, .card": {
        animateInitial: true, // animate the intial elements
        animateInitialStep: 800, // Step between each animation for each initial item
        animateInitialDelay: 0,
        container: "", // container of the ".item" elements
        // class applied to inserted elements (animations courtesy of animate.css)
        in : "",
        out: "", // class applied to removed elements
        inCallback: function() {
            // var title = $(this).find(".title").text();
            //Logs.insert({ text: "Inserted " + title + " to the DOM" });
        },
        outCallback: function() {
            // var title = $(this).find(".title").text();
            //Logs.insert({ text: "Removed " + title + " from the DOM" });
        }
    }
});
Template.conditionsMedicationsHistory.helpers({
    getUserHistory: function() {
        var patient = getPatient();
        //DD 2015-10-25
        if (!patient) return;
        var patientId = patient._id;
        var lists = getPatientConditionsMedications(patientId)
        console.log(lists)
        return lists;

    },
    isCondition: function() {
        return this.pred == "patient/condition" ? true : false;

    },
    getIconsSets: function(number) {
        var icons = '';
        console.log(number)
        for (var i = number; i >= 0; i--) {
            icons += '<i class="ion-happy  icon"></i>';
        };
        return icons;
    },
    formatDate: function(date) {
        return moment(date).format("MMM Do YY")
    }

});
Template.conditionsMedicationsHistory.events({
    "click .ns-box": function(event, template) {
        //console.log("clicked: " + JSON.stringify(this));
        if (this.pred == "patient/medication") {
            Session.set("biolog:medications/med.editing", this);
        } else {
            //console.log("clicked: " + JSON.stringify(this));
            Session.set("biolog:conditions/condition.editing", this);
        }
        //Session.set("biolog.condition.modal.open", true);

    }
});
Template.conditionsMedicationsHistory.rendered = function() {
    
};
Template.factItem.rendered = function() {
    var getFrowns = function() {
        return this.data.num;
    };



    if (this.data && this.data.pred == "patient/medication") {
        $(this.find('.ui.rating.small'))
            .rating({
                maxRating: 5
            }).rating('disable');
    } else {
        $(this.find('.rateit.faces-sm')).rateit().rateit('value', this.data.num) //.bind(getFrowns)

    }

};
Template.factItem.helpers({
    formatDate: function(date) {
        console.log(date);
        return moment(date).format("MMM Do YY")
    },
    isCondition: function() {
        return this.pred == "patient/condition" ? true : false;

    }
});