

Condition = Fact.extend({
    name: 'Condition',
    fields: {},
    methods: {
        getConditionName: function() {
            return this.objName;
        },



        getConditionSeverity: function() {
            return this.num;
        },



        setConditionSeverity: function(severity) {
            if (!isNumber(severity)) return;
            var severityNum = Number(severity);
            if (severityNum < 0 || severityNum > 10) return;
            this.num = severityNum;
        },



        addConditionClass: function(clazz) {
            if (!this || this == null) return;
            if (!this.data) this.data = {};
            console.log("Adding condition class: " + JSON.stringify(clazz));
            var cuiVal = clazz.cui;
            var cuis = [cuiVal];
            if (Array.isArray(cuiVal)) {
                cuis = cuiVal;
            }

            for (var cuiIdx in cuis) {
                var cui = cuis[cuiIdx];

                if (! cui) continue;
                var prefLabel = clazz.prefLabel;
                if (!prefLabel) prefLabel = cui;

                var signature = "condition/class." + cui;

                var obj = {
                    obj: cui,
                    text: prefLabel
                };
                setValuePath(this.data, signature, obj);
            }
        }
    }
});
