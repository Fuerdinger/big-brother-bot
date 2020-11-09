const Discord = require('discord.js');
const { token, clientID } = require('./config.json');

const client = new Discord.Client();

let index = 0;
let caseIndex = 0;
let prevdata = '';

client.once('ready', () => {
    // https://discord.com/oauth2/authorize?client_id=772522133510553600&scope=bot
    console.log('Ready!');
    // console.log("Current server: " + (client.guilds.cache).get('775081447723630593'));
    // console.log("Current channel: " + channel);

    var channel = (client.channels.cache).get('775081447723630596');
    // caseIndex = 4;   
    // currCase = useCase4;

    // console.log('Case ' + caseIndex);
    
    // // send !bb
    // channel.send(currCase[index]);

    execute(channel);

});

const delay = ms => new Promise(res => setTimeout(res, ms));

const execute = async (channel) => {
    case1(channel);
    await delay(5000);
    case2(channel);
    // await delay(5000);
    // case3(channel);
    // await delay(8000);
    // case4(channel);
};

// Get user's menu and exit
function case0(channel) {
    var useCase0 = ['!bb', '4'];

    caseIndex = 0;   
    currCase = useCase0;

    console.log('Case ' + caseIndex);
    
    // send !bb
    channel.send(currCase[index]); 

    client.on('raw', raw => {
        var data = (raw.d.content);
        var author = raw.d.author;
        if (author.id == '754512408633933875') {
            // Check response and continue sending message if response is correct
            checkMessage(data);
            sendResponse(currCase, channel);
        }
    });
}

// Get user's menu and exit
function case1(channel) {
    var useCase1 = ['!bb', '3', '7', '4'];

    caseIndex = 1;   
    currCase = useCase1;

    console.log('Case ' + caseIndex);
    
    // send !bb
    channel.send(currCase[index]); 

    client.on('raw', raw => {
        var data = (raw.d.content);
        var author = raw.d.author;
        if (author.id == '754512408633933875') {
            // Check response and continue sending message if response is correct
            checkMessage(data);
            sendResponse(currCase, channel);
        }
    });
}

// Get server's menu and exit
const case2 = async (channel) =>  {
    var useCase2 = ['!bb', '1', 'phungngo1020#2170', '8', '4'];

    caseIndex = 2;   
    currCase = useCase2;

    console.log('Case ' + caseIndex);
    
    // send !bb
    channel.send(currCase[index]); 

    client.on('raw', raw => {
        var data = (raw.d.content);
        var author = raw.d.author;
        if (author.id == '754512408633933875' && data != prevdata) {
            // console.log('index = ' + index);
            // console.log(data == prevdata)
            // console.log('data: ' + data);
            // console.log('prevdata: ' + prevdata);
            // Check response and continue sending message if response is correct
            checkMessage(data);
            prevdata = data;
            await delay(2000);
            sendResponse(currCase, channel);
        }
    });
}

// Show all the messages where user phungngo1020#2170 have used the word 'hi'
function case3(channel) {
    var useCase3 = ['!bb', '1', 'phungngo1020#2170', '5', 'hi', '8', '4'];

    caseIndex = 3;   
    currCase = useCase3;

    console.log('Case ' + caseIndex);
    
    // send !bb
    channel.send(currCase[index]); 


    client.on('raw', raw => {
        var data = (raw.d.content);
        var author = raw.d.author;
        if(author.id == '754512408633933875') {
            // Check response and continue sending message if response is correct
            checkMessage(data);
            sendResponse(currCase, channel);
        }
    });

}

// Show all the messages where the word 'hi' was used
function case4(channel) {
    var useCase4 = ['!bb', '3', '5', 'hi', '7', '4'];

    caseIndex = 4;   
    currCase = useCase4;

    console.log('Case ' + caseIndex);
    
    // send !bb
    channel.send(currCase[index]); 

    client.on('raw', raw => {
        var data = (raw.d.content);
        var author = raw.d.author;
        console.log('data index = ' + index);
        if(author.id == '754512408633933875') {
            // Check response and continue sending message if response is correct
            checkMessage(data);
            sendResponse(currCase, channel);
        }
    });
}

  


function sendResponse(currCase, channel) {
    index++;
    if(index > 0 && currCase[index] != undefined){
        channel.send(currCase[index]);
        return;
    } else {
        index = 0;
        return;
    }
    return;
}

function checkMessage(data) {
    // Store constants for long responses
    const menu1 = 
    `What do you want to do?`;

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
    useCaseResult4.push("Server name:");
    useCaseResult4.push("What's the word?");
    useCaseResult4.push(`Messages containing "hi" from all users in all channels:`);
    useCaseResult4.push(menu1);
    useCaseResult4.push('Thank you.');

    let caseResults = [];
    caseResults.push(useCaseResult0, useCaseResult1, useCaseResult2, useCaseResult3, useCaseResult4);

    let currResult = caseResults[caseIndex];

    // Check if Bot's response is the same as Use Case
    if(data.includes(currResult[index])) {
        console.log('index = ' + index);
        console.log('Correct');
        console.log('Response: ' + data);
        // console.log('Expected: ' + currResult[index] + '\n');
        console.log('\n');
    } else {
        console.log('index = ' + index);
        console.log('Incorrect');
        console.log('Response: ' + data);
        console.log('Expected: ' + currResult[index] + '\n');
        console.log('\n');
    }
}

client.login(token);