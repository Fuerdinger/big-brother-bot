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
// calllback for when a new message is inputted
// callback for when a new user joins
// callback for when a new text channel is created
// these callbacks will pass data to a server.js object
// server.js object will pass data to user.js object and textchanell.js object

//use serv.Server to get the Server class
var serv = require('./server.js');


// require the discord.js module
const Discord = require('discord.js');
const { prefix, token } = require('../data/util/config.json');

// create a new Discord client
const client = new Discord.Client();

const us = require('./user.js');
const srv = require('./server.js');
const txt = require('./textchannel.js');

var fs = require('fs');

var data = JSON.parse(fs.readFileSync('./data/bigbrother.json', 'utf8'));

class BigBrotherManager
{

    constructor()
    {
        var servers = data.map(s => s);
        var serversSize = Object.keys(servers).length;


        client.once('ready', () => {
            console.log('Ready!');
        });

        client.on('message', message =>
        {
            var txtchannel = new txt.TextChannel(message.guild.name, message.channel.name, message.channel.id, message.channel.createdTimestamp);
            txtchannel.recordMessage(message);
        });

        /************ SERVERS ************/
        client.on("guildCreate", function(guild) {
            let newServer = new srv.Server(guild.name, guild.id);
            servers.add(newServer);
        });

        client.on("guildDelete", function(guild) {
            let server = new srv.Server(guild.name, guild.id);
            for (let i = 0; i < this.servers.length; i++) {
                if (server.id = guild.id) {
                    serversay.splice(i, 1);
                }
            }
        });        

        /************ USERS ************/
        client.on("guildMemberAdd", function(member){
            /* Add users to servers list */
            let thisServer = this.servers.find(server => server.id == member.guild.id);
            thisServer.addUserToList(member.user.name, member.user.id, member.joinedTimestamp);

        });

        /************ TEXT CHANNELS ************/
        client.on("channelCreate", function(channel) 
        {
            // console.log(typeof(servers[0]));
            // console.log(channel.guild.id);
            let server = null;
            server = servers.find(server => server.serverID == channel.guild.id);

            /* Add channel to servers list */
            for (var x = 0; x < serversSize; x++) {
                if (server != null) {
                    server.channels.push(channel.name);
                    break;
                }
            }

            let bigbrother = JSON.stringify(servers);
            fs.writeFileSync('./data/bigbrother.json', bigbrother);

            let thisServer = new srv.Server(channel.guild.name, channel.guild.id);

            thisServer.addTextChannelToList(channel.name, channel.id, channel.createdTimestamp);

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
    }
    

}

module.exports = {BigBrotherManager};