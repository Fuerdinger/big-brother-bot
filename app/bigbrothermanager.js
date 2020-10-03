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

//phung:

//use serv.Server to get the Server class
var serv = require('./server.js');

// require the discord.js module
const Discord = require('discord.js');
const { prefix, token } = require('../data/util/config.json');

// create a new Discord client
const client = new Discord.Client();


class BigBrotherManager
{
    constructor()
    {
        // when the client is ready, run this code
        // this event will only trigger one time after logging in
        client.once('ready', () => {
            console.log('Ready!');
        });

        client.on('message', message =>
        {
            console.log(message.content);
            if (message.content === `${prefix}ping`) {
                // send back "Pong." to the channel the message was sent in
                message.channel.send('Pong.');
            }
        });

        // login to Discord with your app's token
        
        client.login(token);
    }

    addServerToList()
    {

    }
    
    //big brother manager contains an array of servers (aka server list)
}

module.exports = {BigBrotherManager};