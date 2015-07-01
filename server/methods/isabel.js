/**
 * Created by dd on 3/11/15.
 */


Meteor.methods({
    isabel: function(dob, sex, pregnant, region, diagnoses) {
        this.unblock();
        var isabelConfig = getConfig("isabel");

        var isabelId = isabelConfig.isabelId;
        var isabelPassword = isabelConfig.isabelPassword;
        var url = "http://www.isabelhealthcare.com/private/emr_diagnosis.jsp?" +
            "searchType=0&specialties=28&action=login&id=" + isabelId + "&password=" + isabelPassword +
            "&dob=" + dob + "&sex=" + sex + "&pregnant=" + pregnant + "&region=" + region +
            "&querytext=" + diagnoses + "&suggest=Suggest+Differential+Diagnosis&web_service=json" +
            "&flag=sortbyRW_advanced&callback=isabel";
        console.log("Isabel URL: " + url);

        return HTTP.get(url, {timeout: 20000});
    }
});