Router.configure({
    layoutTemplate: 'basicLayout'
});



Router.route('/landing',function() {
    this.layout('landingLayout');
    this.render('landing',{
    	 data: {
    	 	
          list :[{
               description: "Peter is an engineer, who is data-driven. He likens his body to machinery and wants to monitor its health using modern technology. He is a self-tracker, but yearns for something that can pull his health information together into a meaningful broader picture. He is also a systems-thinker, and believes that medicine, like other complex disciplines, should be driven by discipline and checklists.",
                name: "Peter",
                image:"/images/peter.png"
            },
            {
                description: "Isabella  Drives her own health. She marches to her own beat and has her own definition of what health care is. She sees an herbalist, functional medicine doctor, and has a family doctor as well. She currently eats raw 6 days per week.She thinks the traditional medical establishment is biased and profit driven. She wants to try an alternative means of keeping healthy. She starts entering her past medical history into biolog.io and is instantly hooked. It is simple to add stuff and after each addition, she sees new information about her combination of conditions.",
                name: "Isabella",
                image:"/images/isabella.png"
            },
            {
            	name:"Dianne",
            	description:"Dianne is 44 and the primary caregiver for her father, who is 84. He has a number of chronic health problems including congestive heart failure. She has not been happy with the coordination of his care, and she believes he is getting passive care. Most changes to his regimens are initiated by her pointed questions to his doctors. She wants to take better control and double check what the doctors are recommending against best practices. She enters his information into biolog.io, and keeps his record up to date as things unfold. Biolog.io repeatedly flags drug combinations that his is on. Over time, doctors agree and remove unneeded medications from her father’s list.",
            	image:"/images/dianne.png"
            },{
            	name:"Asha",
            	description:"Asha is a single mother of 2. She does not have a car and lives in an impoverished area. Her 3 year-old daughter has a fever and a rash, and she would like to know what conditions she needs to be concerned about including malaria and ebola. She enters her info and is prompted with questions about the fever and the diarrhea. She sees a list of possibilities that includes malaria, and a recommendation to take her daughter to the nearest clinic, 20km away. She arranges for transportation.",
            	image:"/images/asha.png"
            }].map(function(item, index) {
      item.rank = index;
      return item;
          
        })
    }
    });
   
        // yieldTemplates: {
        //   'myAsideTemplate': {to: 'aside'},
        //   'myFooter': {to: 'footer'}
        //   }
    
});
