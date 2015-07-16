


Medication = Fact.extend({
    name: 'Medication',
    fields: {},
    methods: {
        getMedName: function() {
            return this.objName;
        },

        getMedFrequency: function() {
            //return getValuePath(this, "data.medication/frequency.text");
            return this.data["medication/frequency"].text;
        },

        setMedFrequency: function(frequency) {
            if (! frequency || !isNumber(frequency)) return;
            var frequencyNum = Number(frequency);
            var frequencyFact = {
                num: frequencyNum
            };
            //setValuePath(medFact, "data['medication/frequency']", frequencyFact);
            setValuePath(this, "data.medication/frequency", frequencyFact);
        },

        getMedIngredients: function() {
            var ingredients = getValuePath(this, "data.medication/ingredient");
            var ingredientsArr = [];
            for (var cui in ingredients) {
                var ingredient = ingredients[cui];
                ingredientsArr.push(ingredient);
            }
            return ingredientsArr;
        },


        addMedIngredient: function(ingredient) {
            if (! ingredient) return "no ingredient specified";
            var cui = ingredient.cui[0];
            //if (! cui) cui = ingredient.cui[0];
            if (! cui) return "ingredient lacks a cui";
            var prefLabel = ingredient.prefLabel;
            if (!prefLabel) return "ingredient lacks a prefLabel";
            prefLabel = prefLabel.toLowerCase();
            var signature = "data.medication/ingredient." + cui;

            var ingrObj = {
                obj: cui,
                text: prefLabel
            };
            setValuePath(this, signature, ingrObj);
        },

        addMedClass: function(clazz) {
            var cui = clazz.cui[0];
            if (! cui) return "med class lacks a cui";
            var prefLabel = clazz.prefLabel;
            if (!prefLabel) return "med class lacks a prefLabel";
            var signature = "data.medication/class." + cui;

            var obj = {
                obj: cui,
                text: prefLabel
            };
            setValuePath(medFact, signature, obj);
        },

        getIngredientStrength: function(ingredientCui) {
            var strength;
            try {
                strength = this.data["medication/ingredient"][ingredientCui].num;
            } catch (unable) {
                //return null
            }
            return strength;
        },

        setIngredientStrength: function(ingredientCui, strength) {
            if (! strength || !isNumber(strength)) return;
            var ingredient;
            try {
                ingredient = this.data["medication/ingredient"][ingredientCui];
            } catch (unable) {
                //return null
            }
            if (!ingredient) return;
            var strengthNum = Number(strength);
            ingredient.num = strengthNum;
        }
    }
});
