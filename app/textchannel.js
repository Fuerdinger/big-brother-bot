//daniel
const { assert } = require('console');

var srlz = require('./io.js');
var IO = new srlz.IO();

class ChannelMessage
{
    message = "";
    userID = "";
    timePosted = null; //this is supposed a Javascript 'Date' type
}

class TextChannel
{
    serverName = "";
    channelName = "";
    channelID = 0;
    channelCreationTime = "";

    getServerName(){return this.serverName;}
    getChannelName(){return this.channelName;}
    getChannelID(){return this.channelID;}
    getChannelCreationTime(){return this.channelCreationTime;}
    getMessagesInChannel(){return this.json.messages.length;}

    json = {};
    fd = 0;

    constructor(serverName, channelName, channelID, channelCreationTime)
    {
        this.serverName = serverName;
        this.channelID = channelID;

        if (channelName == null && channelCreationTime == null
            || IO.exists(this.serverName, "textchannels/"+this.channelID)) //text channel already exists, has a completed file
        {
            this.serializeChatLogFromDisk();
            this.channelName = this.json["channelName"];
            this.channelCreationTime = this.json["channelCreationTime"];
        }
        else //text channel must have just been created (or bot must have just been added to server)
        {
            this.channelName = channelName;
            this.channelCreationTime = channelCreationTime;

            this.json["serverName"] = serverName;
            this.json["channelName"] = channelName;
            this.json["channelID"] = channelID;
            this.json["channelCreationTime"] = channelCreationTime;
            this.json["messages"] = [];
            this.json["words"] = {}; //dictionary containing number of times a word is used

            this.serializeChatLogToDisk();
        }
    }

    destructor()
    {
        if (this.fd != 0) IO.closeFile(this.fd);
    }

    serializeChatLogFromDisk() //reads the .json into memory
    {
        assert(this.fd == 0); //when this function is called, fd should be 0
        this.fd = IO.openFile(this.serverName, "textchannels/"+this.channelID, "r");
        var data = IO.readFromFile(this.fd, "r");
        this.json = JSON.parse(data); 
        IO.closeFile(this.fd);
        this.fd = 0;
    }
    serializeChatLogToDisk()  //writes the .json to memory (completely overwrites)
    {
        //when this function is called, fd should be 0
        assert(this.fd == 0);
        this.fd = IO.openFile(this.serverName, "textchannels/"+this.channelID, "w");
        IO.writeToFile(this.fd, this.json, "w");
        IO.closeFile(this.fd);
        this.fd = 0;
    }

    //pass in a channelMessage
    recordMessage(message)  //adds a single message to the .json
    {
        this.json["messages"].push(message);
        this.updateWordCount(message);
    }

    updateWordCount(message)
    {
        var newWords = message.message.split(" ");
        
        for(var i = 0; i < newWords.length; i++)
        {
            if(this.json["words"].hasOwnProperty(newWords[i]))
            {
                this.json["words"][newWords[i]] += 1;
            }
            else
            {
                this.json["words"][newWords[i]] = 1;
            }
        }
    }

    //overwrites the file with the recent messages
    serializeMessages()
    {
        this.serializeChatLogToDisk();
    }
}

module.exports = {TextChannel, ChannelMessage};