/**
 * Created by dd on 5/16/15.
 */
Router.route('/events', function() {
    this.render('biologEvents');
});


Tracker.autorun(function() {
    if (Session.get("biolog:events/events.modal.open")) {
        $('#bioontologyEventsModal').modal({
            closable: true,
            onApprove: function() {
                Session.set("biolog:events/events.modal.open", null);
                submitBioolookupEvents();
                return true;
            },
            onDeny: function() {
                Session.set("biolog:events/events.modal.open", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog:events/events.modal.open", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog:events/events.modal.open"));
        $('#bioontologyEventsModal').modal('hide');
    }
});




var eventsResults = new ReactiveVar();


Template["biologBioontologyEventsContent"].helpers({
    results: function() {
        return eventsResults.get();
    },

    altLabels: function() {
        var obj = this;
        var altLabels = obj.properties["http://www.w3.org/2004/02/skos/core#altLabel"];
        return altLabels;
    }
});

Template["biologBioontologyEventsContent"].events({
    "input .prompt": function(event, template) {
        //if return character, submit the form
        if (event.which === 13) {
            if (Session.get("biolog.bioontology.events.results")) {
                return submitBioolookupEvents();
            }
            if (eventsResults.get() && eventsResults.get().length > 0) {
                Session.set("biolog.bioontology.events.results", eventsResults.get()[0]);
                eventsResults.set([]);
                return submitBioolookupEvents();
            }
        }



        Session.set("biolog.bioontology.events.results", null);
        var q = template.find("#biologBioontologySearchEventsBox").value;
        //var apiKey = biolog.Bioontology.getApiKey();
        //var url = biolog.Bioontology.getUrlSearchEvents(q);

        biolog.Bioontology.searchEvents(q, function(err, events) {
            if (err) {
                return eventsResults.set([]);
            }
            eventsResults.set(events);
        });

        //Meteor.call("searchEvents", q, function(err, events) {
        //    if (err) {
        //        console.error("Error searching for events: ", err);
        //        eventsResults.set([]);
        //    } else {
        //        //console.log("conds: received results: ", events);
        //        eventsResults.set(events);
        //    }
        //});
    },

    "click .bioontologyEventsResult": function(event, template) {
        var selectedEvent = this;
        //console.log("clicked: " + JSON.stringify(selectedEvent));
        eventsResults.set([selectedEvent]);
        Session.set("biolog.bioontology.events.results", selectedEvent);
    }
});


submitBioolookupEvents = function() {
    Session.set("biolog:events/events.modal.open", null);
    var cond = Session.get("biolog.bioontology.events.results");
    console.log("Saving event: " + JSON.stringify(cond));
    if (!cond) return;

    biolog.Events.constructEventFact(getPatient()._id, cond, function(err, fact){
        if (err) {
            return console.error(err);
        }
        saveProperty(fact, function(err, success) {
            if (err) {
                console.error("Unable to save event fact: " + err + "\n" + JSON.stringify(fact));
                return;
            }


            //saveProperty(fact, function(err, success) {
            //    if (err) {
            //        console.error("Unable to save event fact: " + err + "\n" + JSON.stringify(fact));
            //        return;
            //    }
            //});
        });

    });
};

    //var fact = Events.createEventFact(getPatient()._id, cond);
    //biolog.Bioontology.getEventClasses(cond,
    //    //callback to add a event:
    //    function(eventToAdd) {
    //        //add event to the fact
    //        Events.addEventClass(fact, eventToAdd);
    //    },
    //    //final callback:
    //    function(err) {
    //        if (err) {
    //            console.error("Unable to addClasses: " + JSON.stringify(err));
    //        }
    //
    //        saveProperty(fact, function(err, success) {
    //            if (err) {
    //                console.error("Unable to save event fact: " + err + "\n" + JSON.stringify(fact));
    //                return;
    //            }
    //        });
    //});







eventFrowns = new ReactiveVar();

var getFrowns = function() {
    var event = Session.get("biolog:events/event.editing");
    if (!event) return;
    var frowns = biolog.Events.getEventSeverity(event);
    return frowns;
};


Template["biologEvents"].helpers({
    currentEvents: function() {

        if (!getPatient()) return;
        var result = getPatientEventsCurrent(getPatient()._id).fetch();
        console.log("currentEvents: result=", result);
        return result;
    },

    pastEvents: function() {
        if (!getPatient()) return;
        var result = getPatientEventsPast(getPatient()._id).fetch();
        return result;
    }
});

Template["biologEventsItem"].rendered = function() {
    $('.rateit').rateit();
    $('.rateit').bind(getFrowns);
};

Template["biologEventsItem"].events({
    "click .biologEventsItem": function(event, template) {
        //console.log("clicked: " + JSON.stringify(this));
        Session.set("biolog:events/event.editing", this);
        //Session.set("biologEvent.modal.open", true);
    }
});



Template["biologBioontologyEventsButton"].events({
    "click #bioontologyEventsButton": function() {
        Session.set("biolog:events/events.modal.open", false);
        Session.set("biolog:events/events.modal.open", true);
    }
});



Template["biologEventsItem"].helpers({

    frowns: function() {
        var sev = biolog.Events.getEventSeverity(this);
        return sev;
    },

    timing: function() {
        if (this.startDate && this.endDate) {
            return biolog.BiologUtil.yyyy_mm_dd(this.startDate) + " to " + yyyy_mm_dd(this.endDate);
        }
        if (this.startDate && !this.endDate) {
            return "began " + biolog.BiologUtil.yyyy_mm_dd(this.startDate);
        }
        if (!this.startDate && this.endDate) {
            return "stopped " + biolog.BiologUtil.yyyy_mm_dd(this.endDate);
        }
    }


});




Tracker.autorun(function() {
    if (Session.get("biolog:events/event.editing")) {
        //console.log("Showing modal:" + JSON.stringify(Session.get("biolog:events/event.editing")));
        $('#biologEventModal').modal({
            closable: true,
            onApprove: function() {
                updateEvent();
                /**
                 * Created by Rashid on 5/19/15.
                    Remove the event from current session and save it to the collection 
                 */
                var postFacts = Session.get("postFacts");
                if (postFacts) {
                    var modal = this;
                    var posts = _.reject(postFacts, function(element) {
                        if(element && element.objName){
                        return element.objName.toLowerCase() == $.trim($(modal).find(".header").text().toLowerCase());
                          }
                    });
                    Session.setAuth("postFacts", posts)
                }

                Session.set("biolog:events/event.editing", null);
                return true;
            },
            onDeny: function() {
                Session.set("biolog:events/event.editing", null);
                return true;
            },
            onHide: function() {
                Session.set("biolog:events/event.editing", null);
                return true;
            }
        }).modal('show');

    } else {
        //console.log("Hiding modal: " + Session.get("biolog:events/events.modal.open"));
        $('#biologEventModal').modal('hide');
    }
});


Template["biologEventModal"].rendered = function() {
    $('.rateit').rateit();
    //$('.rateit').bind(getFrowns);
};



Template["biologEventModal"].helpers({
    eventName: function() {
        var event = Session.get("biolog:events/event.editing");
        return biolog.Events.getEventName(event);
    },

    frowns: function() {
        var frowns = getFrowns();
        if (!frowns) {
            $('#eventSeverityFrowns').rateit('reset');
            return;
        }
        $('#eventSeverityFrowns').rateit('value', frowns);
        return frowns;
    },

    eventStartDate: function() {
        var event = Session.get("biolog:events/event.editing");
        if (!event) return;
        var dateStr = yyyy_mm_dd(event.startDate);
        return dateStr;
    },

    eventEndDate: function() {
        var event = Session.get("biolog:events/event.editing");
        if (!event) return;
        //return event.endDate;
        if (!event.endDate) return "";
        var dateStr = yyyy_mm_dd(event.endDate);
        return dateStr;
    },

    eventSinceBirthChecked: function() {
        var event = Session.get("biolog:events/event.editing");
        if (!event) return;
        if (event.startFlag == 1) {
            return "checked";
        }
        return "";
    },

    eventOngoingChecked: function() {
        var event = Session.get("biolog:events/event.editing");
        if (!event) return;
        if (event.endFlag == 1) {
            return "checked";
        }
        return "";
    },

    eventFrequencySelected: function(aFreqVal) {
        var event = Session.get("biolog:events/event.editing");
        if (!event) return;
        var freqVal = getEventFrequency(event);
        if (!freqVal) {
            if (aFreqVal == "1") return "selected";
            return "";
        }
        if (freqVal == aFreqVal) return "selected";
        return "";
    },

    eventFrequencyLabel: function(freqVal) {
        return eventFrequencies[freqVal];
    }

    //frowns: function() {
    //    var event = Session.get("biolog:events/event.editing");
    //    if (!event) return;
    //    var ratingVal = getEventSeverity(event);
    //    return ratingVal;
    //}
});



updateEvent = function() {
    var event = Session.get("biolog:events/event.editing");
    delete event._id;
    //console.log("\n\nSaving event: " + JSON.stringify(event));
    if (!event) return;

    var startDateStr = $("#eventStartDate").val();
    if (startDateStr) {
        var startDate = new Date(startDateStr);
        startDate.setTime(startDate.getTime() + startDate.getTimezoneOffset() * 60 * 1000);
        event.startDate = startDate;
    } else {
        event.startDate = null;
    }

    var endDateStr = $("#eventEndDate").val();
    console.log("endDateStr='" + endDateStr + "'");
    if (endDateStr) {
        var endDate = new Date(endDateStr);
        endDate.setTime(endDate.getTime() + endDate.getTimezoneOffset() * 60 * 1000);
        event.endDate = endDate;
        console.log("set endDate=" + endDate);
    } else {
        event.endDate = null;
    }
    event.endFlag = 0;
    if ($("#eventEndFlag").prop("checked")) event.endFlag = 1;

    //add frowns rating
    //setEventSeverity(event, eventFrowns.get());
    var frownsRating = $('#eventSeverityFrowns').rateit('value');
    console.log("frownsRating=" + frownsRating);
    biolog.Events.setEventSeverity(event, frownsRating);

    saveProperty(event, function(err, success) {
        if (err) {
            console.error("Unable to save event: " + err + "\n" + JSON.stringify(event));
            return;
        }
        console.log("Saved event: " + JSON.stringify(event));
    });
};
