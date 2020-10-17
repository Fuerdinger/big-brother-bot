var menuScript = require("../data/menu.json").menu;

const { User, UserMessage} = require("./user.js");
const { TextChannel, ChannelMessage } = require("./textchannel.js");
const { Server } = require("./server.js");

class UI
{
    currentMenuPlace = "-1";
    currentUser = null;
    currentChannel = null;

    constructor()
    {

    }

    //public function
    passInMessage(server, user, message)
    {
        //when this function is called, assume that a menu has already been printed out,
        //unless currentMenuPlace = "-1" in which case no interaction has been initiated

        if (this.currentMenuPlace === "-1")
        {
            this.currentMenuPlace = "0";
            return this.printMenuOptions();
        }

        //if this is getUser or getChannel, we want string input vs. a number
        if (this.currentMenuPlace === "getUser")
        {
            
        }

        if (this.currentMenuPlace === "getChannel")
        {

        }

        var options = menuScript[this.currentMenuPlace]["options"];
        var optionNum = parseInt(message);
        
        if (isNaN(optionNum) || optionNum < 1 || optionNum > options.length)
        {
            return "Bad input, try again.\n";
        }

        var option = options[optionNum];
        
        if (option.contains("goto"))
        {
            this.currentMenuPlace = option["goto"];
            return this.printMenuOptions();
        }
        else if (option.contains("run"))
        {

        }
    }

    printMenuOptions()
    {
        var menu = menuScript[this.currentMenuPlace];
        var header = menu["header"];
        var regex = menu["regex"];
        var options = menu["options"];

        var ret = "" + header;
        if (regex != null)
        {
            for (var i = 0; i < regex.length; i++)
            {
                header = header.replace("%", regex[i]);
            }
        }
        if (options != null)
        {
            for (var i = 0; i < options.length; i++)
            {
                if (options[i]["option"] === "getString")
                {
                    continue;
                }
                header += "\n" + (i + 1) + ". " + options[i]["option"];
            }
        }

        return ret;
    }

    serverHowManyTimesWordUsed(server, user, message)
    {

    }
     
    //all other functions are private


    //UI will have functions for displaying the menus
    //the messages will be given to it from bigbrothermanager
    //ui class will have to maintain internal state so it knows what menu the user is currently using
    //look at discord.js, it has a templated way of doing menus that we could use 


}


module.exports = {UI};