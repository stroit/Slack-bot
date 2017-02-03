require('dotenv').config();

var Bot = require('slackbots');
const moment = require('moment-timezone'),
      rp = require('request-promise'),
      bodyParser = require('body-parser'),
      CronJob = require('cron').CronJob;

let settings = {
    token: process.env.SLACK_TOKEN,
    name: process.env.SLACK_CHANNEL_NAME
};

bodyParser.json();
moment.tz.setDefault("EST");

var Bot = new Bot(settings);
Bot.on('start', function () {
    console.log("[!] bot just started");
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
    let giphyUrl = "http://api.giphy.com/v1/gifs/search?q=excited&api_key=dc6zaTOxFJmzC"

    rp(giphyUrl)
        .then(function (htmlString) {
            var parsedJson = JSON.parse(htmlString);
            for (var i = 0; i < 25; i++) {
                gifLinks.push(parsedJson.data[i].images.downsized.url);
            }
        })
        .finally(function () {
            var job = new CronJob({
                cronTime: '00 00 00 * * 0-6',
                onTick: function () {
                    let randNum = Math.floor(Math.random() * 25 + 1);
                    Bot.postMessageToChannel('general', gifLinks[randNum], papa);
                },
                start: true,
                timeZone: 'EST'
            });
            //job.start();
        })
        .catch(function (err) {
            Bot.postMessageToChannel('general', "Bot Error!");
        })
})

function text() {
    let now = moment().dayOfYear();
    let day = moment("20170207").dayOfYear();
    let today = moment().format("MMMM Do");

    return `_Today : ${today}_\n\n *${day - now}* days left to finish project! \nCheer Up Nathan😊`;
}