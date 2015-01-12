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



$(document).on( "pagecreate", function() {

        
    var nbrNotif = 1; //compte le nbr de notifs
    var NouvelleNotif = []; //NouvelleNotif est un array

    /*Chaque case de NouvelleNotif[] est un objet Notification avec un nom, un type etc.*/
    function Notification () {
        this.nom = "";
        this.typeNotif = "";
        this.messageTactile = "";
        this.actif = 0;
    }

    /*création d'une nouvelle notif*/    
    function createNotif () {
        var i = nbrNotif; //i : variable locale
        nbrNotif++; //on incrémente nbrNotif (variable globale)
        NouvelleNotif[i] = new Notification; //on crée une instance de l'objet Notification à la ième place de l'array NouvelleNotif
        
        /*On change les valeurs de l'array par celles rentrées par l'user*/
        NouvelleNotif[i].nom = document.getElementById("nomNotif").value;
        NouvelleNotif[i].typeNotif = document.getElementById("selectType").value;
        NouvelleNotif[i].messageTactile = document.getElementById("selectMessageTactile").value;

    
    var newNotif = document.createElement('li'); //ajout de la notif créée en html en bout de liste (sur les 2 listes : modifier et avancé)
        newNotif.innerHTML =    '<div class="ui-field-contain">' +
                                    '<label for "activerNotif2">' + NouvelleNotif[i].nom + '</label>' +
                                    '<div class="activerNotif2" align="right">' +
                                      '<select name="slider+ nbrNotif +"  id="slider'+ nbrNotif +'"' + 'data-role="slider" data-mini="true">' +
                                      '<option value="off">Off</option>' +
                                      '<option value="on">On</option>' +
                                      '</select>' +
                                    '</div>' +
                                '</div>'

    var newNotifModifier = document.createElement('li');
        newNotifModifier.innerHTML =    '<a href="test">' + '<h3 class="topic">' +NouvelleNotif[i].nom + '</h3>'+ '</a>' +
                                '<a href="#" class="delete">Delete</a>'
        $("#listeNotif").append(newNotif).enhanceWithin();   //append la nouvelle notif et applique le theme au boutton
        $("#listeNotifModifier").append(newNotifModifier).enhanceWithin();

        $("#listeNotif li:last-child").attr("id","notifNum-"+i); // ajoute l'id notifNum- 'i' dans le <li>
        $("#listeNotifModifier li:last-child").attr("id","notifModNum-"+i); // ajoute l'id notifModNum- 'i' dans le <li>

        $("#listeNotif").listview("refresh"); // applique le theme de la liste
        $("#listeNotifModifier").listview("refresh");

}


    NouvelleNotif[0] = new Notification;
    NouvelleNotif[0].nom = 'J.Fedjaev';
    NouvelleNotif[0].typeNotif = 'appels';
    NouvelleNotif[0].messageTactile = 'messageTactile1';
    NouvelleNotif[0].actif = 0; 

    /*Losqu'on clique sur '+' puis sur 'enregistrer alors création*/
    $(document).on('click',"#createNotif",function(){
       // $(".nomNotif").textinput("option","disabled",true);
        //$(".nomNotif").textinput("refresh");

        $(document).off('click',"#EnregistrerNotif").on('click',"#EnregistrerNotif",function(){
            createNotif();
        });
    });
    

    $(".activerNotif2").on( "slidecreate",function (event) {
        console.log(this);
        //var value = Number(event.target.value);
        //NouvelleNotif[].actif = value;
    });

    $(".activerNotif").on( "slidestop",function (event) {
        console.log(this);
            var value = Number(event.target.value);
        console.log(value);
        //NouvelleNotif[].actif = value;
    });





    /*--------------------------------------------------------------------------------*/
    /* Toute la partie suivante sert à supprimer les items des listes (en swipant !!!)*/
    /*--------------------------------------------------------------------------------*/
    
    $( document ).on( "swipeleft swiperight", "#listeNotifModifier li", function( event ) {
        var listitem = $( this ),
            // These are the classnames used for the CSS transition
            dir = event.type === "swipeleft" ? "left" : "right",
            // Check if the browser supports the transform (3D) CSS transition
            transition = $.support.cssTransform3d ? dir : false;
            confirmAndDelete( listitem, transition );
    });

    // If it's not a touch device...
    if ( ! $.mobile.support.touch ) {
        // Remove the class that is used to hide the delete button on touch devices
       $( "#listeNotifModifier" ).removeClass( "touch" );
        // Click delete split-button to remove list item
        $( ".delete" ).on( "click", function() {
           var listitem = $( this ).parent( "li" );
            confirmAndDelete( listitem );
        });
    }

    function confirmAndDelete( listitem, transition ) {
        // Highlight the list item that will be removed
        listitem.children( ".ui-btn" ).addClass( "ui-btn-active" );
        // Inject topic in confirmation popup after removing any previous injected topics
        $( "#confirm .topic" ).remove();
        listitem.find( ".topic" ).clone().insertAfter( "#question" );
        // Show the confirmation popup
        $( "#confirm" ).popup( "open" );
        // Proceed when the user confirms
        $( "#confirm #yes" ).on( "click", function() {
        
        var id = listitem.attr("id"); //on récupère l'id de la notif
        var num = id.substring(id.indexOf('-')+1); //on récupère le numéro de la notif
        $("#notifNum-"+num).remove(); // supprime la notif dans l'écran avancé
        
        
            // Remove with a transition
            if ( transition ) {
                listitem
                    // Add the class for the transition direction
                    .addClass( transition )
                    // When the transition is done...
                    .on( "webkitTransitionEnd transitionend otransitionend", function() {
                        // ...the list item will be removed
                        listitem.remove();
                        // ...the list will be refreshed and the temporary class for border styling removed
                        $( "#listeNotifModifier" ).listview( "refresh" ).find( ".border-bottom" ).removeClass( "border-bottom" );
                    })
                    // During the transition the previous button gets bottom border
                    .prev( "li" ).children( "a" ).addClass( "border-bottom" )
                    // Remove the highlight
                    .end().end().children( ".ui-btn" ).removeClass( "ui-btn-active" );
            }
            // If it's not a touch device or the CSS transition isn't supported just remove the list item and refresh the list
            else {
                listitem.remove();
                $( "#listeNotifModifier" ).listview( "refresh" );
            }
            $("#listeNotif").listview("refresh");   
        });
        // Remove active state and unbind when the cancel button is clicked
        $( "#confirm #cancel" ).on( "click", function() {
            listitem.removeClass( "ui-btn-active" );
            $( "#confirm #yes" ).off();
        });
    }

    /*--------------------------------------------------------------------*/
});


/*--------------------------------------------*/
/*-------------Connexion BT-------------------*/
/*--------------------------------------------*/

var app = {
    initialize: function() {
        this.bindEvents();
        connecte.hidden = true;
        $("#connexion").hide();
    },
    bindEvents: function() {
        $(document).addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        closeButton.addEventListener('touchstart', this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
        buttonTest.addEventListener('touchstart',this.sendData, false);
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
        $("#deviceList").append(listItem).listview('refreshed');
    },
    connect: function(e) {
        var uuid = e.target.getAttribute('uuid'),
            onConnect = function() {
                rfduino.onData(app.onData, app.onError);
                app.showDetailPage();
            };

        rfduino.connect(uuid, onConnect, app.onError);
    },
    sendData: function(event) { // send data to rfduino
        var data = new Uint8Array(1);
        data[0] = event.type === 'touchstart' ? 0x1 : 0x0;

        rfduino.write(data.buffer); // ignoring callbacks
    },
    disconnect: function() {
        rfduino.disconnect(app.showConnexion, app.onError);
    },
    showConnexion: function() {
        $("#connexion").show();
        $("#connecte").hide();
    },
    showDetailPage: function() {
        $("#connexion").hide();
        $("#connecte").show();
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
        case "RINGING": // tééphone sonne
            console.log("Phone is ringing");
            rfduino.write("appel")
            break;
        case "OFFHOOK": // décroché
            console.log("Phone is off-hook");
            rfduino.write("telDecroche")
            break;

        case "IDLE": // Mode veille
            console.log("Phone is idle");
            break;
    }
    });
}

/*--------------------------------------------*/
/*-------------mét --------------*/
/*--------------------------------------------*/

