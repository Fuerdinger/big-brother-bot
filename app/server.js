//corey

//use txt.TextChannel and usr.User to get the respective classes
//as well as txt.ChannelMessage and usr.UserMessage

var fs = require("fs");

const { TextChannel, ChannelMessage } = require("./textchannel.js");
var txt = require("./textchannel.js");
const { User } = require("./user.js");
var usr = require("./user.js");

var dataLocation = "../data/servers";

//generates a server object based on the server name

class Server
{
    serverName = "";
    serverID = 0;
    timeWhenBotWasAddedToServer = 0;

    textChannels = [];
    users = [];

    //initializes the server given the server name and ID(discord.guild has a unique ID already generated)
    constructor(serverName, serverID) {
        this.serverName = serverName;
        this.timeWhenBotWasAddedToServer = 0 + new Date(); //time in milliseconds
        this.serverID = serverID;

        this.textChannels = [];
        this.users = [];

        //also creates directories for server/textchannels/users upon initialization
        serverLocation = dataLocation + this.serverName;
        fs.mkdir(serverLocation);
        fs.mkdir(serverLocation + "/textchannels");
        fs.mkdir(serverLocation + "/users");
        
    }

    //adds new textchannel to local list
    addTextChannelToList(channelName, channelID, channelCreationTime = 0)
    {
        channel = new TextChannel(this.serverName, channelName, channelID, channelCreationTime);
        this.textChannels.push(channel);
    }

    //adds new user to local list
    addUserToList(userName, userID, userJoinTime = 0)
    {
        user = new User(this.serverName, userName, userID, userJoinTime);
        this.users.push(user);
    }

    getChannelMessages(channelID)
    {
        for(i = 0; i < this.textChannels.length; i++) {
            if(this.textChannels[i].channelID == channelID) {
                return this.textChannels[i].serializeChatLogFromDisk();
            }
        }

        //should not happen
        return -1;
    }

    getUserMessages(userID)
    {
        for(i = 0; i < this.textChannels.length; i++) {
            if(this.users[i].userID == userID) {
                return this.users[i].serializeChatLogFromDisk();
            }
        }

        //should not happen
        return -1;
    }

    //updates a specific channel
    //how this is done is yet to be specified
    updateChannel(channelID, messages, userIDs, timesPosted)
    {
        channelMessages = this.generateChannelMessages(messages, userIDs, timesPosted);

        for(i = 0; i < this.textChannels.length; i++) {
            if(this.textChannels[i].channelID == channelID) {
                //write to proper textchannel
            }
        }
    }

    //updates a specific user
    updateUser(userID, messages, channels, timesPosted)
    {
        channelMessages = this.generateUserMessages(messages, channels, timesPosted);

        for(i = 0; i < this.textChannels.length; i++) {
            if(this.users[i].userID == userID) {
                //write to proper user
            }
        }
    }

    //private method to generate ChannelMessages from a list of data
    generateChannelMessages(messages, userIDs, timesPosted)
    {
        channelMessages = [];

        for(i = 0; i < messages.length; i++) {
            channelMessages.push(this.generateChannelMessage(messages[i], userIDs[i], timesPosted[i]));
        }

        return channelMessages;
    }

    //private method to generate a ChannelMessage from data
    generateChannelMessage(message, userID, timePosted)
    {
        return new ChannelMessage(message, userID, timePosted);
    }

    //private method to generate UserMessages from a list of data
    generateUserMessages(messages, channels, timesPosted)
    {
        userMessages = [];

        for(i = 0; i < messages.length; i++) {
            channelMessages.push(this.generateUserMessage(messages[i], channels[i], timesPosted[i]));
        }

        return userMessages;
    }
    
    //private method to generate a UserMessage from data
    generateUserMessage(message, channel, timePosted)
    {
        return new UserMessage(message, channel, timePosted);
    }
}

module.exports = {Server};