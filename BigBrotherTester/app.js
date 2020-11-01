const Discord = require('discord.js');
const { token, clientID } = require('./config.json');

const client = new Discord.Client();

let index = 0;
let caseIndex = 0;

client.once('ready', () => {
    console.log('Ready!');
    var channel = (client.channels.cache).get('754823138747088922');
    channel1 = channel;

    // Tested - Return correct result
    // Get menu and exit
    var useCase0 = ['!bb', '4'];

    // Tested - Return correct result
    // Get user's menu and exit
    var useCase1 = ['!bb', '3', '7', '4'];

    // Tested - Return correct result
    // Get server's menu and exit
    var useCase2 = ['!bb', '1', 'phungngo1020#2170', '8', '4'];

    // Tested - Return correct result
    // Show all the messages where user phungngo1020#2170 have used the word 'hi'
    var useCase3 = ['!bb', '1', 'phungngo1020#2170', '5', 'hi', '8', '4'];

    // Tested - Didn't return all the messages containing "hi"
    // Number of messages in server: 0
    // Show all the messages where the word 'hi' was used
    var useCase4 = ['!bb', '3', '5', 'hi', '7', '4'];

    caseIndex = 4;   
    currCase = useCase4;

    console.log('Case ' + caseIndex);
    
    // send !bb
    channel.send(currCase[index]); 

    // Upon receiving a response
    client.on('raw', raw => {
        var data = (raw.d.content);
        var author = raw.d.author;
        if(author.id == '754512408633933875') {
            // Check response and continue sending message if response is correct
            checkMessage(data);
            sendResponse(currCase, channel);
        }
    });
});

function sendResponse(currCase, channel) {
    index++;
    if(currCase[index] != undefined){
        channel.send(currCase[index]);
    } else {
        index = 0;
    }
}

function checkMessage(data) {
    // Store constants for long responses
    const menu1 = 
    `What do you want to do?
1. Show me data for a user.
2. Show me data for a channel.
3. Show me data for the whole server.
4. Exit.`;

    // !bb, 4
    let useCaseResult0 = [];
    useCaseResult0.push(menu1);
    useCaseResult0.push('Thank you.');

    // Show me data for the whole server
    // !bb, 3, 7, 4
    let useCaseResult1 = [];
    useCaseResult1.push(menu1);
    useCaseResult1.push('Server name:');
    useCaseResult1.push(menu1);
    useCaseResult1.push('Thank you.');

    // Show me data for a user
    // !bb, 1, phungngo1020#2170, 8, 4
    let useCaseResult2 = [];
    useCaseResult2.push(menu1);
    useCaseResult2.push("What is the user's username? (ex. JohnDoe#5231)");
    useCaseResult2.push("Username:");
    useCaseResult2.push(menu1);
    useCaseResult2.push('Thank you.');

    // Show all the messages where user phungngo1020#2170 have used the word 'hi'
    // !bb, 1, phungngo1020#2170, 5, hi, 8, 4
    let useCaseResult3 = [];
    useCaseResult3.push(menu1);
    useCaseResult3.push("What is the user's username? (ex. JohnDoe#5231)");
    useCaseResult3.push(`Username: phungngo1020#2170
Number of messages they've made:`);
    useCaseResult3.push("What's the word?");
    useCaseResult3.push(`Messages containing "hi" from phungngo1020#2170 in all channels:`);
    useCaseResult3.push(menu1);
    useCaseResult3.push('Thank you.')

    // Show all the messages where the word 'hi' was used
    // !bb, 3, 5, hi, 7, 4
    let useCaseResult4 = [];
    useCaseResult4.push(menu1);
    useCaseResult4.push("Number of messages in server:");
    useCaseResult4.push("What's the word?");
    useCaseResult4.push(`Messages containing "hi" from all users in all channels:`);
    useCaseResult4.push(menu1);
    useCaseResult4.push('Thank you.');

    let caseResults = [];
    caseResults.push(useCaseResult0, useCaseResult1, useCaseResult2, useCaseResult3, useCaseResult4);

    let currResult = caseResults[caseIndex];

    // Check if Bot's response is the same as Use Case
    if(data.includes(currResult[index])) {
        console.log('Correct\n');
    } else {
        console.log('Incorrect');
        console.log('Response: ' + data);
        console.log('Expected: ' + currResult[index] + '\n');
    }
}

client.login(token);