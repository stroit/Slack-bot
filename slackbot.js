var Bot = require('slackbots');
const moment = require('moment');
const sleep = require('sleep');
const rp = require('request-promise');
const bodyParser = require('body-parser');

let settings = {
    token: 'xoxp-128261913680-129045700020-130658324310-ea69702ae72df96bafa42fd8250f6c3c',
    name: 'reminder'
};
bodyParser.json();

var Bot = new Bot(settings);

Bot.on('start', function() {
    let papa = {
        "attachments": [{
            "color": "#3498db",
            "text": text(),
            "mrkdwn_in": [
                "text"
            ]
        }]
    };
    
    let gifLinks = [];
    let giphyUrl = "http://api.giphy.com/v1/gifs/search?q=you%20can%20do%20it&api_key=dc6zaTOxFJmzC"

    rp(giphyUrl)
        .then(function(htmlString) {
            var parsedJson = JSON.parse(htmlString);
            for (var i = 0; i < 25; i++) {
                gifLinks.push(parsedJson.data[i].images.original.url);
            }
        })
        .catch(function(err) {
            Bot.postMessageToChannel('general', "Bot Error!");
        })
        .finally(function() {
            setInterval(function() {
                if (moment().hour() === 0) {
                    let randNum = Math.floor(Math.random() * 25 + 1);
                    Bot.postMessageToChannel('general', gifLinks[randNum], papa);
                }
            }, 1000 * 60);
        })
})


function text() {
    let now = moment().dayOfYear();
    let day = moment("20170207").dayOfYear();
    let today = moment().format("MMMM Do");

    return `_Today : \n${today}_\n\n*${day-now}* days left to finish project! \nCheer Up Nathan😊`;
}