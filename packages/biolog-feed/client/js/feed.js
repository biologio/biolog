// Router.onBeforeAction(function () {

//   if (!Meteor.userId()) {
//     // if the user is not logged in, render the Login template
// // 

//         Router.go('/sign-in');
//         this.next();
//     }
//    else {
//     // otherwise don't hold up the rest of hooks or our route/action function
//     // from running
//     this.next();
//   }
// });

// Router.route('/feed', function() {
//     this.render('feed');
// });
// var arr = [];
Template.feed.helpers({
   
    postLists: function() {
        return {
            facts: Facts.find({
                pred: "patient/post"
            }, {
                sort: {
                    created: -1
                }
            }).map(function(fact) {
                //fact.isEditMode = Template.instance().isEditMode.get() ? 'isEditMode' : '';
                fact.commentCount = Facts.find({
                    pred: "post/comment",
                    postId: fact._id
                }).count()
                fact.isOwner = Meteor.userId() == fact.creator ? true : false;
                return fact;
            }),
            name: Meteor.user().profile.firstName + ' ' + Meteor.user().profile.lastName,


        }
    },
    date: function() {
        var m = moment(this.created);
        if (m.isValid()) return m.fromNow();
    },
    getPostComments: function(id) {
        console.log(id);
        return Facts.find({
            pred: "post/comment",
            postId: id
        }, {
            sort: {
                created: -1
            }
        }).map(function(post) {
            console.log(post);
            var owner = Meteor.users.findOne({
                _id: post.creator
            });
            console.log(owner)
            post.owner = owner.profile.firstName + ' ' + owner.profile.lastName;
            console.log(post);
            return post;
        });


    }
});
Template.feed.rendered = function() {


    this.isEditMode = new ReactiveVar(false);

    console.log('loaded')
    $('body').addClass('feed');
    $("#post").atwho({
        at: "@",
        displayTpl: '<li data-sign="${at}" data-name="${data}">${name} <small>${desc}</small></li>',

        callbacks: {
            /*
             It function is given, At.js will invoke it if local filter can not find any data
             @param query [String] matched query
             @param callback [Function] callback to render page.
            */
            remoteFilter: function(query, callback) {
                $.getJSON('http://data.bioontology.org/search?ontologies=MEDLINEPLUS,ICD10CM&suggest=t…play_context=false&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d', {
                    q: query
                }, function(data) {
                    console.log(data);
                    if (data.collection.length > 0) {


                        conditions = $.map(data.collection, function(value, i) {
                            return {
                                'id': i,
                                'at': "@",
                                'name': data.collection[i].prefLabel,
                                'data': data.collection[i].prefLabel.replace(/\s+/g, '-'),
                                'desc': data.collection[i].definition ? data.collection[i].definition[0] : "no description"
                            };
                        });
                        console.log(conditions)
                        callback(conditions)
                        return;
                    }

                    callback(null);
                });
            }
        }
    }).atwho({
        at: "#",

        displayTpl: '<li data-sign="${at}" data-name="${data}">${name} <small>${desc}</small></li>',

        callbacks: {
            /*
             It function is given, At.js will invoke it if local filter can not find any data
             @param query [String] matched query
             @param callback [Function] callback to render page.
            */
            remoteFilter: function(query, callback) {
                $.getJSON('http://bioportal.smart-bio.org:8080/search?ontologies=RXNORM&suggest=true&s…play_context=false&apikey=95d31cce-3247-4186-ae95-97c61884c50a', {
                    q: query
                }, function(data) {
                    console.log(data);
                    if (data.collection.length > 0) {


                        conditions = $.map(data.collection, function(value, i) {
                            return {
                                'id': i,
                                'at': "#",
                                'name': data.collection[i].prefLabel,
                                'data': data.collection[i].prefLabel.replace(/\s+/g, '-'),
                                'desc': data.collection[i].definition ? data.collection[i].definition[0] : "no description"
                            };
                        });
                        console.log(conditions)
                        callback(conditions)
                        return;
                    }

                    callback(null);
                });
            }
        }

    });

    $("#post").on("matched.atwho", function(event, flag, query) {
        //console.log(event, "matched " + flag + " and the result is " + query);
    });
    $("#post").on("inserted.atwho", function(event, li, browser_event) {
        //  console.log(event, "item " + li + " and browser event " + browser_event);
        var data = li.text();
        arr.push(data);
        console.log($("#post").val());
        text = document.createTextNode(data);
        link = document.createElement("a");
        link.appendChild(text);
        //document.body.appendChild(link);

    });


};
Template.feed.events({
    'click .publish': function(e, tpl) {
        e.preventDefault();
        var post = tpl.find('#post');
        if (post.value) {
            var postFact = {
                subj: getPatient()._id,
                pred: "patient/post",
                text: post.value,
                valid: 1,
                creator: Meteor.userId()
            }
            saveFact(postFact, function(err, data) {
                if (!err) {
                    post.value = '';
                    console.log(data);
                }
            })

        }
    },
    'click a.comment': function(e, tpl) {
        console.log(this);
        $(e.target).parents('.event').find('.input').toggleClass('hide');
        //this.comment = !this.comment;
        // Facts.update({
        //     "_id":this._id
        // }, {
        //     "comment": !this.comment
        // }, function(err, data) {
        //     if (!err) console.log(data);
        // });
        e.preventDefault();
    },
    'keypress .input input': function(e, tpl) {
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode == '13') {

            if (e.target.value) {
                var postFact = {
                    subj: getPatient()._id,
                    pred: "post/comment",
                    text: e.target.value,
                    valid: 1,
                    creator: Meteor.userId(),
                    postId: this._id
                }
                saveFact(postFact, function(err, data) {
                    if (!err) {
                        e.target.value = '';
                        console.log(data);
                    }
                })

            }
        }
    },
    'click .post-edit': function(e, tpl) {
        // tpl.isEditMode.set(true);
        var actionButton = $(e.target);
        if (actionButton.hasClass("write")) {
            actionButton.next('.text').addClass('hide');
            actionButton.prev('.section-post-edit').removeClass("hide");
            actionButton.addClass("close").removeClass('write');
            $(".post-input").atwho({
                at: "@",
                displayTpl: '<li data-sign="${at}" data-name="${data}">${name} <small>${desc}</small></li>',

                callbacks: {
                    /*
                     It function is given, At.js will invoke it if local filter can not find any data
                     @param query [String] matched query
                     @param callback [Function] callback to render page.
                    */
                    remoteFilter: function(query, callback) {
                        $.getJSON('http://data.bioontology.org/search?ontologies=MEDLINEPLUS,ICD10CM&suggest=t…play_context=false&apikey=89b05cf1-2e81-48f6-baad-58236f6af05d', {
                            q: query
                        }, function(data) {
                            console.log(data);
                            if (data.collection.length > 0) {


                                conditions = $.map(data.collection, function(value, i) {
                                    return {
                                        'id': i,
                                        'at': "@",
                                        'name': data.collection[i].prefLabel,
                                        'data': data.collection[i].prefLabel.replace(/\s+/g, '-'),
                                        'desc': data.collection[i].definition ? data.collection[i].definition[0] : "no description"
                                    };
                                });
                                console.log(conditions)
                                callback(conditions)
                                return;
                            }

                            callback(null);
                        });
                    }
                }
            })
            return;
        } else if (actionButton.hasClass("close")) {
            actionButton.next('.text').removeClass('hide');
            actionButton.prev('.section-post-edit').addClass("hide");
            actionButton.addClass("write").removeClass('close');
            return;
        }

        console.log(this)

        // Facts.update({_id:this._id}, {isEditMode: true}, function(err, data){
        //     if(err){
        //         console.log(err);
        //     }
        //});
    },
    'click button.post-update': function(e, tpl) {


        // removeLocalProps(this)
        this.text = $(e.target).parent('div').siblings('.textarea').val();
        console.log(this);
        Facts.update({
            _id: this._id
        }, {
            $set: {
                text: this.text
            }
        }, function(err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log(data);
                var actionButton = $('.post-edit');
                actionButton.next('.text').removeClass('hide');
                actionButton.prev('.section-post-edit').addClass("hide");
                actionButton.addClass("write").removeClass('close');
            }
        });

    }

});
UI.registerHelper("momentNow", function(date) {
    var m = moment(this.created);
    if (m.isValid()) return m.fromNow();
})



// Template.comment.helpers({
//     getPostComments: function(id) {
//         console.log(id);
//         return Facts.find({
//             pred: "post/comment",
//             postId: id
//         }, sort: {
//             created: -1
//         });
//     }
// });

function removeLocalProps(obj){
    delete obj.commentCount;
        delete obj.isOwner;
        return obj
}