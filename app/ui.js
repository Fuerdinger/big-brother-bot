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
    passInMessage(user, message)
    {
        //when this function is called, assume that a menu has already been printed out,
        //unless currentMenuPlace = "-1" in which case no interaction has been initiated

        if (this.currentMenuPlace === "-1")
        {
            this.currentMenuPlace = "0";
            return this.printMenuOptions();
        }

        //if this is getUser or getChannel, then the inputted message must have been a user name/channel name
        if (this.currentMenuPlace === "getUser")
        {
            var ret = "";
            this.currentUser = this.parentServer.users.get(message);

            //user entered invalid user name
            if (this.currentUser == null)
            {
                this.currentMenuPlace = "0";
                ret = "No such user exists.\n";
            }

            else
            {
                this.currentMenuPlace = menuScript[this.currentMenuPlace]["options"][0]["goto"];
            }

            return ret + this.printMenuOptions();
        }

        if (this.currentMenuPlace === "getChannel")
        {
            var ret = "";
            this.currentChannel = this.parentServer.textChannels.get(message);

            //user entered an invalid channel name
            if (this.currentChannel == null)
            {
                this.currentMenuPlace = "0";
                ret = "No such channel exists.\n";
            }

            else
            {
                this.currentMenuPlace = menuScript[this.currentMenuPlace]["options"][0]["goto"];
            }

            return ret + this.printMenuOptions();
        }

        //in this case, a function was called that required this argument
        if (this.currentMenuPlace === "getWord")
        {
            this.currentWordArg = message;
            this.currentMenuPlace = this.previousMenuPlace;
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
                default:
                    return "Error";
            }

            for (var i = 0; i < regex.length; i++)
            {
                var getter = regexObj["get" + regex[i]]();
                var replacement = getter
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
                return mySearcher.wordSearchLength(this.parentServer, this.currentChannel, "*", this.currentWordArg);
                break;
            case "channelAllMessagesWhereWordBeenUsed":
                return mySearcher.wordSearch(this.parentServer, this.currentChannel, "*", this.currentWordArg);
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

            default:
                ret = "error in the menu.json file";
        }
        return ret;
    }

    //all other functions are private


    //UI will have functions for displaying the menus
    //the messages will be given to it from bigbrothermanager
    //ui class will have to maintain internal state so it knows what menu the user is currently using
    //look at discord.js, it has a templated way of doing menus that we could use 


}


module.exports = {UI};