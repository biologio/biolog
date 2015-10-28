   Feed = {};
    Router.route('/', {
        layoutTemplate: 'aboutusLayout',
        name: 'aboutus',
        template: 'aboutus',
        data: {

        }

    });
    Template.aboutus.rendered = function() {
        $('body').removeClass("feed pushable")
        new WOW().init();
        $('.button-collapse').sideNav();


    };
    
    Template.aboutusLayout.events({
        'click .show-feedback-form': function(e, tpl) {
            console.log(e);
            $('.feedback.modal').modal({
                 closable: true,
            onApprove: function() {
               var obj = createFeedOjbect($('.feed-item'));
                 if ($('#feedbackText').val() != '') {
            Meteor.call('addFeedback', obj, function(err, data) {
                if (!err) {
                    console.log(data);

                }

            })
        }
        else {
            $(".feeback-label").addClass("error");
            return false;
        }
                return true;
            },
            onDeny: function() {
               $(".feeback-label").removeClass("error");
                
                return true;
            },
            onHide: function() {
                $('.form.feedback').form('clear')
                $(".feeback-label").removeClass("error");
                return true;
            }
            })

            .modal('setting', 'transition', 'vertical flip')
                .modal('show');
                e.preventDefault();
        }
    });

    function createFeedOjbect(obj){
    var object = {};
obj.each(function(index, element){
    if(element.type === "checkbox" && element.checked){
        object.type = 'bug'
        return;
    }
    else if(element.type === "textarea"){
        object.type = 'feedback';
        object.content = element.value;
        return;
    }
    console.log(index, element)
    
});
return object;
}

Feed.createFeedOjbect = createFeedOjbect;