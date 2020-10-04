var bb = require('./app/bigbrothermanager.js');
var BigBrother = new bb.BigBrotherManager();





/*  Testing code for user.js and textchannel.js
var us = require('./app/user.js');
var txt = require('./app/textchannel.js');

var Usr1 = new us.User("server1", "TestMan", "1234", "Some time yesteray");
var TxtChnnl1 = new txt.TextChannel("server1", "TestChannel", "1234", "some time yesterday");

Usr1.recordMessage({message: "Sup", channel: "Some channel", timePosted: "some time yesterday"});
Usr1.recordMessage({message: "sup again", channel: "Some channel", timePosted: "some time yesterday"});
TxtChnnl1.recordMessage({message: "Sup", channel: "Some user", timePosted: "some time yesterday"});
TxtChnnl1.recordMessage({message: "sup again", channel: "Some user", timePosted: "some time yesterday"});

Usr1.serializeMessages();
Usr1.serializeMessages();
TxtChnnl1.serializeMessages();
TxtChnnl1.serializeMessages();

Usr1.destructor();
TxtChnnl1.destructor();
*/