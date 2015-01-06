cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.megster.cordova.rfduino/www/rfduino.js",
        "id": "com.megster.cordova.rfduino.rfduino",
        "clobbers": [
            "rfduino"
        ]
    },
    {
        "file": "plugins/info.asankan.phonegap.smsplugin/www/smsplugin.js",
        "id": "info.asankan.phonegap.smsplugin.smsplugin",
        "clobbers": [
            "smsplugin"
        ]
    },
    {
        "file": "plugins/io.gvox.plugin.phonecalltrap/www/PhoneCallTrap.js",
        "id": "io.gvox.plugin.phonecalltrap.PhoneCallTrap",
        "clobbers": [
            "window.PhoneCallTrap"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.megster.cordova.rfduino": "0.1.2",
    "info.asankan.phonegap.smsplugin": "0.2.0",
    "io.gvox.plugin.phonecalltrap": "0.1.0"
}
// BOTTOM OF METADATA
});