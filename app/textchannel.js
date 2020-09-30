//daniel

class TextChannel
{
    channelName = "";
    channelID = 0;
    channelCreationTime = 0;


    serializeChatLogFromDisk(); //reads the .json into memory
    serializeChatLogToDisk();  //writes the .json to memory (completely overwrites)
    serializeMessage(); //adds a single message to the .json
    //serializeRecentChangesToDisk(); //happens at fixed interval


    //we'll also store cached data (don't worry about for now)

    //contain a single TextChannelLog in addition to some other variables
}

