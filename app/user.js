const { assert } = require('console');
var srlz = require('./io.js');
var IO = new srlz.IO();
//daniel

class UserMessage
{
    message = "";
    channelID = "";
    timePosted = null; //this is supposed a Javascript 'Date' type
}

class User
{
    serverName = "";
    userName = "";
    userID = 0;
    userJoinTime = "";

    getServerName(){return this.serverName;}
    getUserName(){return this.userName;}
    getUserID(){return this.userID;}
    getUserJoinTime(){return this.userJoinTime;}
    getNumMessagesTotal(){return this.json.messages.length;}

    //the memory representation of the json file
    json = {};
    //the file
    fd = 0;

    //we'll also store cached data (don't worry about for now)

    constructor(serverName, userName, userID, userJoinTime)
    {
        this.serverName = serverName;
        this.userID = userID;
        
        if (userName == null || userJoinTime == null ||
            IO.exists(this.serverName, "users/"+this.userID)) //user already exists and has a completed file
        {
            this.serializeChatLogFromDisk();
            this.userName = this.json["userName"];
            this.userJoinTime = this.json["userJoinTime"];
        }
        else //user must have just joined the server, and the file doesn't exist (or bot must have just been added)
        {
            this.userName = userName;
            this.userJoinTime = userJoinTime;

            this.json["serverName"] = serverName;
            this.json["userName"] = userName;
            this.json["userID"] = userID;
            this.json["userJoinTime"] = userJoinTime;
            this.json["messages"] = [];

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
        this.fd = IO.openFile(this.serverName, "users/"+this.userID, "r");
        var data = IO.readFromFile(this.fd, "r");
        this.json = JSON.parse(data); 
        IO.closeFile(this.fd);
        this.fd = 0;
    }

    serializeChatLogToDisk()  //writes the .json to memory (completely overwrites)
    {
        //when this function is called, fd should be 0
        assert(this.fd == 0);
        this.fd = IO.openFile(this.serverName, "users/"+this.userID, "w");
        IO.writeToFile(this.fd, this.json, "w");
        IO.closeFile(this.fd);
        this.fd = 0;
    }

    //for serializeMessage, pass in a UserMessage
    recordMessage(message) //adds a single message to the .json
    {
        this.json["messages"].push(message);
    }

    //overwrites the file with the recent messages
    serializeMessages()
    {
        this.serializeChatLogToDisk();
    }
}

module.exports = {User, UserMessage};