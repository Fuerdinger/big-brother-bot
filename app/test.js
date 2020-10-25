// Errors encountered:
// io.js
// "serversPath = __dirname + '/../data/servers/';" 
// returns "/big-brother-bot/app/../data/servers/" 
// instead of "/big-brother-bot/data/servers/"


var srv = require('./server.js');
var txt = require('./textchannel.js');

/************** Test **************/
let today = new Date();
let timestamp = today.getTime();

let channel1 = {"serverName": "111111111111111112","channelName": "Test-Channel-1","channelID": "1111","channelCreationTime": 1243534626};
let channel2 = {"serverName": "111111111111111112","channelName": "Test-Channel-2","channelID": "2222","channelCreationTime": 1919385926};

let guild = {};
guild.name = "Test-Server-2";
guild.id = "111111111111111112";
guild.channels = [];
guild.channels.push(channel1);
guild.channels.push(channel2);

let user = {};
user.username = "name 1";
user.id = "2111111";
user.joinedTimestamp = timestamp;
user.serverID = "111111111111111112";

var fs = require('fs');
var data = JSON.parse(fs.readFileSync('../data/bigbrother.json', 'utf8'));
var serverstr = data.map(s => s);
servers = [];
for (var i = 0; i < serverstr.length; i++) {
    var server = new srv.Server(guild, serverstr[i].serverName, serverstr[i].serverID, serverstr[i].timeBotWasAdded);
    servers.push(server);
}

guildCreate(guild);         // gives error on line 76 -> line 83 in server.js

channelCreate(channel1);    // works
channelCreate(channel2);    // works

guildMemberAdd(user);       // gives error because guildCreate failed to add server to bigbrother.json


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

