class Searcher
{
    //all of these functions will return strings

    constructor() {}

    help(server)
    {
        return "calling help";
    }
    //<this lists out all the different commands>

    wordSearch(server, user, channel, word)
    {
        return "calling wordSearch";
    }
    //would print out all messages made by a user in a particular channel where they used a certain word
    //you can pass in an * for user and channel to specify that you want to see all users and all channels

    wordSearchLength(server, user, channel, word)
    {
        return "calling wordSearchLength";
    }
    //do the same thing as above, but instead of printing out the messages, prints out the number of messages

    postSearchByDay(server, user, channel, day)
    {
        return "calling postSearchByDay";
    }
    //print out all the posts made by a user in a particular channel in a certain day

    postSearchByDayLength(server, user, channel, day)
    {
        return "calling postSearchByDayLength";
    }
    //same thing as above, but it does length instead

    postSearchByDayLengthAverage(server, user, channel)
    {
        return "calling postSearchByDayLengthAverage";
    }
    //same thing as above, but it computes it for every day and takes the average of all of them

    postSearchByDayLengthMax(server, user, channel)
    {
        return "calling postSearchByDayLengthMax";
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
        return "calling recentMessages";
    }
    //prints the most recent messages made by a user (do 10 for now)
    //pass in * for the user to see for all users, server wide

    mostUsedWords(server, user, channel)
    {
        return "calling mostUsedWords";
    }
    //prints out the most used words by a user for a channel
    //* can be passed in for user and channel

}

module.exports = {Searcher};