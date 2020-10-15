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
    servers = [];

    constructor()
    {
        // var servers = data.map(s => s);
        var serverstr = data.map(s => s);


        // create a new server for each index
        for (var i = 0; i < serverstr.length; i++) {
            var server = new serv.Server(serverstr[i].json.serverName, serverstr[i].json.serverID, serverstr[i].json.timeBotWasAdded);
            console.log(server);

            this.servers.push(server);
        }


        client.once('ready', () => {
            console.log('Ready!');
            console.log('  ready');
            console.log(this.servers.length);
        });

        client.on('message', message =>
        {   
            var today = new Date();
            var server = '';

            // add message to Server - server.receiveMessage(message, channel.id, user.id, );
            for (var i = 0; i < this.servers.length; i++) {
                if (servers[i].serverID == message.guild.id) {
                    server = servers[i];
                }
            }
            if (server != '') {
                server.catcherUserMessage(message.member.id, message, message.channel.id, today);
            }
        

            // pass message to Server to determine if it's a command
            // Server would then hand it off to UI to handle the command

            // server.catcherUserMessage(user.id, message, channel.id);

        });

        /************ SERVERS ************/
        client.on('guildCreate', guild => {
            let newServer = new srv.Server(guild.name, guild.id);
            this.servers.add(newServer);
        });


        client.on('guildDelete', guild => 
        {
            let server = new srv.Server(guild.name, guild.id);
            for (let i = 0; i < this.servers.length; i++) {
                if (server.id = guild.id) {
                    this.servers.splice(i, 1);
                }
            }
        });        

        /************ USERS ************/
        client.on("guildMemberAdd", member => 
        {
            /* Add users to servers list */
            let thisServer = this.servers.find(server => server.id == member.guild.id);
            thisServer.addUserToList(member.user.name, member.user.id, member.joinedTimestamp);
        });
        // client.on("guildMemberRemove", member => 
        // {
        //     /* Add users to servers list */
        //     let thisServer = this.servers.find(server => server.id == member.guild.id);
            
        // });

        /************ TEXT CHANNELS ************/
        client.on("channelCreate", channel => 
        {
            let thisServer = '';
            // thisServer = this.servers.find(server => server.serverID == channel.guild.id);
            for (var i = 0; i < this.servers.length; i++) {
                if (this.servers[i].json.serverID == channel.guild.id) {
                    thisServer = this.servers[i];
                }
            }

            /* Add channel to servers list */
            for (var x = 0; x < this.servers.length; x++) {
                if (thisServer != null) {
                    thisServer.channels.push(channel.id);
                    break;
                }
            }
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
    }
    

}

module.exports = {BigBrotherManager};