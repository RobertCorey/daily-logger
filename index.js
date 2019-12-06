const schedule = require('node-schedule');
const fs = require('fs');

function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return month + '-' + day + '-' + year;
}

var j = schedule.scheduleJob('0 18 * * 1-5', function() {
  getLog();
});

function getLog() {
  const notifier = require('node-notifier');
  var nc = new notifier.NotificationCenter();
  nc.notify(
    {
      title: 'Notifications',
      message: 'What did you do today? ' + new Date(),
      sound: 'Funk',
      // case sensitive
      reply: true
    },
    function(err, response, metadata) {
      console.log(response);
      if (err) throw err;
      console.log(metadata);
    }
  );

  nc.on('replied', function(obj, options, metadata) {
    console.log('User replied', metadata.activationValue);
    if (!metadata.activationValue.length) return;
    fs.writeFileSync(
      `./logs/${getFormattedDate(new Date())}.txt`,
      metadata.activationValue
    );
  });
}

getLog();
