// Errors encountered:
// io.js
// "serversPath = __dirname + '/../data/servers/';" 
// returns "/big-brother-bot/app/../data/servers/" 
// instead of "/big-brother-bot/data/servers/"


var srv = require('./app/server.js');
var txt = require('./app/textchannel.js');

/************** Test **************/
let today = new Date();
let timestamp = today.getTime();

let guild = {
    id: "770006882429304872",
    name: "Bot-Test-2",
    timeBotWasAdded: 1603669903345
};

let user = {};
user.username = "phungngo1020#2170";
user.id = "692465323231805541";
user.joinedTimestamp = 1603654346817;
user.serverID = "770006882429304872";

let message = {};
message.channel = {id: "770007477139669002"};
message.member = { user }
message.createdTimestamp = timestamp;
message.content = "test message";
message.guild = guild;


var fs = require('fs');
var data = JSON.parse(fs.readFileSync('../data/bigbrother.json', 'utf8'));
var serverstr = data.map(s => s);
servers = [];
for (var i = 0; i < serverstr.length; i++) {
    var server = new srv.Server(guild, serverstr[i].serverName, serverstr[i].serverID, serverstr[i].timeBotWasAdded);
    servers.push(server);
}

let channel1 = {"serverName": "770006882429304872","channelName": "Test-Channel-1","channelID": "1111","channelCreationTime": 1243534626};
let channel2 = {"serverName": "770006882429304872","channelName": "Test-Channel-2","channelID": "2222","channelCreationTime": 1919385926};

try {
    guildCreate(guild);         // gives error on line 76 -> line 83 in server.js
} catch {

}

try {
    channelCreate(channel1);    // works
    console.log("Added channel1");
    channelCreate(channel2);    // works
    console.log("Added channel2");
} catch (err) {
    console.log(err);
}

try {
    guildMemberAdd(user);       // gives error because guildCreate failed to add server to bigbrother.json
    console.log("Added new user");
} catch (err) {
    console.log(err);
}

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
        console.log(msg);   // works, test with returning a string in server.js line 111

        if (!(msg === ""))
        {
            // message.channel.send(msg);   // not able to implement with a test message
        }
    } 
}

/************** Add new Server **************/
function addServerToList(newServer) {
    servers.push(newServer);

    var tempJSON = [];
    for (var i = 0; i < servers.length; i++)
    {
        tempJSON.push({"serverName": servers[i].json.serverName, "serverID": servers[i].json.serverID, "timeBotWasAdded": servers[i].json.timeBotWasAdded});
    }

    let bigbrother = JSON.stringify(tempJSON);
    fs.writeFileSync('../data/bigbrother.json', bigbrother);
}

function guildCreate(guild) 
{
    let server = guild;
    let today = new Date();
    let timestamp = today.getTime();
    let newServer = new srv.Server(server, guild.name, guild.id, timestamp);    // error
    addServerToList(newServer);
}


/************** Add new text channel **************/
function channelCreate(channel) {
    var newChannel = new txt.TextChannel(channel.serverName, channel.channelName, channel.channelID, channel.channelCreationTime);
    console.log(newChannel);
}

/************** Add new user **************/
function guildMemberAdd(newUser) {

    let thisServer = servers.find(server => server.json.serverID == newUser.serverID);
    for(let x = 0; x < servers.length; x++) {
        if(servers[x].json.serverID == newUser.serverID) {
            thisServer = servers[i];

        }
    }
    thisServer.addUserToList(newUser.username, newUser.id, newUser.joinedTimestamp);
}

