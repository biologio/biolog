/**
 * Created by dd on 1/15/15.
 */

RuleTool = function(rule) {
    this.rule = null;
    if (rule) {
        this.rule = rule;
    } else {
        this.rule = {};
    }
//    if (! this.rule.blocks) {
//        this.rule.blocks = [];
//    }
    if (!this.rule.block) {
        this.rule.block = {};
    }
};

RuleTool.prototype.getInitializedRule = function() {
    this.initializeIfQuery();
    return this.rule;
};

RuleTool.prototype.initializeIfQuery = function() {
    this.rule.ifQuery = {
        filtered : {
            query: { match_all: {} },
            filter: {
                nested: {
                    path: "data",
                    filter: {
                        bool: {
                            must: [],//here we have match, path_match, range, and other queries
                            must_not: []//here we have same types of queries, that have been NEGATED
                        }
                    }
                }
            }
        }
    };
};

/**
 * The clause object has these properties:
 * * pred - the predicate
 * * objs - an array of objects.  These are ORed together
 * * negated - if true, this clause will be added to the must_not query
 * @param clause
 */
//RuleTool.prototype.addClause = function(clause) {
////    console.log("RuleTool.addClause()");
//    this.rule.clauses.push(clause);
//};


//TODO fix this for blocks
RuleTool.prototype.buildIfQuery = function() {
    this.initializeIfQuery();
    var clauseQueryObj = null;
    //loop thru each clause
    for (var ci in this.rule.clauses) {
        //for this clause, build a clauseQueryObj
        clauseQueryObj = {};
        clauseQueryObj["bool"] = {};
        clauseQueryObj["bool"].should = [];

        var clause = this.rule.clauses[ci];
        console.log("Clause #" + ci + ": objs=" + JSON.stringify(clause.objs));
        if (! clause.pred || !clause.objs) continue;
        console.log("SHOW OBJECTS");
        //build a line for each object
        for (var oi in clause.objs) {
            var obj = clause.objs[oi];
            var qry = {};
            if (obj._id) {
                var path = "data";
                path += '["' + clause.pred._id + '"]';
                path += '["' + obj._id + '"]';
                console.log("Object #" + oi + ": " + path);
                if (! obj.val) {
                    qry.path_match = path;
                }
                //TODO handle when obj has a value, operators, etc.
            }
            clauseQueryObj["bool"].should.push(qry);
        }//next obj in this clause

        //clauseQueryObj completed.  put it in the right place
        this.getRuleClauses(clause.negated).push(clauseQueryObj);

    }//next clause
};

//TODO fix this for blocks
//TODO make this private function
RuleTool.prototype.getRuleClauses = function(negated) {
    var clauses;
    var self = this;
    if (!negated) {
        clauses = self.rule.ifQuery.filtered.filter.nested.filter.bool.must;
    } else {
        clauses = self.rule.ifQuery.filtered.filter.nested.filter.bool.must_not;
    }
    return clauses;
};

RuleTool.prototype.prepareRule = function() {
    this.buildIfQuery();
    return this.rule;
};

RuleTool.prototype.saveRule = function () {
    //console.log("saving rule: " + JSON.stringify(rule, null, "  "));
    Meteor.call("saveRule", this.rule, function (response) {
        if (response) {
            if (response.success) {
                console.log("Successfully saved rule.")
            } else {
                console.log("Error saving rule: " + response.error);
            }
        }
    });
};