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
		var code = message.substr(4,3);
		var url = "https://www.asx.com.au/asx/share-price-research/company/"+code;
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
        if(!error){
            //var $ = cheerio.load(html);
			var price = extract('<span ng-show="share.last_price" class="ng-binding">','</span>',html);
            //var price = $('span[ng-show="share.last_price"]').html();
			console.log(price);
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
	var i = s.indexOf(prefix);
	if (i >= 0) {
		s = s.substring(i + prefix.length);
	}
	else {
		return '';
	}
	if (suffix) {
		i = s.indexOf(suffix);
		if (i >= 0) {
			s = s.substring(0, i);
		}
		else {
		  return '';
		}
	}
	return s;
}


//https://www.asx.com.au/asx/share-price-research/company/A2M

//<span ng-show="share.last_price" class="ng-binding">10.520</span>

//<small ng-switch-default="" class="price-date ng-binding ng-scope">29 Jun 2018</small>