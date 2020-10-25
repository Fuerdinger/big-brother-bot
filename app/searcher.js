const server = require("./server");
const user = require("./user");

class Searcher
{
    //all of these functions will return strings

    constructor() {}

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
        `;

    constructor() {}

    help()
    {
        return helpComment;
    }
    //<this lists out all the different commands>

    wordSearch(server, user, channel, word)
    {
<<<<<<< HEAD
        return "calling wordSearch";
=======
        var userDict = filterByUC(server, user, channel);
        userDict = this.wordSearchDict(userDict, word);

        return "Messages containing \"" + word + "\"" +
                     " from " + this.resolveUserName(user) + 
                     " in " + this.resolveChannelName(channel) + "\n\n" + 
                     formattedString(userDict);
>>>>>>> Corey
    }
    //would print out all messages made by a user in a particular channel where they used a certain word
    //you can pass in an * for user and channel to specify that you want to see all users and all channels

    wordSearchLength(server, user, channel, word)
    {
<<<<<<< HEAD
        return "calling wordSearchLength";
=======
        var userDict = filterByUC(server, user, channel);
        userDict = this.wordSearchDict(userDict, word);

        return "Number of messages from " + this.resolveUserName(user) +
                " in " + this.resolveChannelName(channel) + ": " + this.countPosts(userDict);
>>>>>>> Corey
    }
    //do the same thing as above, but instead of printing out the messages, prints out the number of messages

    postSearchByDay(server, user, channel, day)
    {
<<<<<<< HEAD
        return "calling postSearchByDay";
=======
        var userDict = filterByUC(server, user, channel);
        userDict = this.postSearchByDayDict(userDict, day);
        return "Messages containing \"" + word + "\"" +
                    " from " + this.resolveUserName(user) + 
                    " in " + this.resolveChannelName(channel) + 
                    " on " + day.toDateString() + "\n\n" + 
                    formattedString(userDict);
>>>>>>> Corey
    }
    //print out all the posts made by a user in a particular channel in a certain day

    postSearchByDayLength(server, user, channel, day)
    {
<<<<<<< HEAD
        return "calling postSearchByDayLength";
=======
        var userDict = filterByUC(server, user, channel);
        userDict = this.postSearchByDayDict(userDict, day);
        
        return "Number of messages from " + this.resolveUserName(user) +
                " in " + this.resolveChannelName(channel) + 
                " on " + day.toDateString() + ": " + userDict.length;
>>>>>>> Corey
    }
    //same thing as above, but it does length instead

    postSearchByDayLengthAverage(server, user, channel)
    {
<<<<<<< HEAD
        return "calling postSearchByDayLengthAverage";
=======
        var userDict = this.filterByUC(server, user, channel);
        return "Average messages made each day by " + this.resolveUserName(user) +
                " in " + this.resolveChannelName(channel) + ": " + 
                (this.countPosts(userDict) / this.uniqueDays(userDict));
>>>>>>> Corey
    }
    //same thing as above, but it computes it for every day and takes the average of all of them

    postSearchByDayLengthMax(server, user, channel)
    {
<<<<<<< HEAD
        return "calling postSearchByDayLengthMax";
=======
        var userDict = this.filterByUC(server, user, channel);
        return "Most messages made in a day by " + this.resolveUserName(user) +
                " in " + this.resolveChannelName(channel) + ": " + 
                this.maxPostsInDay(userDict);
>>>>>>> Corey
    }
    //same thing as above, but instead of average, it finds the max

    banSearch(server, user)
    {
        return "calling banSearch";
    }
    //prints number of times a user was banned as well as the dates they were banned (and also the reason)
    //you can pass in * for the user to see it for all users

<<<<<<< HEAD
    recentMessages(server, user)
    {
=======
    //complex due to potential pages, need further design specifications
    recentMessages(server, user)
    {
        var numberOfMessagesToDisplay = 5;

        var userDict = this.filterByUC(server, user, "*");
        var sortedMessages = this.recentMessagesSort(userDict);
        var retStr = "Most recent messages from " + this.resolveUserName(user) + ":\n";

        for(var i = 0; i < numberOfMessagesToDisplay; i++)
        {
            retStr += "#" + (i + 1) + "\nMessage: " + sortedMessages[i].message + 
                        "\nTime posted: " + sortedMessages[i].timePosted + 
                        "\nChannel: " + sortedMessages[i].channelID;
        }

>>>>>>> Corey
        return "calling recentMessages";
    }
    //prints the most recent messages made by a user (do 10 for now)
    //pass in * for the user to see for all users, server wide

    mostUsedWords(server, user, channel)
    {
<<<<<<< HEAD
        return "calling mostUsedWords";
=======
        var userDict = this.filterByUC(server, user, channel);
        var mostUsedWordsLists = this.mostUsedWordsDict(userDict);
        var retStr = "Most used words from " + this.resolveUserName(user) + 
                        " in " + this.resolveChannelName(channel) +
                        ": \n";

        for(var i = 0; i < mostUsedWordsLists[0].length; i++)
        {
            retStr += "#" + (i + 1) + "\nWord: " + mostUsedWordsLists[0][i] +
                        "\nTimes used: " + mostUsedWordsLists[1][i] + "\n";
        }

        return retStr;
>>>>>>> Corey
    }
    //prints out the most used words by a user for a channel
    //* can be passed in for user and channel

<<<<<<< HEAD
=======
    /* Private functions */

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
            userDict[user]= user;
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
    formatUserMessages(userDict)
    {
        var formattedString = "";

        for(var userI in userDict.keys())
        {
            for(var i = 0; i < userDict[userI].json["messages"].length; i++)
            {
                formattedString += 
                    "User: " + userI + "\n" +
                    "Channel: " + userDict[userI].json["channelID"] +
                    "Time Posted: " + userDict[userI].json["timePosted"].toDateString(); + "\n" +
                    "Message: " + userDict[userI].json["messages"][i] + "\n";
            }
        }

        return formattedString;
    }

    //sorts the messages by most recent
    recentMessagesSort(userDict)
    {
        messages = [];

        for(var userI in userDict.keys())
        {
            var user = userDict[userI];

            //go through all messages
            for(var i = 0; i < user["messages"].length; i++)
            {
                var messageDate = user["messages"][i].timePosted.getTime();

                //find place in ordered list
                for(var j = 0; j < messages.length; i++)
                {
                    if(messageDate < messages[j].timePosted.getTime())
                    {
                        //insert into list
                        messages.splice(j, 0, user["messages"][i]);
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
        for(var userI in userDict.keys())
        {
            var userWordDict = userDict[userI].json["words"];

            for(var wordI in userWordDict.keys())
            {
                if(wordDict[wordI].hasOwnProperty(wordI))
                {
                    wordDict[wordI] += userWordDict[wordI];
                }
                else
                {
                    wordDict[wordI] = userWordDict[wordI];
                }
            }
        }

        //find most used words
        for(var wordI in wordDict.keys())
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
                        maxCount.splice(5, 1);

                        /* OLD CODE
                        var j = maxCount.length - 1;
                        while(j > i)
                        {
                            maxCount[j] = maxCount[j - 1];
                            maxWord[j] = maxWord[j - 1];
                        }

                        //place at position i
                        maxCount[i] = wordDict[wordI];
                        maxWord[i] = wordI;
                        */

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

        for(var userI in userDict.keys())
        {
            var messages = userDict[userI].json["messages"];

            for(var i = 0; i < messages.length; i++)
            {
                count += 1;
            }
        }

        return count;
    }

    //returns the maximum number of posts made in a day from userDict
    maxPostsInDay(userDict)
    {
        var max = 0;
        var days = {};

        //count up number of posts per day
        for(var userI in userDict.keys())
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
        for(var dayI in days.keys())
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

        for(var userI in userDict.keys())
        {
            var messages = userDict[userI].json["messages"];

            for(var i = 0; i < messages.length; i++)
            {
                var dayStr = messages[i]["timePosted"].toDateString();
                if(!days.hasOwnProperty(dayStr))
                {
                    days[dayStr] = True;
                }
            }
        }

        return days.length;
    }

    //filters a dictionary by word
    wordSearchDict(userDict, word)
    {
        

        for(var userI in userDict.keys())
        {
            //search through all messages for each user
            var userMessages = userDict[userI].json["messages"];
            for(var i = 0; i < userMessages.length; i++)
            {
                //remove messages without word
                //      !!!!!currently does not check for lower/uppercase!!!!!
                if(!userMessages[i]["message"].includes(word))
                {
                    userDict[userI].json["messages"].splice(i, 1);
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

        for(var userI in userDict.keys())
        {
            //search through all messages for each user
            var userMessages = userDict[userI].json["messages"];
            for(var i = 0; i < userMessages.length; i++)
            {
                //remove messages not posted on day of date
                if(userMessages[i]["message"].timePosted.toDateString() !== dateString)
                {
                    userDict[userI].json["messages"].splice(i, 1);
                }
            }
        }
        
        return userDict;
    }

    //finds all relevant messages based on restrictions described by user and channel
    filterByUC(server, user, channel)
    {
        var userDict = this.obtainUserInfo(server, user);

        if(channel !== this.nullString)
        {
            for(var userI in userDict.keys())
            {
                //search through all messages for each user
                var userMessages = userDict[userI].json["messages"];
                for(var i = 0; i < userMessages.length; i++)
                {
                    //remove messages not posted in channel
                    if(channel.channelID !== userMessages[i]["channelID"])
                    {
                        userDict[userI].json["messages"].splice(i, 1);
                    }
                }
            }
        }

        return userDict;
    }
>>>>>>> Corey
}

module.exports = {Searcher};