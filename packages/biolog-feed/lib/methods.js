Meteor.methods({
	addFeedback:function( obj){
			console.log(obj)
			if(Meteor.user()){
				obj.creator = Meteor.userId()
			}
			else{
				obj.creator = "guest"
			}
			var id = Feedback.insert(obj);
			console.log(id)
	}
})