const Discord = require('discord.js');
const { token, clientID } = require('./config.json');

const client = new Discord.Client();

let caseIndex = 1;

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.content === '!Run BigBrotherTester') {
        // var channel = client.channels.cache.find(channel => channel.name === 'general' && channel.type === 'text');
        // console.log(channel.guild);
        useCases(message.channel);
    }
})

function sendMessage(channel, message) {
	return new Promise(resolve => {
        channel.send(message);
        setTimeout(() => resolve('Use case ' + caseIndex + ' finished'), 2000);
	});
}

//
var useCase1 = ['!bb', '3', '7', '5'];
// var useCase1 = ['hi', 'hi', 'a', 'b'];
let useCaseResult1 = [];
useCaseResult1.push(`What do you want to do?`);
useCaseResult1.push('Server name:');
useCaseResult1.push(`What do you want to do?`);
useCaseResult1.push('Thank you.');

var useCase2 = ['!bb', '1', 'Big Brother Tester#1288', '7', '5'];
// var useCase2 = ['a', 'b', 'c', 'd', 'e'];
let useCaseResult2 = [];
useCaseResult2.push(`What do you want to do?`);
useCaseResult2.push("What is the user's username? (ex. JohnDoe#5231)");
useCaseResult2.push("Username: Big Brother Tester#1288");
useCaseResult2.push(`What do you want to do?`);
useCaseResult2.push('Thank you.');

var useCase3 = ['!bb', '1', 'Big Brother Tester#1288', '4', 'hi', '7', '5'];
// var useCase3 = ['1', '2', '3', '4', '5', '6', '7'];
let useCaseResult3 = [];
useCaseResult3.push(`What do you want to do?`);
useCaseResult3.push("What is the user's username? (ex. JohnDoe#5231)");
useCaseResult3.push(`Username: Big Brother Tester#1288
Number of messages they've made:`);
useCaseResult3.push("What's the word?");
useCaseResult3.push(`Messages containing "hi" from Big Brother Tester#1288 in all channels:`);
useCaseResult3.push(`What do you want to do?`);
useCaseResult3.push('Thank you.');

var useCase4 = ['!bb', '3', '5', 'hi', '7', '5'];
let useCaseResult4 = [];
useCaseResult4.push(`What do you want to do?`);
useCaseResult4.push("Server name:");
useCaseResult4.push("What's the word?");
useCaseResult4.push(`Messages containing "hi" from all users in all channels:`);
useCaseResult4.push(`What do you want to do?`);
useCaseResult4.push('Thank you.');

let index1 = 0;
let index2 = 0;
let index3 = 0;
let index4 = 0;
function useCases(channel) {
    client.on('raw', raw => {
        var data = (raw.d.content);
        var author = raw.d.author;
        if (author.id == '754512408633933875') {
            if (caseIndex == 1) {
                if(data.includes(useCaseResult1[index1])) {
                    console.log(index1 + ' correct');
                }
                index1++;
            }
            if (caseIndex == 2) {
                if(data.includes(useCaseResult2[index2])) {
                    console.log(index2 + ' correct');
                }
                index2++;
            }
            if (caseIndex == 3) {
                if(data.includes(useCaseResult3[index3])) {
                    console.log(index3 + ' correct');
                }
                index3++;
            }
            if (caseIndex == 4) {
                if(data.includes(useCaseResult4[index4])) {
                    console.log(index4 + ' correct');
                }
                index4++;
            }
        }
    });
    sendMessage(channel, useCase1[index1]).then(value => {
    sendMessage(channel, useCase1[index1]).then(value => {
    sendMessage(channel, useCase1[index1]).then(value => {
    sendMessage(channel, useCase1[index1]).then(value => {
        caseIndex++;
        console.log(value);
    sendMessage(channel, useCase2[index2]).then(value => {
    sendMessage(channel, useCase2[index2]).then(value => {
    sendMessage(channel, useCase2[index2]).then(value => {
    sendMessage(channel, useCase2[index2]).then(value => {
    sendMessage(channel, useCase2[index2]).then(value => {
        caseIndex++;
        console.log(value);
    sendMessage(channel, useCase3[index3]).then(value => {
    sendMessage(channel, useCase3[index3]).then(value => {
    sendMessage(channel, useCase3[index3]).then(value => {
    sendMessage(channel, useCase3[index3]).then(value => {
    sendMessage(channel, useCase3[index3]).then(value => {
    sendMessage(channel, useCase3[index3]).then(value => {
    sendMessage(channel, useCase3[index3]).then(value => {
        caseIndex++;
        console.log(value);
    sendMessage(channel, useCase4[index4]).then(value => {
    sendMessage(channel, useCase4[index4]).then(value => {
    sendMessage(channel, useCase4[index4]).then(value => {
    sendMessage(channel, useCase4[index4]).then(value => {
    sendMessage(channel, useCase4[index4]).then(value => {
    sendMessage(channel, useCase4[index4]).then(value => {
        caseIndex++;
        console.log(value);
    });});});});});});
    });});});});});});});
    });});});});});});});});
    }).catch(error => {
        console.log(error);
    });
}


client.login(token);