const server = require("./server");
const user = require("./user");

class Searcher
{
    //all of these functions will return strings

    //specifies no user/channel serach restrictions
    nullString = '*';

    helpComment =  
    `!bb
        simple menu with basic searching
    note: for the below functions, user/channel restrict searching to that
          user/channel; passing '*' will search all users/channels
          
    !bb wordSearch(user, channel, word)
        displays all messages that have the word
        
    !bb wordSearchLength(user, channel, word)
        displays the number of times a word has occurred
    !bb postSearchByDay(user, channel, day)
        displays all messages that occurred in a specific day
        format: ddmmyyyy
    !bb postSearchByDayLength(user, channel, day)
        displays the number of messages that occurred in a specific day
        format: ddmmyyyy
    !bb postSearchByDayLengthAverage(user, channel)
        displays the average number of messages since server creation
    !bb postSearchByDayLengthMax(user, channel)
        displays the largest number of messages in a single day
    !bb banSearch(user)
        displays information related to user bans
    !bb recentMessages(user)
        displays the most recent messages from a user
    !bb mostUsedWords(user, channel)
        displays the most used words in the server
    !bb instantiateRule(bannedWords, punishmentLength, numberOfTimes, resetFrequency)
        creates a new server rule
        bannedWords should be semicolon separated
        punishmentLength should be an integer representing days (-1 for warning, 0 for kick, * for permanent ban)
        numberOfTimes is how many times the word(s) must be said to incur punishment
        resetFrequency is how often the strike system resets (* for never resets)    
        `;

    constructor() {}

    help()
    {
        return this.helpComment;
    }
    //<this lists out all the different commands>

    wordSearch(server, user, channel, word)
    {
        var userDict = this.filterByUC(server, user, channel);
        userDict = this.wordSearchDict(userDict, word);

        return "Messages containing \"" + word + "\"" +
                     " from " + this.resolveUserName(user) + 
                     " in " + this.resolveChannelName(channel) + ":\n" + 
                     this.formatMessages(server, userDict);
    }
    //would print out all messages made by a user in a particular channel where they used a certain word
    //you can pass in an * for user and channel to specify that you want to see all users and all channels

    wordSearchLength(server, user, channel, word)
    {
        var userDict = this.filterByUC(server, user, channel);
        userDict = this.wordSearchDict(userDict, word);

        return "Number of messages from " + this.resolveUserName(user) +
                " in " + this.resolveChannelName(channel) + 
                " containing the word \"" + word + "\"" + 
                ": " + this.countPosts(userDict) + "\n";
    }
    //do the same thing as above, but instead of printing out the messages, prints out the number of messages

    postSearchByDay(server, user, channel, day)
    {
        var userDict = this.filterByUC(server, user, channel);
        userDict = this.postSearchByDayDict(userDict, day);
        return "Messages" +
                    " from " + this.resolveUserName(user) + 
                    " in " + this.resolveChannelName(channel) + 
                    " on " + day.toString() + "\n\n" + 
                    this.formatMessages(server, userDict);
    }
    //print out all the posts made by a user in a particular channel in a certain day

    postSearchByDayLength(server, user, channel, day)
    {
        var userDict = this.filterByUC(server, user, channel);
        userDict = this.postSearchByDayDict(userDict, day);
        
        return "Number of messages from " + this.resolveUserName(user) +
                " in " + this.resolveChannelName(channel) + 
                " on " + day.toString() + ": " + userDict.length + "\n\n";
    }
    //same thing as above, but it does length instead

    postSearchByDayLengthAverage(server, user, channel)
    {
        var userDict = this.filterByUC(server, user, channel);
        return "Average messages made each day by " + this.resolveUserName(user) +
                " in " + this.resolveChannelName(channel) + ": " + 
                (this.countPosts(userDict) / this.uniqueDays(userDict)).toFixed(2) + "\n\n";
    }
    //same thing as above, but it computes it for every day and takes the average of all of them

    postSearchByDayLengthMax(server, user, channel)
    {
        var userDict = this.filterByUC(server, user, channel);
        return "Most messages made in a day by " + this.resolveUserName(user) +
                " in " + this.resolveChannelName(channel) + ": " + 
                this.maxPostsInDay(userDict) + "\n\n";
    }
    //same thing as above, but instead of average, it finds the max

    banSearch(server, user)
    {
        return "calling banSearch";
    }
    //prints number of times a user was banned as well as the dates they were banned (and also the reason)
    //you can pass in * for the user to see it for all users
    recentMessages(server, user)
    {
        var numberOfMessagesToDisplay = 5;

        var userDict = this.filterByUC(server, user, "*");
        var sortedMessages = this.recentMessagesSort(userDict);
        var retStr = "Most recent messages from " + this.resolveUserName(user) + ":\n";

        for(var i = 0; i < Math.min(numberOfMessagesToDisplay, sortedMessages.length); i++)
        {
            retStr += "#" + (i + 1) + "\nMessage: " + sortedMessages[i]["message"] + 
                        "\nTime posted: " + sortedMessages[i]["timePosted"].toString() + 
                        "\nChannel: " + server.getChannelName(sortedMessages[i]["channelID"]) + "\n\n";
        }

        return retStr;
    }
    //prints the most recent messages made by a user (do 10 for now)
    //pass in * for the user to see for all users, server wide

    mostUsedWords(server, user, channel)
    {
        var userDict = this.filterByUC(server, user, channel);
        var mostUsedWordsLists = this.mostUsedWordsDict(userDict);
        var retStr = "Most used words from " + this.resolveUserName(user) + 
                        " in " + this.resolveChannelName(channel) +
                        ": \n";

        for(var i = 0; i < mostUsedWordsLists[0].length; i++)
        {
            retStr += "#" + (i + 1) + "\nWord: " + mostUsedWordsLists[0][i] +
                        "\nTimes used: " + mostUsedWordsLists[1][i] + "\n\n";
        }

        return retStr + "\n";
    }
    //prints out the most used words by a user for a channel
    //* can be passed in for user and channel

    /* Private functions */

    //converts json["messages"]["timePosted"] from milliseconds to Date()
    convertToDateClass(dict)
    {
        for(var k of Object.keys(dict))
        {
            var messages = dict[k].json["messages"];

            for(var i = 0; i < messages.length; i++)
            {
                dict[k].json["messages"][i]["timePosted"] = new Date(messages[i]["timePosted"]);
            }
        }

        return dict;
    }

    //returns relevant user info
    obtainUserInfo(server, user)
    {
        var userDict = {};
        
        if(user === this.nullString)
        {
            userDict = server.getUsers();
        }
        else
        {
            userDict[user] = user;
        }

        return userDict;
    }

    obtainChannelInfo(server, channel)
    {
        var channelDict = {};
        
        if(channel === this.nullString)
        {
            channelDict = server.getChannels();
        }
        else
        {
            channelDict[channel] = channel;
        }

        return channelDict;
    }

    resolveUserName(user)
    {
        if(user === this.nullString)
        {
            return 'all users';
        }
        else
        {
            return user.userName;
        }
    }

    resolveChannelName(channel)
    {
        if(channel === this.nullString)
        {
            return 'all channels';
        }
        else
        {
            return channel.channelName;
        }
    }

    //formats all posts from user dictionary
    //posts are added in order of users, not by time posted (can be changed in the future)
    formatMessages(server, userDict)
    {
        var formattedString = "";
        var count = 0;

        for(var userI of Object.keys(userDict))
        {
            var user = userDict[userI];
            for(var i = 0; i < Object.keys(user.json["messages"]).length; i++)
            {
                formattedString += 
                    "#" + (i + 1) + "\n" + 
                    "User: " + user.userName + "\n" +
                    "Message: " + user.json["messages"][i]["message"] + "\n" +
                    "Channel: " + server.getChannelName(user.json["messages"][i]["channelID"]) + "\n" +
                    "Time Posted: " + user.json["messages"][i]["timePosted"].toString() + "\n";
                count += 1;
            }
        }

        if(count == 0)
        {
            formattedString = "None\n";
        }

        return formattedString;
    }

    //sorts the messages by most recent
    //technically unneeded as messages are already in order of date posted, unless multiple users are in userDict
    recentMessagesSort(userDict)
    {
        var messages = [];

        for(var userI of Object.keys(userDict))
        {
            var userMessages = userDict[userI].json["messages"];
            //go through all messages
            for(var i = 0; i < userMessages.length; i++)
            {
                var messageDate = userMessages[i]["timePosted"].getTime();

                //find place in ordered list
                if(messages.length == 0)
                {
                    messages.push(userMessages[i]);
                }
                else
                {
                    var j = 0;
                    while(j < messages.length)
                    {
                        if(messageDate > messages[j]["timePosted"].getTime())
                        {
                            //insert into list
                            messages.splice(j, 0, userMessages[i]);
                            break;
                        }
                        j++;
                    }

                    if(j == messages.length)
                    {
                        messages.push(userMessages[i]);
                    }
                }
            }
        }

        return messages;
    }

    //needs testing to verify alogrithm
    //performs mostUsedWords but returns a list containing 5 most used words and number of times used
    mostUsedWordsDict(userDict)
    {
        var maxCount = [0, 0, 0, 0, 0];
        var lowestMax = 0;
        var maxWord = ["", "", "", "", ""]; //list of words 
        //dict containing the sum of all words in this userDict
        //needed for when finding most used word in a channel
        var wordDict = {}; 

        //add all user's word count into wordDict
        for(var userI of Object.keys(userDict))
        {
            var messages = userDict[userI].json["messages"];

            for(var messageI of Object.keys(messages))
            {
                var words = messages[messageI]["message"].split(" ");

                for(var i = 0; i < words.length; i++)
                {
                    if(wordDict.hasOwnProperty(words[i]))
                    {
                        wordDict[words[i]] += 1;
                    }
                    else
                    {
                        wordDict[words[i]] = 1;
                    }
                }
            }
        }

        //find most used words
        for(var wordI of Object.keys(wordDict))
        {
            if(wordDict[wordI] > lowestMax)
            {
                //add to sorted list
                for(var i = 0; i < maxCount.length; i++)
                {
                    if(maxCount[i] < wordDict[wordI])
                    {
                        //position found, insert into array
                        maxCount.splice(i, 0, wordDict[wordI]);
                        //remove 6th value
                        maxCount.splice(5, 1);

                        maxWord.splice(i, 0, wordI);
                        maxWord.splice(5, 1);

                        break;
                    }
                }

                lowestMax = maxCount[4];
            }
        }

        return [maxWord, maxCount];
    }

    countPosts(userDict)
    {
        var count = 0;

        for(var userI of Object.keys(userDict))
        {
            var messages = userDict[userI].json["messages"];
            count += messages.length;
        }

        return count;
    }

    //returns the maximum number of posts made in a day from userDict
    maxPostsInDay(userDict)
    {
        var max = 0;
        var days = {};

        //count up number of posts per day
        for(var userI of Object.keys(userDict))
        {
            var messages = userDict[userI].json["messages"];

            for(var i = 0; i < messages.length; i++)
            {
                var dayStr = messages[i]["timePosted"].toDateString();
                if(!days.hasOwnProperty(dayStr))
                {
                    days[dayStr] = 1;
                }
                else
                {
                    days[dayStr] += 1;
                }
            }
        }

        //find maximum number of posts made in a day
        for(var dayI of Object.keys(days))
        {
            if(days[dayI] > max)
            {
                max = days[dayI];
            }
        }
        return max;
    }

    //returns the number  of unique days in a dictionary
    uniqueDays(userDict)
    {
        var days = {};

        for(var userI of Object.keys(userDict))
        {
            var messages = userDict[userI].json["messages"];

            for(var i = 0; i < messages.length; i++)
            {
                var dayStr = messages[i]["timePosted"].toDateString();
                if(!days.hasOwnProperty(dayStr))
                {
                    days[dayStr] = true;
                }
            }
        }

        return Object.keys(days).length;
    }

    //filters a dictionary by word
    wordSearchDict(userDictOrig, word)
    {
        var userDict = this.getCopy(userDictOrig); //gets copy to prevent changing original dict data

        for(var userI of Object.keys(userDict))
        {
            //search through all messages for each user
            var userMessages = userDict[userI].json["messages"];
            var i = 0;
            while(i < userMessages.length)
            {
                //remove messages without word
                //      !!!!!currently does not check for lower/uppercase!!!!!
                var words = userMessages[i]["message"].split(" ");

                if(!words.includes(word))
                {
                    userMessages.splice(i, 1);
                }
                else
                {
                    i++;
                }
            }
        }
        
        return userDict;
    }

    //performs postSearchByDay but returns a dictionary
    //note date is a Date object
    postSearchByDayDict(userDict, date)
    {
        var dateString = date.toDateString();

        for(var userI of Object.keys(userDict))
        {
            //search through all messages for each user
            var userMessages = userDict[userI].json["messages"];
            for(var i = 0; i < userMessages.length; i++)
            {
                //remove messages not posted on day of date
                if(userMessages[i]["timePosted"].toDateString() !== dateString)
                {
                    userDict[userI].json["messages"].splice(i, 1);
                }
            }
        }
        
        return userDict;
    }

    //obtains copy of the dictionary
    getCopy(userDict)
    {
        return this.convertToDateClass(JSON.parse(JSON.stringify(userDict)));

    }

    //finds all relevant messages based on restrictions described by user and channel
    filterByUC(server, user, channel)
    {
        console.log("processing");
        var userDict = this.getCopy(this.obtainUserInfo(server, user));

        if(channel !== this.nullString)
        {
            for(var userI of Object.keys(userDict))
            {
                //search through all messages for each user
                var userMessages = userDict[userI].json["messages"];
                var i = 0;
                while(i < userMessages.length)
                {
                    //remove messages not posted in channel["channelID"]);
                    if(channel.channelID !== userMessages[i]["channelID"])
                    {
                        userDict[userI].json["messages"].splice(i, 1);
                    }
                    else
                    {
                        i++;
                    }
                }
            }
        }
        return userDict;
    }
}

module.exports = {Searcher};