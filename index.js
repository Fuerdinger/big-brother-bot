var bb = require('./app/bigbrothermanager.js');
var BigBrother = new bb.BigBrotherManager();

//const {UI} = require("./app/ui.js");

//var myUI = new UI();


/* Testing code for ui.js/search.js through server.js
var srv = require('./app/server.js');

var Srv1 = new srv.Server("TestServer", "1", 1);

Srv1.addTextChannelToList("channel1", "2", 2);
Srv1.addUserToList("user#1234", "3", 3);

//standard message passed to cache
Srv1.receiveMessage("hello!!", "channel1", "user#1234", "1:34"); 

//searching method passed to ui

*/

/*  Testing code for server.js
var srv = require('./app/server.js');

//var Srv1 = new srv.Server("TestServer", "1", 1); //for creating a new server
var Srv1 = new srv.Server("TestServer", null, null); // for creating an existing server object

Srv1.addTextChannelToList("channel1", "2", 2);
Srv1.addUserToList("user#1234", "3", 3);

Srv1.cacheTextChannelMessage("2","hi", "3", 0);
Srv1.cacheUserMessage("3", "hello", "2", 0);

console.log(JSON.stringify(Srv1.getChannelMessages("channel1")));
console.log(JSON.stringify(Srv1.getUserMessages("user1")));

Srv1.allMessagesToMemory();
*/


/*
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
