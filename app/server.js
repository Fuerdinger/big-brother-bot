const { assert } = require("console");
//corey

//use txt.TextChannel and usr.User to get the respective classes
//as well as txt.ChannelMessage and usr.UserMessage

var fs = require("fs");

const { TextChannel, ChannelMessage } = require("./textchannel.js");
const { User } = require("./user.js");

var dataLocation = "../data/servers";

//generates a server object based on the server name

class Server
{
    serverName = "";
    serverID = 0;
    timeWhenBotWasAddedToServer = 0;

    textChannels;
    users;

    //initializes the server given the server name and ID(discord.guild has a unique ID already generated)
    constructor(serverName, serverID) {
        this.serverName = serverName;
        this.timeWhenBotWasAddedToServer = 0 + new Date(); //time in milliseconds
        this.serverID = serverID;

        this.textChannels = new Map();
        this.users = new Map();

        //also creates directories for server/textchannels/users upon initialization
        /*
        serverLocation = dataLocation + this.serverName;
        fs.mkdirSync(serverLocation);
        fs.mkdirSync(serverLocation + "/textchannels");
        fs.mkdirSync(serverLocation + "/users"); */
    }

    //adds new textchannel to local list
    addTextChannelToList(channelName, channelID, channelCreationTime = 0)
    {
        this.textChannels[channelID] = new TextChannel(this.serverName, channelName, channelID, channelCreationTime);
    }

    //adds new user to local list
    addUserToList(userName, userID, userJoinTime = 0)
    {
        this.users[userID] = new User(this.serverName, userName, userID, userJoinTime);
    }

    getChannelMessages(channelID)
    {   
        assert(this.textChannels.has(channelID) == true);
        return this.textChannels[channelID].serializeChatLogFromDisk();
    }

    getUserMessages(userID)
    {
        assert(this.users.has(usedID) == true);
        return this.users[userID].serializeChatLogFromDisk();
    }

    //writes a single text channel message to cache(local memory)
    cacheTextChannelMessage(channelID, message, userID, timePosted)
    {
        newMessage = this.generateChannelMessage(message, userID, timePosted);
        this.textChannels[channelID].recordMessage(newMessage);
    }

    //writes a single user message to cache
    cacheUserMessage(userID, message, channelID, timePosted)
    {
        newMessage = this.generateUserMessage(message, channelID, timePosted);
        this.users[userID].recordMessage(newMessage);
    }
    
    allMessagesToMemory()
    {
        this.allChannelMessagesToMemory();
        this.allUserMessagesToMemory();
    }

    allChannelMessagesToMemory()
    {
        for(let channelID of this.textChannels.keys()) {
            this.channelMessagesToMemory(channelID);
        }
    }

    allUserMessagesToMemory()
    {
        for(let userID of this.users.keys()) {
            this.userMessagesToMemory(userID);
        }
    }

    //writes all cached messages to permanent memory for a textchannel
    channelMessagesToMemory(channelID)
    {
        textChannels[channelID].serializeChatLogToDisk();
    }

    //writes all cached messages to permanent memory for a user
    userMessagesToMemory(userID)
    {
        users[userID].serializeChatLogToDisk();
    }

    //private method to generate a ChannelMessage from data
    generateChannelMessage(message, userID, timePosted)
    {
        return new ChannelMessage(message, userID, timePosted);
    }
    
    //private method to generate a UserMessage from data
    generateUserMessage(message, channel, timePosted)
    {
        return new UserMessage(message, channel, timePosted);
    }
}

module.exports = {Server};