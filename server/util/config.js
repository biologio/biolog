getConfig = function(config) {
    var config = YAML.eval(Assets.getText("config/" + config + ".yml"));
    return JSON.parse(config);
};