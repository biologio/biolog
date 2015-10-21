Template.biologFeedbackForm.events({
	'click .cancel': function (e, tpl) {
			console.log(e)
		 $('.feedback.modal').modal({
		 	onHide:function(e){
		 		console.log(e)
		 		$(".feeback-label").removeClass("error");
		 	}
		 })
                .modal('hide');
                e.preventDefault();
                
	},
	'click .button.submit': function (e, tpl) {
		
			console.log(e)
			var obj = createFeedOjbect(tpl.findAll('.feed-item'))
               // Meteor.call('addFeedback',)
               e.preventDefault();
               $('.feedback.modal')
                .modal('hide');

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
Template.biologFeedbackForm.rendered = function () {

$('.ui.form')
  .form({
    fields: {
      feedbackText: {
        identifier: 'feedbackText',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your feedback'
          }
        ]
      }
  }
  });

	console.log("loaded")
	$('.button.submit').click(function(e){
		console.log(e)
		var obj = createFeedOjbect($('.feed-item'))
               // Meteor.call('addFeedback',)
               e.preventDefault();
               if($('#feedbackText').val() != ''){
               	 Meteor.call('callMe', obj, function(err, data){
                 	if(!err){
                 		console.log(data);
                 	}

                 	$('.feedback.modal').modal({
                 		onHide:function(e){
                 			console.log(e)
                 				$(".feeback-label").removeClass("error");
                 		}
                 	})
                .modal('hide');
                 })
               }
               else{
               	$(".feeback-label").addClass("error");
               	return false;
               }
                
               
	})

};
