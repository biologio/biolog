getConfig = function(config) {
    return YAML.eval(Assets.getText("config/" + config + ".yml"));
    //console.log("getConfig(): parsing: " + JSON.stringify(config));
    //return JSON.parse(config);
};