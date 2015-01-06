// (c) 2014 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global connexion, deviceList, refreshButton */
/* global detailPage, buttonState, ledButton, closeButton */
/* global rfduino  */
/* jshint browser: true , devel: true*/
'use strict';

var arrayBufferToInt = function (ab) {
    var a = new Uint8Array(ab);
    return a[0];
};

/*--------------------------------------------*/
/*-------------Connexion BT-------------------*/
/*--------------------------------------------*/

var app = {
    initialize: function() {
        this.bindEvents();
        detailPage.hidden = true;
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        ledButton.addEventListener('touchstart', this.sendData, false);
        ledButton.addEventListener('touchend', this.sendData, false);
        closeButton.addEventListener('touchstart', this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
    },
    onDeviceReady: function() {
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
        deviceList.innerHTML = ''; // empties the list
        rfduino.discover(5, app.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function(device) {
        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                'Advertising: ' + device.advertising + '<br/>' +
                device.uuid;

        listItem.setAttribute('uuid', device.uuid);
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
    },
    connect: function(e) {
        var uuid = e.target.getAttribute('uuid'),
            onConnect = function() {
                rfduino.onData(app.onData, app.onError);
                app.showDetailPage();
            };

        rfduino.connect(uuid, onConnect, app.onError);
    },
    disconnect: function() {
        rfduino.disconnect(app.showConnexion, app.onError);
    },
    showConnexion: function() {
        connexion.hidden = false;
        detailPage.hidden = true;
    },
    showDetailPage: function() {
        connexion.hidden = true;
        detailPage.hidden = false;
    },
    onError: function(reason) {
        alert(reason); // real apps should use notification.alert
    }
};



/*--------------------------------------------*/
/*-------------Réception SMS -----------------*/
/*--------------------------------------------*/

var smsplugin = cordova.require("info.asankan.phonegap.smsplugin.smsplugin");

smsplugin.isSupported(successCallback(result),failureCallback(error));

smsplugin.startReception(successCallback(result),failureCallback(error));

/*--------------------------------------------*/
/*-------------Réception Appels --------------*/
/*--------------------------------------------*/
if $('#checkbox-2').is(':checked')
{
    PhoneCallTrap.onCall(function(state) {
    console.log("CHANGE STATE: " + state);

    switch (state) {
        case "RINGING":
            console.log("Phone is ringing");
            rfduino.write("appel")
            break;
        case "OFFHOOK":
            console.log("Phone is off-hook");
            break;

        case "IDLE":
            console.log("Phone is idle");
            break;
    }
    });
}

/*--------------------------------------------*/
/*-------------mét --------------*/
/*--------------------------------------------*/

