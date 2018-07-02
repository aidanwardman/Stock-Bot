var Discord = require('discord.io');
var auth = require('./credentials.json');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function() {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function(user, userID, channelID, message, event) {
	var rxp = new RegExp(/^(asx:)[a-z0-9]{3}/);
	if (rxp.test(message)){
		var market = message.substr(0,3).toUpperCase();
		var code = message.substr(4,3).toUpperCase();
		var url = "https://finance.google.com/finance/getprices?p=1d&i=60&x=ASX&f=c&q="+code;
		console.log(url);
		scrape(url,channelID,code,market);
	}
});

function scrape(url,channelID,code,market){
    request(url, function(error, response, html){
		console.log('error:', error); // Print the error if one occurred
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        if(!error){
            var rows = html.split(/\r?\n/);
			var price = market+":"+code+" - $"+rows[rows.length - 2];
			console.log("Price: "+price);
			bot.sendMessage({
				to: channelID,
				message: price
			});
        }else{
			bot.sendMessage({
				to: channelID,
				message: "Failed to get price"
			});
		}
	});
}