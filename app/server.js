//corey

//use txt.TextChannel and usr.User to get the respective classes
//as well as txt.ChannelMessage and usr.UserMessage

var fs = require("fs");

var txt = require("./textchannel.js");
var usr = require("./user.js");

var dataLocation = "../data/servers";

class Server
{
    serverName = "";
    serverID = 0;
    timeWhenBotWasAddedToServer = 0;

    textChannels = [];
    users = [];

    constructor(serverName) {
        this.serverName = serverName;
        this.timeWhenBotWasAddedToServer = 0 + new Date(); //time in milliseconds
        this.serverID = this.timeWhenBotWasAddedToServer; //rough implementation of unique identifier -- can be changed

        this.textChannels = [];
        this.users = [];

        //also creates directories for server/textchannels/users upon initialization
        serverLocation = dataLocation + this.serverName;
        fs.mkdir(serverLocation);
        fs.mkdir(serverLocation + "/textchannels");
        fs.mkdir(serverLocation + "/users");
    }
    
    //adds textchannel to local list
    addTextChannelToList(textchannels)
    {
        this.users.push(textchannels);
    }

    //adds user to local list
    addUserToList(user)
    {
        this.users.push(user);
    }

}

module.exports = {Server};