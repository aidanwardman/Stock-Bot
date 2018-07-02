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
		var market = message.substr(0,3);
		var code = message.substr(4,3).toUpperCase();
		var url = "https://finance.google.com/finance/getprices?p=1d&i=60&x=ASX&f=c&q="+code;
		console.log(url);
		scrape(url,channelID);
		/*bot.sendMessage({
            to: channelID,
            message: "Extracting company code ("+code+") from stock market ("+market+")"
        });*/
	}
});

function scrape(url,channelID){
    request(url, function(error, response, html){
		console.log('error:', error); // Print the error if one occurred
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		console.log(html);
        if(!error){
            //var $ = cheerio.load(html);
			//var price = extract('<span ng-show="share.last_price" class="ng-binding">','</span>',html);
            var rows = html.split(/\r?\n/);
			var price = rows[rows.length - 1];
			//var price = $('.watchlist-last').html();
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

function extract(prefix, suffix, s){
	console.log("Running Extract",prefix,suffix);
	var i = s.indexOf(prefix);
	console.log("index 1: "+i);
	if (i >= 0) {
		s = s.substring(i + prefix.length);
	}
	else {
		return '';
	}
	if (suffix) {
		i = s.indexOf(suffix);
		console.log("index 2: "+i);
		if (i >= 0) {
			s = s.substring(0, i);
		}
		else {
		  return '';
		}
	}
	console.log(s);
	return s;
}


//https://www.asx.com.au/asx/share-price-research/company/A2M

//<span ng-show="share.last_price" class="ng-binding">10.520</span>

//<small ng-switch-default="" class="price-date ng-binding ng-scope">29 Jun 2018</small>