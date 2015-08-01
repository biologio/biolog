

Patient = Entity.extend({
    name: 'Patient',
    fields: {},
    methods: {


        getPatientDob: function() {
            var dobObj = getValuePath(this, "data.id/dob");
            if (!dobObj) return;
            return dobObj.startDate;
        },

        setPatientDob: function(dob) {
            var fact = {
                subj: this._id,
                pred: "id/dob",
                startDate: dob,
                startFlag: 0,
                endFlag: 1
            };
            setValuePath(this, "data.id/dob", fact);
        },
        
        getPatientSex: function() {
            var obj = getValuePath(this, "data.id/sex");
            if (!obj) return;
            return obj.text;
        },
        
        setPatientSex: function(sex) {
            var fact = {
                subj: this._id,
                pred: "id/sex",
                text: sex,
                startFlag: 0,
                endFlag: 1
            };
            setValuePath(this, "data.id/sex", fact);
        },
        
        getPatientNickname: function() {
            if (!this) return;
            var obj = getValuePath(this, "data.id/nickname");
            if (!obj) return;
            return obj.text;
        },
        
        setPatientNickname: function(nickname) {
            var fact = {
                subj: this._id,
                pred: "id/nickname",
                text: nickname,
                startFlag: 0,
                endFlag: 1
            };
            setValuePath(this, "data.id/nickname", fact);
        },
        
        
        getPatientCountry: function() {
            var obj = getValuePath("data.geo/country");
            if (!obj) return;
            return obj.text;
        },
        
        setPatientCountry: function(val) {
            var fact = {
                subj: this._id,
                pred: "geo/country",
                text: val,
                startFlag: 0,
                endFlag: 1
            };
            setValuePath("data.geo/country", fact);
        },
        
        getPatientZip: function() {
            var obj = getValuePath("data.geo/zip");
            if (!obj) return;
            return obj.text;
        },
        
        setPatientZip: function(val) {
            var fact = {
                subj: this._id,
                pred: "geo/zip",
                text: val,
                startFlag: 0,
                endFlag: 1
            };
            setValuePath(this, "data.geo/zip", fact);
        }
    }
});