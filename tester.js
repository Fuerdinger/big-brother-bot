var srv = require('./app/server.js');
var usr = require('./app/user.js');
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

// New message
let message = {};
message.channel = {id: "775081447723630596"}; // Using an existing channel
message.member = { user }
message.createdTimestamp = timestamp;
message.content = "test message";
message.guild = guild;

var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./data/testServers/testbigbrother.json', 'utf8'));
var serverstr = data.map(s => s);
servers = [];
for (var i = 0; i < serverstr.length; i++) {
    var server = new srv.Server(guild, serverstr[i].serverName, serverstr[i].serverID, serverstr[i].timeBotWasAdded);
    
    // TEST: Add new user
    var newUser = new usr.User("775081447723630593", "TestUser#1111", "777777777777777777", 1604864261275);
    server.addUserToList(newUser.userName, newUser.userID, newUser.userJoinTime);
    const userPath = './data/servers/775081447723630593/users/777777777777777777.json';
    try {
        if (fs.existsSync(userPath)) {
            console.log("SUCCESS: User Created. New user JSON file created");
        } else {
            console.log("ERROR: User Created. Cannot find user JSON file");
        }
    } catch(err) {
        console.error(err)
    }

    // TEST: Add new text channel
    var newChannel = new txt.TextChannel("775081447723630593", "Test Channel", "777777777777777777", 1604864261275);
    server.addTextChannelToList(newChannel.channelName, newChannel.channelID, newChannel.channelCreationTime);
    const path = './data/servers/775081447723630593/textchannels/777777777777777777.json';
    try {
        if (fs.existsSync(path)) {
            console.log("SUCCESS: Channel Created. New channel JSON file created");
        } else {
            console.log("ERROR: Channel Created. Cannot find channel JSON file");
        }
    } catch(err) {
      console.error(err)
    }

    // TEST: Get channels
    try {
        server.getChannels();
        console.log("SUCCESS: server.getChannels()");
    } catch (err) {
        console.error(err)
    }

    // TEST: Get users
    try {
        server.getUsers();
        console.log("SUCCESS: server.server.getUsers()");
    } catch (err) {
        console.error(err)
    }

    // TEST: Get channel with ID
    try {
        server.getChannel("775081447723630596");
        console.log(`SUCCESS: server.getChannel("775081447723630596")`);
    } catch (err) {
        console.error(err)
    }

    // TEST: Get channel with channel name
    try {
        server.getChannelFromChannelName("general");
        console.log(`SUCCESS: server.getChannelFromChannelName("general")`);
    } catch (err) {
        console.error(err)
    }

    // TEST: Get user with user name
    try {
        server.getUserFromUsername("phungngo1020#2170");
        console.log(`SUCCESS: server.getUserFromUsername("phungngo1020#2170")`);
    } catch (err) {
        console.error(err)
    }

    // TEST: Get user with user name
    try {
        server.getUser("692465323231805541");
        console.log(`SUCCESS: server.getUser("692465323231805541")`);
    } catch (err) {
        console.error(err)
    }

    // TEST: Add new message
    try {
        newMessage(message);        // works
        console.log("SUCCESS: Added new message");
    } catch (err) {
        console.log(err);
    }


    servers.push(server);
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


