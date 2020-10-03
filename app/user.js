//daniel

class UserMessage
{
    message = "";
    channel = "";
    timePosted = "";
}

class User
{
    serverName = "";
    userName = "";
    userID = 0;
    userJoinTime = "";
    //you'll need some to way serialize this stuff  

    //we'll also store cached data (don't worry about for now)

    //contains a usertextlog, along with some other variables

    constructor(serverName, userName, userID, userJoinTime)
    {
        this.serverName = serverName;
        this.userName = userName;

        if (userID == null && userJoinTime == null)
        {
            this.serializeChatLogFromDisk(serverName, userName);
            return;
        }

        this.userID = userID;
        this.userJoinTime = userJoinTime;

        this.serializeChatLogToDisk(serverName);
    }

    serializeChatLogFromDisk(serverName, userName) //reads the .json into memory
    {

    }
    serializeChatLogToDisk()  //writes the .json to memory (completely overwrites)
    {

    }
    serializeMessage() //adds a single message to the .json
    {

    }
    //serializeRecentChangesToDisk(); //happens at fixed interval
}

module.exports = {User, UserMessage};