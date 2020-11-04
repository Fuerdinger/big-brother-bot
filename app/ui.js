var menuScript = require("../data/menu.json").menu;

const { User, UserMessage} = require("./user.js");
const { TextChannel, ChannelMessage } = require("./textchannel.js");
const { Server } = require("./server.js");
const { Searcher } = require("./searcher.js");
const server = require("./server.js");
const searcher = require("./searcher.js");

var mySearcher = new Searcher();

class UI
{
    //only needed for when a function was executed and the menu needs to backtrack
    previousMenuPlace = "-1";

    //basically a pointer to the current menu the user is on
    currentMenuPlace = "-1";

    //when looking at a user, this is the user being inspected
    currentUser = null;

    //when looking at a channel, this is the channel being inspected
    currentChannel = null;

    //the server object which owns this object
    parentServer = null;

    //a function can look at this var to see what word it should be searching for
    currentWordArg = "";

    //a function can look at this var to see what word it should be searching for
    currentDateArg = "";

    //this is a temp array for holding multiple users (or channels) if the user picked a username/channelName shared by multiple channels
    currentArrayOptions = [];

    //a function can look at this var to see what integer it should be searching for
    currentIndexArg = 0;

    //the current function being used; this is set if a function can't be called immediately,
    //and requires an arg
    currentFunction = "";

    constructor(server)
    {
        this.parentServer = server;
    }

    //function that indicates whether a user is currently in a menu state for the bot
    isInMenu()
    {
        return this.currentMenuPlace != "-1";
    }

    //public function: user is the person who entered the message, the message is just the string they entered
    passInMessage(user, channel, message)
    {
        //when this function is called, assume that a menu has already been printed out,
        //unless currentMenuPlace = "-1" in which case no interaction has been initiated

        if (this.currentMenuPlace === "-1")
        {
            if (message === "!bb")
            {
                this.currentMenuPlace = "0";
                return this.printMenuOptions();
            }

            return this.runComplexCommand(message);
        }

        //if this is getUser or getChannel, then the inputted message must have been a user name/channel name
        if (this.currentMenuPlace === "getUser")
        {
            var users =  this.parentServer.getUserFromUsername(message);

            //user entered invalid user name
            if (users.length == 0)
            {
                this.currentMenuPlace = "0";
                return "No such user exists.\n" + this.printMenuOptions();
            }

            //more than one user has this username
            if (users.length > 1)
            {
                this.currentMenuPlace = "pickUser";
                this.currentArrayOptions = users;
                var ret = "Multiple users share that name. Pick one."
                for (var i = 0; i < users.length; i++)
                {
                    ret += "\n" + (i + 1) + ". userID = " + users[i].userID;
                }
                return ret;
            }

            this.currentUser = users[0];
            this.currentMenuPlace = menuScript[this.currentMenuPlace]["options"][0]["goto"];

            return this.printMenuOptions();
        }

        if (this.currentMenuPlace === "getChannel")
        {
            var channels = this.parentServer.getChannelFromChannelName(message);

            //user entered an invalid channel name
            if (channels.length == 0)
            {
                this.currentMenuPlace = "0";
                return "No such channel exists.\n" + this.printMenuOptions();
            }

            //more than one channel has this channelName
            if (channels.length > 1)
            {
                this.currentMenuPlace = "pickChannel";
                this.currentArrayOptions = channels;
                var ret = "Multiple channels share that name. Pick one."
                for (var i = 0; i < channels.length; i++)
                {
                    ret += "\n" + (i + 1) + ". channelID = " + channels[i].channelID;
                }
                return ret;
            }

            this.currentChannel = channels[0];
            this.currentMenuPlace = menuScript[this.currentMenuPlace]["options"][0]["goto"];

            return this.printMenuOptions();
        }

        if (this.currentMenuPlace === "pickChannel" || this.currentMenuPlace === "pickUser")
        {
            //in this case, the user entered a number
            var optionNum = parseInt(message);
            
            //if they either didn't enter a number, or entered an invalid range
            if (isNaN(optionNum) || optionNum < 1 || optionNum > this.currentArrayOptions.length)
            {
                return "Bad input, try again.\n";
            }

            if (this.currentMenuPlace === "pickChannel")
            {
                this.currentChannel = this.currentArrayOptions[optionNum - 1];
                this.currentMenuPlace = "channelMenu";
            }
            else
            {
                this.currentUser = this.currentArrayOptions[optionNum - 1];
                this.currentUser = "userMenu";
            }

            return this.printMenuOptions();
        }

        //in this case, a function was called that required this argument
        if (this.currentMenuPlace === "getWord")
        {
            this.currentWordArg = message;
            this.currentMenuPlace = this.previousMenuPlace;
            //run the function and then backtrack to the last menu
            return this.runFunction(this.currentFunction) + "\n" + this.printMenuOptions();
        }
        if (this.currentMenuPlace === "getWords")
        {
            this.currentWordArg = message.split(";");
            this.currentMenuPlace = this.previousMenuPlace;
            //run the function and then backtrack to the last menu
            return this.runFunction(this.currentFunction) + "\n" + this.printMenuOptions();
        }
        if (this.currentMenuPlace == "getRuleIndex")
        {
            this.currentIndexArg = parseInt(message);
            this.currentMenuPlace = this.previousMenuPlace;

            if (isNaN(this.currentIndexArg)) return "Not a number, try again.";
            this.currentIndexArg--;
            //run the function and then backtrack to the last menu
            return this.runFunction(this.currentFunction) + "\n" + this.printMenuOptions();
        }

        //in this case, the user entered a number
        var options = menuScript[this.currentMenuPlace]["options"];
        var optionNum = parseInt(message);
        
        //if they either didn't enter a number, or entered an invalid range
        if (isNaN(optionNum) || optionNum < 1 || optionNum > options.length)
        {
            return "Bad input, try again.\n";
        }

        //subtract 1 to account for the fact that the first option is at index 0
        var option = options[optionNum - 1];
        
        //if the option has a goto, advance to a new menu
        if (option["goto"] != null)
        {
            this.currentMenuPlace = option["goto"];
            return this.printMenuOptions();
        }
        //if the option has a run, either run a function or get an arg to run a function
        else if (option["run"] != null)
        {
            if (option["input"] != null)
            {
                this.previousMenuPlace = this.currentMenuPlace;
                this.currentMenuPlace = option["input"];
                this.currentFunction = option["run"];
                return this.printMenuOptions();
            }
            return this.runFunction(option["run"]) + this.printMenuOptions();
        }
        else
        {
            return "Fatal error with menu.json file!\n";
        }
    }

    printMenuOptions()
    {
        if (this.currentMenuPlace == "-1")
        {
            return "Thank you.";
        }

        var menu = menuScript[this.currentMenuPlace];
        var header = menu["header"];
        var regex = menu["regex"];
        var options = menu["options"];

        if (regex != null)
        {
            var regexObj;
            switch(this.currentMenuPlace)
            {
                case "serverMenu":
                    regexObj = this.parentServer;
                    break;
                case "channelMenu":
                    regexObj = this.currentChannel;
                    break;
                case "userMenu":
                    regexObj = this.currentUser;
                    break;
                case "moderateMenu":
                    regexObj = this.parentServer.moderator;
                    break;
                default:
                    return "Error";
            }

            for (var i = 0; i < regex.length; i++)
            {
                var getter = regexObj["get" + regex[i]]();
                var replacement = getter;
                header = header.replace("%", ""+replacement);
            }
        }
        var ret = "" + header;
        if (options != null)
        {
            for (var i = 0; i < options.length; i++)
            {
                if (options[i]["option"] === "getString")
                {
                    continue;
                }
                ret += "\n" + (i + 1) + ". " + options[i]["option"];
            }
        }

        return ret;
    }
    
    runFunction(functionName)
    {
        var ret = "";
        switch(functionName)
        {
            case "serverHowManyTimesWordUsed":
                return mySearcher.wordSearchLength(this.parentServer, "*", "*", this.currentWordArg);
                break;
            case "serverMostUsedWords":
                return mySearcher.mostUsedWords(this.parentServer, "*", "*");
                break;
            case "serverMostAmountOfPostsMadeInDay":
                return mySearcher.postSearchByDayLengthMax(this.parentServer, "*", "*")
                break;
            case "serverAverageAmountOfPostsInDay":
                return mySearcher.postSearchByDayLengthAverage(this.parentServer, "*", "*");
                break;
            case "serverAllMessagesWhereWordBeenUsed":
                return mySearcher.wordSearch(this.parentServer, "*", "*", this.currentWordArg);
                break;
            case "serverMostRecentMessages":
                return mySearcher.recentMessages(this.parentServer, "*");
                break;
            
            case "channelHowManyTimesWordUsed":
                return mySearcher.wordSearchLength(this.parentServer, "*", this.currentChannel, this.currentWordArg);
                break;
            case "channelAllMessagesWhereWordBeenUsed":
                return mySearcher.wordSearch(this.parentServer, "*", this.currentChannel, this.currentWordArg);
                break;
            case "channelAveragePostsADay":
                return mySearcher.postSearchByDayLengthAverage(this.parentServer, "*", this.currentChannel);
                break;
            case "channelMostAmountOfPostsInADay":
                return mySearcher.postSearchByDayLengthMax(this.parentServer, "*", this.currentChannel);
                break;
            case "channelMostUsedWords":
                return mySearcher.mostUsedWords(this.parentServer, "*", this.currentChannel);
                break;

            case "userHowManyTimesWordUsed":
                return mySearcher.wordSearchLength(this.parentServer, this.currentUser, "*", this.currentWordArg);
                break;
            case "userHowOftenPostInADay":
                return mySearcher.postSearchByDayLengthAverage(this.parentServer, this.currentUser, "*");
                break;
            case "userHowManyTimesBannedFromServer":
                return mySearcher.banSearch(this.parentServer, this.currentUser);
                break;
            case "userMostAmountOfPostsInADay":
                return mySearcher.postSearchByDayLengthMax(this.parentServer, this.currentUser, "*");
                break;
            case "userAllMessagesWhereWordWasUsed":
                return mySearcher.wordSearch(this.parentServer, this.currentUser, "*", this.currentWordArg);
                break;
            case "userMostRecentMessages":
                return mySearcher.recentMessages(this.parentServer, this.currentUser);
                break;
            case "userMostUsedWords":
                return mySearcher.mostUsedWords(this.parentServer, this.currentUser, "*");
                break;

            case "removeRule":
                return this.parentServer.moderator.removeRule(this.currentIndexArg);
                break;
            case "moderateWarnForWord":
                return this.parentServer.moderator.instantiateRule(this.currentWordArg, -1, 1, "*");
                break;
            case "moderateKickForWord":
                return this.parentServer.moderator.instantiateRule(this.currentWordArg, 0, 1, "*");
                break;
            case "moderateKickForWordThreeTimes":
                return this.parentServer.moderator.instantiateRule(this.currentWordArg, 0, 3, "*");;
                break;
            case "moderateBanOneDayForWord":
                return this.parentServer.moderator.instantiateRule(this.currentWordArg, 1, 1, "*");
                break;
            case "moderateBanOneDayForWordThreeTimes":
                return this.parentServer.moderator.instantiateRule(this.currentWordArg, 1, 3, "*");
                break;
            case "moderateBanOneWeekForWord":
                return this.parentServer.moderator.instantiateRule(this.currentWordArg, 7, 1, "*");
                break;
            case "moderateBanOneWeekForWordThreeTimes":
                return this.parentServer.moderator.instantiateRule(this.currentWordArg, 7, 3, "*");
                break;
            case "moderateBanForWord":
                return this.parentServer.moderator.instantiateRule(this.currentWordArg, "*", 1, "*");
                break;
            case "moderateBanForWordThreeTimes":
                return this.parentServer.moderator.instantiateRule(this.currentWordArg, "*", 3, "*");
                break;

            default:
                ret = "error in the menu.json file";
        }
        return ret;
    }

    runComplexCommand(message)
    {
        var separators = [' ', ',', '(', ')', '!bb'];
        var words = message.split(/[(), ]/);

        if (message.includes("!bb help"))
        {
            return mySearcher.help();
        }

        var funcName = words[1];
        if (!(this.complexMap.hasOwnProperty(funcName)))
        {
            return "Not a valid function name. Type \"!bb help\" to see all functions.";
        }

        var argTypes = this.complexMap[funcName];
        var args = [];

        var i = 0;
        for (var x = 2; x < words.length; x++)
        {
            if (words[x].length == 0) continue;

            if (words[x] === "*")
            {
               args.push("*");
               continue;
            }

            switch (argTypes[i])
            {
                case "user":
                    var users = this.parentServer.getUserFromUsername(words[x]);
                    if (users.length == 0) return "Invalid user.";
                    args.push(users[0]);
                    break;
                case "channel":
                    var channels = this.parentServer.getChannelFromChannelName(words[x]);
                    if (channels.length == 0) return "Invalid channel.";
                    args.push(channels[0]);
                    break;
                case "word":
                    args.push(words[x]);
                    break;
                case "day":
                    var parts = words[x].split('-');
                    args.push(new Date(parts[0], parts[1] - 1, parts[2])); 
                    break;
                case "wordArray":
                    args.push(words[x].split(";"));
                    break;
                case "int":
                    if (isNaN(parseInt(words[x])))
                    {
                        return "Invalid number \"" + words[x] + "\".";
                    }
                    args.push(parseInt(words[x]));
                    break;
            }

            i++;
        }

        var ret;

        if (funcName === "instantiateRule")
        {
            ret = this.parentServer.moderator[funcName](args[0], args[1], args[2], args[3]);
        }
        else
        {
            switch (argTypes.length)
            {
                case 1:
                    ret = mySearcher[funcName](this.parentServer, args[0]);
                    break;
                case 2:
                    ret = mySearcher[funcName](this.parentServer, args[0], args[1]);
                    break;
                case 3:
                    ret = mySearcher[funcName](this.parentServer, args[0], args[1], args[2]);
                    break;
                case 4:
                    ret = mySearcher[funcName](this.parentServer, args[0], args[1], args[2], args[3]);
                    break;
            }
        }

        return ret;
    }

    complexMap = 
    {
        "wordSearch": ["user", "channel", "word"],
        "wordSearchLength": ["user", "channel", "word"],
        "postSearchByDay": ["user", "channel", "day"],
        "postSearchByDayLength": ["user", "channel", "day"],
        "postSearchByDayLengthAverage": ["user", "channel"],
        "postSearchByDayLengthMax": ["user", "channel"],
        "banSearch": ["user"],
        "recentMessages": ["user"],
        "mostUsedWords": ["user", "channel"],
        "instantiateRule": ["wordArray", "int", "int", "int"]
    }

    //add rule for "instantiateRule": [bannedWords, punishmentLength, numberOfTimes, resetFrequency]
    //wordArray, int, int, int
    //also, do the resetFrequency thing

    //all other functions are private


    //UI will have functions for displaying the menus
    //the messages will be given to it from bigbrothermanager
    //ui class will have to maintain internal state so it knows what menu the user is currently using
    //look at discord.js, it has a templated way of doing menus that we could use 


}


module.exports = {UI};