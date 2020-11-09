const { existsSync } = require("fs");

class ModerationRule
{
    bannedWords = [];
    punishmentLength = Infinity; //kick for x number of days
    //punishmentLength = -1 means it is a warning
    //punishmentLength = 0 means it is a kick
    //punishmentLength > 0 or infinity means it is a ban

    numberOfTimes = 1; //number of times the word must be said for the punishment
    resetFrequency = Infinity; //how often should the counter reset itself (1 = reset once a day), Infinity = never reset

    counterMap = {};

    constructor(parentModerator, bannedWords, punishmentLength, numberOfTimes, resetFrequency)
    {
        if (parentModerator == null) return;

        this.bannedWords = bannedWords;

        if (punishmentLength === "*") this.punishmentLength = Infinity;
        else this.punishmentLength = punishmentLength;

        this.numberOfTimes = numberOfTimes;

        if (resetFrequency === "*") this.resetFrequency = Infinity;
        else
        {
            this.resetFrequency = resetFrequency;
            if (this.resetFrequency != -1 && this.resetFrequency != 0)
            {
                this.resetCounter();
            }
        }
    }

    readFromFile(jsonObj)
    {
        this.bannedWords = jsonObj["bannedWords"];
        this.numberOfTimes = jsonObj["numberOfTimes"];
        if (jsonObj["punishmentLength"] == null) this.punishmentLength = Infinity;
        else this.punishmentLength = jsonObj["punishmentLength"];
        if (jsonObj["resetFrequency"] == null) this.resetFrequency = Infinity;
        else this.resetFrequency = jsonObj["resetFrequency"];
    }

    resetCounter()
    {
        for (const key in this.counterMap)
        {
            this.counterMap[key] = 0;
        }

        setTimeout(() => this.resetCounter, this.resetFrequency * 24 * 60 * 60 * 1000);
    }

    convertToString()
    {
        var ret = "Using the word(s) ";
        for (var i = 0; i < this.bannedWords.length; i++)
        {
            ret += "\"" + this.bannedWords[i] + "\", "
        }

        ret += this.numberOfTimes + " time(s) will result in a ";

        if (this.punishmentLength == -1) ret += "warning. ";
        else if (this.punishmentLength == 0) ret += "kick. ";
        else if (this.punishmentLength == Infinity) ret += "ban. ";
        else ret += "ban for " + this.punishmentLength + " day(s). ";
        
        /* No longer lists how many times the rule has been violated.
        if (this.numberOfTimes != 1)
        {
            ret += "The rule has been violated " + this.counter + " time(s)";
            if (this.resetFrequency != Infinity) ret += " in the current " + this.resetFrequency + " day cycle.";
            else ret += ".";
        }
        */

        return ret;
    }
}

class Moderator
{
    parentServer = null;
    moderationRules = [];
    //assume that for our moderation rules, only 1 rule can exist for a particular word

    constructor(parentServer)
    {
        this.parentServer = parentServer;
    }

    getRules()
    {
        if (this.moderationRules.length == 0) return "No rules currently in place.\n";

        var ret = "";
        for (var i = 0; i < this.moderationRules.length; i++)
        {
            ret += "" + (i+1) + ". " + this.moderationRules[i].convertToString() + "\n";
        }
        return ret;
    }

    instantiateRule(bannedWords, punishmentLength, numberOfTimes, resetFrequency)
    {
        if (bannedWords === "*") return "Argument \"*\" not valid for specifying bannable words.";
        for (var i = 0; i < bannedWords.length; i++)
        {
            if (bannedWords[i] === "") return "An empty string is not an acceptable bannable word.";
        }
        if (punishmentLength !== "*" && (punishmentLength > 21 || punishmentLength < -1))
        {
            return "A punishment must be a ban between 1-21 days, or be 0 for a kick, -1 for a warning, or * for an indefinite ban.";
        }
        if (resetFrequency !== "*" && (resetFrequency > 21 || resetFrequency < 1))
        {
            return "The counter reset frequency must be between 1-21 days, or be * for no reset.";
        }
        if (numberOfTimes === "*" || numberOfTimes < 1 || numberOfTimes > 20)
        {
            return "The number of times the words must be said for a punishment to occur must be between 1 and 20.";
        }

        for (var i = 0; i < this.moderationRules.length; i++)
        {
            for (var j = 0; j < this.moderationRules[i].bannedWords.length; j++)
            {
                //compare every word moderated against each of the words which the user just input
                for (var k = 0; k < bannedWords.length; k++)
                {
                    if (bannedWords[k] === this.moderationRules[i].bannedWords[j])
                    {
                        return "A rule already exists to moderate the word \"" + bannedWords[k] + "\".";
                    }
                }
            }
        }

        var newRule = new ModerationRule(this, bannedWords, punishmentLength, numberOfTimes, resetFrequency);
        this.moderationRules.push(newRule);
        return "Rule created: " + newRule.convertToString();
    }

    addExistingRule(jsonObj)
    {
        var existingRule = new ModerationRule(null);
        existingRule.readFromFile(jsonObj);
        this.moderationRules.push(existingRule);
    }

    removeRule(ruleIndex)
    {
        if (this.moderationRules.length == 0) return "No rules to remove.";
        if (isNaN(ruleIndex)) return "Not a number, try again.";
        if (ruleIndex < 0 || ruleIndex >= this.moderationRules.length) return "Invalid rule number.";

        this.moderationRules.splice(ruleIndex, 1);
        return "Rule removed.";
    }

    removeAllRules()
    {
        if (this.moderationRules.length == 0) return "No rules to clear.";
        this.moderationRules.splice(0, this.moderationRules.length);
        return "All rules cleared.";
    }

    resetCounter(ruleIndex)
    {
        /*  Not called by anyone
        if (this.moderationRules.length == 0) return "No rule counters to reset.";
        if (isNaN(ruleIndex)) return "Not a number, try again.";
        if (ruleIndex < 0 || ruleIndex >= this.moderationRules.length) return "Invalid rule number.";
        for (var i = 0; i < this.moderationRules[ruleIndex].counterMap.)
        this.moderationRules[ruleIndex].counter = 0;
        return "Counter reset.";
        */
    }

    receiveMessage(message)
    {
        var messageContent = message.content;
        var ruleToApply = null;
        var ret = "";

        for (var i = 0; i < this.moderationRules.length; i++)
        {
            var currentRule = this.moderationRules[i];
            for (var j = 0; j < currentRule.bannedWords.length; j++)
            {
                if (messageContent.includes(currentRule.bannedWords[j], 0))
                {
                    if (currentRule.punishmentLength == 0) ret += this.applyRule(currentRule, message);
                    else if (ruleToApply != null) ruleToApply = this.compareRules(ruleToApply, currentRule);
                    else ruleToApply = currentRule;
                    break; //because one of the words has been satisfied, leave the loop over the rule's words
                }
            }
        }

        if (ruleToApply == null) return ret;
        return ret + this.applyRule(ruleToApply, message);
    }

    applyRule(rule, message)
    {
        if (rule.counterMap.hasOwnProperty(message.member.user.id) == false)
        {
            rule.counterMap[message.member.user.id] = 0;
        }
        rule.counterMap[message.member.user.id] += 1;

        var ruleString = rule.convertToString() + rule.counterMap[message.member.user.id] + " / " + rule.numberOfTimes;
        
        if (rule.counterMap[message.member.user.id] >= rule.numberOfTimes)
        {
            rule.counterMap[message.member.user.id] = 0;
            
            //ban for indefinite amount of time (normal discord ban)
            if (rule.punishmentLength == Infinity)
            {
                //the person must be bannable, and if they have the ability to ban other people, they will not be banned
                if (message.member.bannable == true && !message.member.hasPermission(4)) //4 is for BAN_MEMBERS
                {
                    message.member.ban({"reason": ruleString});
                }
                else
                {
                    return "Unable to ban member for: " + ruleString + "\nEither I do not have permission to ban members, or the offender has immunity.";
                }
            }
            //ban for some amount of time
            else if (rule.punishmentLength > 0)
            {
                //the person must be bannable, and if they have the ability to ban other people, they will not be banned
                if (message.member.bannable == true && !message.member.hasPermission(4)) //4 is for BAN_MEMBERS
                {
                    message.member.ban({"reason": ruleString});
                    setTimeout(() => {this.unbanMember(message.guild, message.member.id);}, rule.punishmentLength * 24 * 60 * 60 * 1000);
                }
                else
                {
                    return "Unable to ban member for: " + ruleString + "\nEither I do not have permission to ban members, or the offender has immunity.";
                }
            }
            //kick
            else if (rule.punishmentLength == 0)
            {
                //the person must be kickable, and if they have the ability to kick other people, they will not be kick
                if (message.member.kickable == true && !message.member.hasPermission(2)) //2 is for KICK_MEMBERS
                {
                    message.member.kick(ruleString);
                }
                else
                {
                    return "Unable to ban member for: " + ruleString + "\nEither I do not have permission to kick members, or the offender has immunity.";
                }
            }
            //rule.punishmentLength == -1 aka warning; nothing happens
            else
            {

            }
            return "ACTIVATED: " + ruleString;
        }

        return ruleString;
    }

    unbanMember(guild, guildMember)
    {
        guild.members.unban(guildMember);
    }

    compareRules(rule1, rule2)
    {
        if (rule1.punishmentLength == Infinity) return rule1;
        if (rule2.punishmentLength == Infinity) return rule2;
        if (rule1.punishmentLength > rule2.punishmentLength) return rule1;
        if (rule2.punishmentLength > rule1.punishmentLength) return rule2;
        return rule1; //for a tie, just return rule 1
    }
}

module.exports = {Moderator};