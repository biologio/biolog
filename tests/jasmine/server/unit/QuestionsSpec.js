

describe('Questions - Create', function() {
    
    
    
    it("Create Question", function() {
        spyOn(Questions, "insert").and.callFake(function(doc, callback) {
            // simulate return of id = "1";
            callback(null, "1");
        });
        var doc = {
            question: "Your Blood presure level", //the text of the question
            abbrev: "BPLVL", //the text of the question
            description: "Blood presure High or Low", //lower case of the text value that is mapped
            measure: "HIGH", //the type of measurement,
            flags: "sugar", //the flags that trigger this question
            valid: 0, //the validity score of the data
            priority: 5, //higher priority generally get asked earlier
            created: new Date(),
            updated: new Date(),
            // deleted: { type: Date, optional: true },
            creator: this.userId,
            updater: this.userId,
            deleter: this.userId
            //used: { type: Date, optional: true }, //date last used
            //useCount: { type: Number, index: -1, defaultValue: 0 } //number of times this mapping has been used
        }
        Questions.insert(doc, function(error, result) {
            // console.log(result);
        });
        
        // use last call to access arguments
        expect(Questions.insert).toHaveBeenCalled();
        
        
        
        
    });
    it("Read Question", function() {
        spyOn(Questions, "find");
        
        Questions.find({});
        
        // use last call to access arguments
        expect(Questions.find).toHaveBeenCalled();
    });
    it("Update Question", function() {
        spyOn(Questions, "update");
        
        Questions.update({});
        
        // use last call to access arguments
        expect(Questions.update).toHaveBeenCalled();
    });
    it("Delete Question", function() {
        spyOn(Questions, "remove");
        
        Questions.remove({});
        
        // use last call to access arguments
        expect(Questions.remove).toHaveBeenCalled();
    });
    
    
});
