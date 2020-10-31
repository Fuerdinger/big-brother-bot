const { assert, time } = require("console");

var fs = require("fs");

const { TextChannel, ChannelMessage } = require("./textchannel.js");
const { User } = require("./user.js");
var srlz = require("./io.js");
const { UI } = require("./ui.js");
const {Moderator} = require("./moderator.js");
var IO = new srlz.IO();
var cacheLimit = 5;

//var dataLocation = path.normalize(__dirname + "/../data/servers");
//TODO: fix system for initializing existing textchannels/users from file system

//server must hold a UI instance; when receving a new message, if it begins with !bb, it should be passed to the UI class rather than being recorded

//server must hold a UI instance; when receving a new message, if it begins with !bb, it should be passed to the UI class rather than being recorded

class Server
{
    json = {};
    fd = 0;

    textChannels = {};
    users = {};

    ui = null;
    moderator = null;

    cacheCounter = 0;

    getServerName(){return this.json.serverName;}
    getTimeBotWasAdded(){return this.json.timeBotWasAdded;}
    getNumMessagesInServer()
    {
        var ret = 0;

        var values = Object.values(this.textChannels);
        for (var i = 0; i < values.length; i++)
        {
            ret += values[0].json.messages.length;
        }

        return ret;
    }
    getNumUsersInServer(){return Object.values(this.users).length;}

    //initializes the server given the server name and ID(discord.guild has a unique ID already generated)
    //will need to overload function to detect server objects created without params
    constructor(apiGuildObj, serverName, serverID, timeBotWasAdded) {
        this.json["serverID"] = serverID;
        this.fd = 0;
        this.cacheCounter = 0;

        this.textChannels = {};
        this.users = {};
        this.ui = new UI(this);
        this.moderator = new Moderator();

        if(serverName == null && timeBotWasAdded == null
                || IO.exists(this.json["serverID"], this.json["serverID"])) //already exists
        {
            console.log("   sever: init old server!");
            this.serializeMetadataFromDisk();
            
            //populate local list of existing textchannels/users
            //TODO: fix to not loop through file system to populate channels/users
            IO.getFilesInDir(this.json["serverID"], "textchannels").forEach(file => {
                var splitFile = file.split('.');
                this.addTextChannelToList(null, splitFile[0], null);
            });

            IO.getFilesInDir(this.json["serverID"], "users").forEach(file => {
                var splitFile = file.split('.');
                this.addUserToList(null, splitFile[0], null);
            });
        }
        else //new server
        {
            console.log("   sever: creating new server!");
            this.json["serverName"] = serverName;
            this.json["timeBotWasAdded"] = timeBotWasAdded;
            this.json["serverID"] = serverID;
            IO.makeDir(this.json["serverID"]);
            IO.makeDir(this.json["serverID"] + "/textchannels");
            IO.makeDir(this.json["serverID"] + "/users");
            apiGuildObj.channels.cache.each(channel => this.addTextChannelToList(channel.name, channel.id, channel.createdTimestamp));
            apiGuildObj.members.cache.each(member => this.addUserToList(member.user.tag, member.user.id, member.joinedTimestamp));

            this.serializeMetadataToDisk();
        }
    }

    /* Public functions to be called by bigbrothermanger.js */
    
    //tester functions
    getUserMessages(userID)
    {
        return this.getUser(userID).json["messages"];
    }

    getChannelMessages(channelID)
    {
        return this.getChannelMessages(channelID).json["messages"];
    }

    //message.content, message.channel.id, message.member.user.id, message.createdTimestamp
    //message, channelID, userID, timePosted

    //this function should be called by big brother manager, and should return a string which the big brother manager may have to output
    //the strings should be outputted to the appropriate channel by big brother manager, if the returned strings are not empty
    //channelID and userName should be unique identifiers used to identify users/channels across the system
    receiveMessage(message)
    {
        //checks whether the message contains a prefix for a command or user is currently in menu
        if(message.content.startsWith("!bb") || this.ui.isInMenu())
        {
            return this.ui.passInMessage(message.member.user.id, this.getChannel(message.channel.id), message.content.trim())
        }
        else
        {
            //first give to moderator
            var ret = this.moderator.receiveMessage(message.content);

            //regular message, store in cache
            this.cacheTextChannelMessage(message.channel.id, message.content, message.member.user.id, message.createdTimestamp);
            this.cacheUserMessage(message.member.user.id, message.content, message.channel.id, message.createdTimestamp);
            this.cacheCounter += 1;

            if(this.cacheCounter >= cacheLimit)
            {
                this.allMessagesToMemory();
                this.cacheCounter = 0;
            }

            return ret;
        }
    }

    //adds new textchannel to local list
    addTextChannelToList(channelName, channelID, channelCreationTime)
    {
        this.textChannels[channelID] = new TextChannel(this.json["serverID"], channelName, channelID, channelCreationTime);
    }

    //adds new user to local list
    addUserToList(userName, userID, userJoinTime)
    {
        this.users[userID] = new User(this.json["serverID"], userName, userID, userJoinTime);
    }

    getUsers()
    {
        return this.users;
    }

    getChannels()
    {
        return this.textChannels;
    }

    getChannel(channelID)
    {   
        if(this.textChannels.hasOwnProperty(channelID))
        {
            return this.textChannels[channelID];
        }
        else
        {
            return null;
        }
    }

    getChannelName(channelID)
    {
        return this.textChannels[channelID].channelName;
    }

    getUser(userID)
    {
        if(this.users.hasOwnProperty(userID))
        {
            return this.users[userID];
        }
        else
        {
            return null;
        }
    }

    getChannelFromChannelName(channelName)
    {
        var keys = Object.keys(this.textChannels);
        var ret = [];

        for (var i = 0; i < keys.length; i++)
        {
            if (this.textChannels[keys[i]].channelName === channelName)
            {
                ret.push(this.textChannels[keys[i]]);
            }
        }

        return ret;
    }
    
    getUserFromUsername(username)
    {
        var keys = Object.keys(this.users);
        var ret = [];

        for (var i = 0; i < keys.length; i++)
        {
            if (this.users[keys[i]].userName === username)
            {
                ret.push(this.users[keys[i]]);
            }
        }
        
        return ret;
    }

    /* Private functions for handling data */

    //writes a single text channel message to cache(local memory)
    cacheTextChannelMessage(channelID, message, userID, timePosted)
    {
        //var newMessage = this.generateChannelMessage(message, userID, timePosted);
        var newMessage = {message: message, userID: userID, timePosted: timePosted};
        this.textChannels[channelID].recordMessage(newMessage);
    }

    //writes a single user message to cache
    cacheUserMessage(userID, message, channelID, timePosted)
    {
        //var newMessage = this.generateUserMessage(message, channelID, timePosted);
        var newMessage = {message: message, channelID: channelID, timePosted: timePosted};
        this.users[userID].recordMessage(newMessage);
    }

    allMessagesToMemory()
    {
        this.allChannelMessagesToMemory();
        this.allUserMessagesToMemory();
    }

    allChannelMessagesToMemory()
    {
        for(var i of Object.keys(this.textChannels)) {
            this.channelMessagesToMemory(i);
        }
    }

    allUserMessagesToMemory()
    {
        for(var i of Object.keys(this.users)) {
            this.userMessagesToMemory(i);
        }
    }

    //writes all cached messages to permanent memory for a textchannel
    channelMessagesToMemory(channelID)
    {
        this.textChannels[channelID].serializeChatLogToDisk();
    }

    //writes all cached messages to permanent memory for a user
    userMessagesToMemory(userID)
    {
        this.users[userID].serializeChatLogToDisk();
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

    //server logging functions for metadata
    serializeMetadataFromDisk()
    {
        assert(this.fd == 0); //when this function is called, fd should be 0
        this.fd = IO.openFile(this.json["serverID"], this.json["serverID"], "r");
        var data = IO.readFromFile(this.fd, "r");
        this.json = JSON.parse(data);
        this.fd = 0;
    }

    serializeMetadataToDisk()
    {
        assert(this.fd == 0);
        
        this.fd = IO.openFile(this.json["serverID"], this.json["serverID"], "w");
        IO.writeToFile(this.fd, this.json, "w");
        IO.closeFile(this.fd);
        this.fd = 0;
    }
}

module.exports = {Server};