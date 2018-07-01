var Discord = require('discord.io');
var auth = require('./credentials.json');

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
		console.log("Setting XP Modifier");
		var market = message.substr(0,2);
		var code = message.substr(4,6);
		bot.sendMessage({
            to: channelID,
            message: "Extracting company code ("+code+") from stock market ("+market+")"
        });
	}
});