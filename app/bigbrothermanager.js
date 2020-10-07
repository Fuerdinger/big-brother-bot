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


class BigBrotherManager
{
    //big brother manager contains an array of servers (aka server list)
    servers = [];

    constructor()
    {
        // when the client is ready, run this code
        // this event will only trigger one time after logging in
        client.once('ready', () => {
            console.log('Ready!');
        });

        /// if server is already created, call existing server
        /// use map.
        for (var i = 0; i < this.servers.length; i++) {
            if (message.server.name == this.servers[i].name) {
                currentServer = this.servers[i];
            }
        }

        // see if server is already a client
        client.on()
        {
            /// if server not already created, create new server
            if (currentServer == null) {
                currentServer = new Server(message.server.name);
                this.servers.push(currentServer);
                // 
            }
        }

        /// callback for when a new user joins

        /// callback for when a new text channel is created

        client.on('message', message =>
        {
            // console.log(message.content);
            // if (message.content === `${prefix}ping`) {
            //     // send back "Pong." to the channel the message was sent in
            //     message.channel.send('Pong.');
            // }
            
            /// add new text message to server

            /// calllback for when a new message is inputted
            
            
            /// these callbacks will pass data to a server.js object
            /// server.js object will pass data to user.js object and textchanell.js object

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