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



class BigBrotherManager
{
    //big brother manager contains an array of servers (aka server list)
    /*  Problems: 
         1. servers[] is empty/undefined everytime the server is start, should find a way to inialize servers[]
         2. err: serverLocation is undefined
         3. can be fixed by setting serLocation as the class variable and use 'this.serverLocation' but
         4. fs.mkdirSync(serverLocation); gives an error */
        
    servers = [];

    constructor()
    {


        client.once('ready', () => {
            console.log('Ready!');
        });

        
        client.on('message', message =>
        {
            /*
            message.channel.send("server name: " + message.guild.name);
            message.channel.send("server id: " + message.guild.id);
            message.channel.send("channel: " + message.channel.name);
            message.channel.send("user: " + message.member.user.tag);
            */
        });

        /************ SERVERS ************/
        client.on("guildCreate", function(guild) {
            let newServer = new srv.Server(guild.name, guild.id);
            servers.add(newServer);
        });

        client.on("guildDelete", function(guild) {
            let server = new srv.Server(guild.name, guild.id);
            for (let i = 0; i < servers.length; i++) {
                if (server.id = guild.id) {
                    array.splice(i, 1);
                }
            }
        });
        /* if server is already created, call existing server
        for (var i = 0; i < this.servers.length; i++) {
            if (message.server.name == this.servers[i].name) {
                currentServer = this.servers[i];
            }
        } */
        

        /************ USERS ************/
        client.on("guildMemberAdd", function(member){
            /* Create new user instance */
            let newUser = new us.User(member.guild.name, member.user, member.user.id, member.joinedTimestamp);

            /* Add users to servers list */
            let thisServer = servers.find(server => server.id == member.guild.id);
            thisServer.addUserToList(member.user.name, member.user.id, member.joinedTimestamp);

            // console.log(`${newUser.name} joined ${thisServer.name}`);
        });

        /************ TEXT CHANNELS ************/
        client.on("channelCreate", function(channel) 
        {
            /* To bypass undefined servers[] error
            let servers1 = [];
            let newServer = new srv.Server(channel.guild.name, channel.guild.id);
            servers1.push(newServer); */

            /* Add channel to servers list */
            let thisServer = servers.find(server => server.id == channel.guild.id);
            thisServer.addTextChannelToList(channel.name, channel.id, channel.createdTimestamp);

            // console.log(`channelCreate: ${channel.name} (${channel.id}) in ${channel.guild.name}`);
            console.log(thisServer.serverName);
            console.log(thisServer.serverID);
            console.log(thisServer.textChannels);
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