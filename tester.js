var srv = require('./app/server.js');
var txt = require('./app/textchannel.js');


let today = new Date();
let timestamp = today.getTime();

// Using an existing server to test
let guild = {
    id: "775081447723630593",
    name: "Bot-Test",
    timeBotWasAdded: 1604864261275
};


// Using an existing user to test
let user = {};
user.serverName = "775081447723630593";
user.userName = "phungngo1020#2170";
user.userID = "692465323231805541";
user.userJoinTime = 1604864217495;


// Using an existing user to test
let newUser = {};
newUser.serverName = "775081447723630593";
newUser.userName = "newuser#1010";
newUser.userID = "692465323231805520";
newUser.userJoinTime = 1604864217495;

// New message
let message = {};
message.channel = {id: "775081447723630596"}; // Using an existing channel
message.member = { user }
message.createdTimestamp = timestamp;
message.content = "test message";
message.guild = guild;

var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./testservers/bigbrother.json', 'utf8'));
var serverstr = data.map(s => s);
servers = [];
for (var i = 0; i < serverstr.length; i++) {
    var server = new srv.Server(guild, serverstr[i].serverName, serverstr[i].serverID, serverstr[i].timeBotWasAdded);
    
    // TEST: Add new user
    server.addUserToList(newUser.userName, newUser.userId, newUser.userJoinTime);
    console.log("Added new user");

    // TEST: Add new text channel
    var newChannel = new txt.TextChannel("775081447723630593", "Test Channel", "777777777777777777", 1604864261275);
    server.addTextChannelToList(newChannel.channelName, newChannel.channelID, newChannel.channelCreationTime);
    console.log("Added new text chanel");

    // TEST: Get channels
    console.log("Get Channels");
    console.log(server.getChannels());

    // TEST: Get users
    console.log("Get Users");
    console.log(server.getUsers());

    // TEST: Get channel with ID
    console.log("Get Channel with channel ID");
    console.log(server.getChannel("775081447723630596"));

    // TEST: Get channel with channel name
    console.log("Get Channel with channel name");
    console.log(server.getChannelFromChannelName("general"));

    // TEST: Get user with user name
    console.log("Get user with user name");
    console.log(server.getUserFromUsername("phungngo1020#2170"));

    // TEST: Get user with user name
    console.log("Get user with user ID");
    console.log(server.getUser("692465323231805541"));

    servers.push(server);
}


// TEST: Add new message
try {
    newMessage(message);        // works
    console.log("Added new message");
} catch (err) {
    console.log(err);
}

/************** Add new message **************/
// add message to Server - server.receiveMessage(message, channel.id, user.id, );
function newMessage(message) {
    let server = '';

    for (var i = 0; i < this.servers.length; i++) {
        if (this.servers[i].json.serverID == message.guild.id) {
            server = this.servers[i];
        }
    }
    
    if (server != '') {
        var msg = server.receiveMessage(message);
    } 
}


