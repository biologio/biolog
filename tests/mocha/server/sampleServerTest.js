if (!(typeof MochaWeb === 'undefined')){
    MochaWeb.testOnly(function(){
        describe("Server initialization", function(){
          it("should have a Meteor version defined", function(){
            chai.assert(Meteor.release);
          });
        });

        describe("Query bioportal", function() {
            it("should query bioportal", function() {
                var url = getOntologySearchUrl("lisin*");
                console.log("url=" + url);
                chai.assert(url.length > 10);
                HTTP.get(url,
                    {data: {ontologies: "RXNORM", suggest: "true"}},
                    function (error, result) {
                        chai.assert(!error);
                        console.log("Queried bioportal, result=" + JSON.stringify(result));
                    }
                );
            });
        });


    });
}
