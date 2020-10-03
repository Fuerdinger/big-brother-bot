//daniel

class ChannelMessage
{
    message = "";
    user = "";
    timePosted = "";
}

class TextChannel
{
    serverName = "";
    channelName = "";
    channelID = 0;
    channelCreationTime = "";

    constructor(serverName, channelName, channelID, channelCreationTime)
    {
        this.serverName = serverName;
        this.channelName = channelName;

        if (channelID == null && channelCreationTime == null)
        {
            this.serializeChatLogFromDisk(serverName, channelName);
            return;
        }

        this.channelID = channelID;
        this.channelCreationTime = channelCreationTime;

        this.serializeChatLogToDisk(serverName);
    }

    serializeChatLogFromDisk(serverName, channelName) //reads the .json into memory
    {
        
    }
    serializeChatLogToDisk()  //writes the .json to memory (completely overwrites)
    {

    }
    serializeMessage()  //adds a single message to the .json
    {

    }
    //serializeRecentChangesToDisk(); //happens at fixed interval


    //we'll also store cached data (don't worry about for now)

    //contain a single TextChannelLog in addition to some other variables
}

module.exports = {TextChannel, ChannelMessage};