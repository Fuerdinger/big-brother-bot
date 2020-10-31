class ModerationRule
{
    bannedWord = "";
    punishmentLength = Infinity; //kick for x number of days, Infinity means it is a ban, 0 means it is always a warning
    numberOfTimes = 1; //number of times the word must be said for the punishment
    resetFrequency = Infinity; //how many hours often should the counter reset itself (24 = reset once a day), Infinity = never reset

    counter = 0; //currently, the counter is global

    constructor(bannedWord, punishmentLength, numberOfTimes, resetFrequency)
    {
        this.bannedWord = bannedWord;

        if (punishmentLength == "*") this.punishmentLength = Infinity;
        else this.punishmentLength = punishmentLength;

        this.numberOfTimes = numberOfTimes;

        if (resetFrequency == "*") this.resetFrequency = Infinity;
        else this.resetFrequency = resetFrequency;
    }

    convertToString()
    {
        var ret = "Using the word \"" + this.bannedWord + "\" " + this.numberOfTimes + " time(s) will result ";
        ret += "in a ";

        if (this.punishmentLength == Infinity) ret += "ban. ";
        else if (this.punishmentLength == 0) ret += "warning. ";
        else ret += "kick for " + this.punishmentLength + " day(s). ";
        
        if (this.numberOfTimes != 1)
        {
            ret += "The rule has been violated " + this.counter + " time(s)";
            if (this.resetFrequency != Infinity) ret += " in the current " + this.resetFrequency + " hour cycle.";
            else ret += ".";
        }

        return ret;
    }
}

class Moderator
{
    moderationRules = [];
    //assume that for our moderation rules, only 1 rule can exist for a particular word

    constructor()
    {

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

    instantiateRule(bannedWord, punishmentLength, numberOfTimes, resetFrequency)
    {
        for (var i = 0; i < this.moderationRules.length; i++)
        {
            if (this.moderationRules[i].bannedWord === bannedWord)
            {
                return "A rule already exists for handling that word.";
            }
        }

        this.moderationRules.push(new ModerationRule(bannedWord, punishmentLength, numberOfTimes, resetFrequency));
        return "Rule created.";
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
        if (this.moderationRules.length == 0) return "No rule counters to reset.";
        if (isNaN(ruleIndex)) return "Not a number, try again.";
        if (ruleIndex < 0 || ruleIndex >= this.moderationRules.length) return "Invalid rule number.";

        this.moderationRules[ruleIndex].counter = 0;
        return "Counter reset.";
    }

    receiveMessage(message)
    {
        var ruleToApply = null;
        var ret = "";

        for (var i = 0; i < this.moderationRules.length; i++)
        {
            var currentRule = this.moderationRules[i];
            if (message.includes(currentRule.bannedWord, 0))
            {
                if (currentRule.punishmentLength == 0) ret += this.applyRule(currentRule);
                else if (ruleToApply != null) ruleToApply = this.compareRules(ruleToApply, currentRule);
                else ruleToApply = currentRule;
            }
        }

        if (ruleToApply == null) return ret;
        return ret + this.applyRule(ruleToApply);
    }

    applyRule(rule)
    {
        rule.counter++;
        var ruleString = rule.convertToString();
        
        if (rule.counter >= rule.numberOfTimes)
        {
            rule.counter = 0;
            return "ACTIVATED: " + ruleString;
        }

        return ruleString;
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