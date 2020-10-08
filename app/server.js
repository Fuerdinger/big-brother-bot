const { assert } = require("console");
//corey

//use txt.TextChannel and usr.User to get the respective classes
//as well as txt.ChannelMessage and usr.UserMessage

var fs = require("fs");

const { TextChannel, ChannelMessage } = require("./textchannel.js");
const { User } = require("./user.js");
var srlz = require("./io.js");
var IO = new srlz.IO();

//var dataLocation = path.normalize(__dirname + "/../data/servers");

//generates a server object based on the server name

class Server
{
    json = {};
    fd = 0;

    textChannels;
    users;

    //initializes the server given the server name and ID(discord.guild has a unique ID already generated)
    //will need to overload function to detect server objects created without params
    constructor(serverName, serverID, timeBotWasAdded) {
        this.json["serverName"] = serverName;
        this.fd = 0;

        this.textChannels = new Map();
        this.users = new Map();

        if(serverID == null && timeBotWasAdded == null
                || IO.exists(this.json["serverName"], this.json["serverName"])) //already exists
        {
            this.serializeMetadataFromDisk();

            //populate local list of existing textchannels/users
            //channelfiles = IO.getFilesInDir(this.json["serverName"], "textchannels");
            IO.getFilesInDir(this.json["serverName"], "textchannels").forEach(file => {
                var splitFile = file.split('.');
                this.addTextChannelToList(splitFile[0]);
            });

            IO.getFilesInDir(this.json["serverName"], "users").forEach(file => {
                var splitFile = file.split('.');
                this.addUserToList(splitFile[0]);
            });
        }
        else //new server
        {
            this.json["serverName"] = serverName;
            this.json["timeBotWasAdded"] = timeBotWasAdded;
            this.json["serverID"] = serverID;

            IO.makeDir(this.json["serverName"]);
            IO.makeDir(this.json["serverName"] + "/textchannels");
            IO.makeDir(this.json["serverName"] + "/users");

            this.serializeMetadataToDisk();
        }
    }

    //adds new textchannel to local list
    addTextChannelToList(channelName, channelID=null, channelCreationTime=null)
    {
        this.textChannels.set(channelName, new TextChannel(this.json["serverName"], channelName, channelID, channelCreationTime));
    }

    //adds new user to local list
    addUserToList(userName, userID=null, userJoinTime=null)
    {
        this.users.set(userName, new User(this.json["serverName"], userName, userID, userJoinTime));
    }

    getChannelMessages(channelName)
    {   
        assert(this.textChannels.has(channelName) == true);
        return this.textChannels.get(channelName).json["messages"];
    }
    
    getUserMessages(userName)
    {
        assert(this.users.has(userName) == true);
        return this.users.get(userName).json["messages"];
    }

    //writes a single text channel message to cache(local memory)
    cacheTextChannelMessage(channelID, message, userID, timePosted)
    {
        //var newMessage = this.generateChannelMessage(message, userID, timePosted);
        var newMessage = {message: message, channel: userID, timePosted: timePosted};
        this.textChannels.get(channelID).recordMessage(newMessage);
    }

    //writes a single user message to cache
    cacheUserMessage(userID, message, channelID, timePosted)
    {
        //var newMessage = this.generateUserMessage(message, channelID, timePosted);
        var newMessage = {message: message, channel: channelID, timePosted: timePosted};
        this.users.get(userID).recordMessage(newMessage);
    }

    channelMessagesFromMemory(userID)
    {
        return 0;
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
        this.textChannels.get(channelID).serializeChatLogToDisk();
    }

    //writes all cached messages to permanent memory for a user
    userMessagesToMemory(userID)
    {
        this.users.get(userID).serializeChatLogToDisk();
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
        this.fd = IO.openFile(this.json["serverName"], this.json["serverName"], "r");
        var data = IO.readFromFile(this.fd, "r");
        this.json = JSON.parse(data);
        this.fd = 0;
    }

    serializeMetadataToDisk()
    {
        assert(this.fd == 0);
        
        this.fd = IO.openFile(this.json["serverName"], this.json["serverName"], "w");
        IO.writeToFile(this.fd, this.json, "w");
        IO.closeFile(this.fd);
        this.fd = 0;
    }
}

module.exports = {Server};