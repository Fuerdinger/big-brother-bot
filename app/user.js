//daniel

class User
{
    userName = "";
    userID = 0;
    userJoinTime = 0;
    //you'll need some to way serialize this stuff  

    //we'll also store cached data (don't worry about for now)

    //contains a usertextlog, along with some other variables

    serializeChatLogFromDisk(); //reads the .json into memory
    serializeChatLogToDisk();  //writes the .json to memory (completely overwrites)
    serializeMessage(); //adds a single message to the .json
    //serializeRecentChangesToDisk(); //happens at fixed interval
}