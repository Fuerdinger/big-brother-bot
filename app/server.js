//corey

//use txt.TextChannel and usr.User to get the respective classes
//as well as txt.ChannelMessage and usr.UserMessage


var txt = require("./textchannel.js");
var usr = require("./user.js");

class Server
{
    serverName = "";
    serverID = 0;
    timeWhenBotWasAddedToServer = 0;
    //you'll need some to way serialize this stuff  

    constructor(serverName, serverID, timeWhenBotWasAddedToServer) {
        this.serverName = serverName;
        this.serverID = serverID;
        this.timeWhenBotWasAddedToServer = timeWhenBotWasAddedToServer;
    }
    

    addTextChannelToList()
    {

    }

    addUserToList()
    {

    }

    //contains an array of text channels
    //also contains an array of users
}

module.exports = {Server};