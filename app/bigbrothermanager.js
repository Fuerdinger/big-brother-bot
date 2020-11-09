//example of a message in a textchannel.json:
/*
string for the actual message
string for the name of the user who said the message
string for the time the message was posted
*/

//example of a message in a user.json
/*
string for the actual message
string for the time the message was posted
string for the name of the text channel it was posted in
*/

// phung:

//use serv.Server to get the Server class

// require the discord.js module
const Discord = require('discord.js');
const { token, clientID } = require('../data/util/config.json');

// create a new Discord client
const client = new Discord.Client();

const srv = require('./server.js');

var fs = require('fs');

var data = JSON.parse(fs.readFileSync('./data/bigbrother.json', 'utf8'));

class BigBrotherManager
{
    servers = [];

    constructor()
    {
        var serverstr = data.map(s => s);


        // convert json array to an array of Servers and store it in servers[]
        // create a new server for each index and add it to servers[]
        for (var i = 0; i < serverstr.length; i++) {
            var server = new srv.Server(null, serverstr[i].serverName, serverstr[i].serverID, serverstr[i].timeBotWasAdded);
            this.servers.push(server);
        }


        client.once('ready', () => {
            console.log('Ready!');
        });


        /*** When a new message is sent, hand it to server ***/
        client.on('message', message =>
        {   
            var server = '';
            
            //if the message was posted by big brother manager
            if (message.member.user.id === clientID)
            {
                return;
            }
            
            if (message.content === "")
            {
                return;
            }

            // add message to Server - server.receiveMessage(message, channel.id, user.id, );
            for (var i = 0; i < this.servers.length; i++) {
                if (this.servers[i].json.serverID == message.guild.id) {
                    server = this.servers[i];
                }
            }

            // Cache new message to its server
            if (server != '') {
                var msg = server.receiveMessage(message);
                if (!(msg === ""))
                {
                    message.channel.send(msg);
                }
                //server.cacheUserMessage(message.member.id, message, message.channel.id, today);
            }
        });

        /*** When a new server is created, add to servers[] ***/
        client.on('guildCreate', guild => {
            console.log(guild);
            var today = new Date();
            let timestamp = today.getTime();
            let newServer = new srv.Server(guild, guild.name, guild.id, timestamp);
            this.addServerToList(newServer);
        });

        /*** When a new server is deleted, remove from servers[] ***/
        client.on('guildDelete', guild => 
        {
            //do nothing because we want to keep their data
        });        

        /*** When a new member is added, add it to the server ***/
        client.on("guildMemberAdd", member => 
        {
            /* Add users to servers list */
            let thisServer = this.servers.find(server => server.json.serverID == member.guild.id);        
            thisServer.addUserToList(member.user.tag, member.user.id, member.joinedTimestamp);
        });

        /*** When a new text channel is added, add it to the approriate server ***/
        client.on("channelCreate", channel => 
        {

            let thisServer = '';

            // Find server that matches channel's serverID
            for (var i = 0; i < this.servers.length; i++) {
                if (this.servers[i].json.serverID == channel.guild.id) {
                    thisServer = this.servers[i];
                }
            }

            /*
            // Add channel to servers list
            for (var x = 0; x < this.servers.length; x++) {
                if (thisServer != null) {
                    thisServer.channels.push(channel.id);
                    break;
                }
            }
            */
            if (thisServer != '') {
                thisServer.addTextChannelToList(channel.name, channel.id, channel.createdTimestamp);
            }


            // let bigbrother = JSON.stringify(this.servers);
            // fs.writeFileSync('./data/bigbrother.json', bigbrother);

        });

        // login to Discord with your app's token
        client.login(token);
    }

    // calllback for when a new message is inputted
    loadScript(newMessage) {
        
    }


    // Assuming newServer is an instance of Server
    addServerToList(newServer)
    {
        this.servers.push(newServer);

        var tempJSON = [];
        for (var i = 0; i < this.servers.length; i++)
        {
            tempJSON.push({"serverName": this.servers[i].json.serverName, "serverID": this.servers[i].json.serverID, "timeBotWasAdded": this.servers[i].json.timeBotWasAdded});
        }

        let bigbrother = JSON.stringify(tempJSON);
        fs.writeFileSync('./data/bigbrother.json', bigbrother);
    }
    

}

module.exports = {BigBrotherManager};