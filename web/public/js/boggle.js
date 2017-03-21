var boggle = function() {
  var b = {};
  b.time = undefined;
  var duration = moment.duration(2, 'minutes');
  var $body = $('body');
  var $resetButton = $('.boggle-container .actions > .reset');
  var $newButton = $('.boggle-container .actions > .new');
  var $stopButton = $('.boggle-container .actions > .stop');
  var $timer = $('.boggle-container .timer');
  var $table = $('table.boggle');
  var redFlash = '#FF1E1E';
  var defaultColor = $('.boggle-container').css('background-color');
  var flashCount = 10;

  var init = function() {
    updateTimer();
    bindActions();
    resetTime();
  };

  var resetTime = function() {
    b.stopped = false;
    bindTimerUpdate();
  }

  var resetGame = function(buttonText) {
    $resetButton.html(buttonText);
    resetTime();
    var now = moment();
    b.time = now.add(duration);
    $timer.html(getTime(duration.hours(), duration.minutes(), duration.seconds()));
  }

  var bindActions = function() {
    $resetButton.on('click', function() {
      resetGame('Reset');
    });
    $newButton.on('click', function() {
      resetGame('Start');
      b.stopped = true;
      $.ajax({
        url: 'boggle/new',
        success: function(data) {
          if (!data.html) {
            alert('fuck');
          } else {
            $table.html(data.html);
          }
        },
        error: function() {
          alert('double fuck');
        }
      });
    });
    $stopButton.on('click', function() {
      b.stopped = true;
    });
  };

  var setDefaultTime = function() {
    $timer.html(getDefaultTime());
  };

  var padTime = function(t) {
    var s = '' + t;
    if (s.length < 2) {
      s = '0'+s;
    }
    return s
  };

  var defaultBody = function() {
    $body.css('background-color', defaultColor);
  }

  var flashGameOver = function(count) {
    return function() {
      if (count < 0 || b.stopped) {
        b.stopped = true;
        defaultBody();
        return;
      }
      setDefaultTime();
      if (count % 2) {
        $body.css('background-color', redFlash);
      } else {
        defaultBody();
      }
      setTimeout(flashGameOver(count-1), 500);
    }
  }

  var updateTimer = function() {
    if (b.stopped) {
      return;
    }
    if (!b.time) {
      setDefaultTime();
      return;
    }
    var now = moment();
    if (b.time.isBefore(now)) {
      flashGameOver(flashCount)();
      return;
    }
    var diff = moment(b.time.diff(now));
    $timer.html(getTime(diff.hours(), diff.minutes(), diff.seconds()));
    bindTimerUpdate();
  };

  var bindTimerUpdate = function() {
    setTimeout(updateTimer, 1000);
  };

  var getDefaultTime = function() {
    return getTime(0, 0, 0);
  }

  var getTime = function(hours, minutes, seconds) {
    var time = "";
    var printMissing = false;
    if (duration.hours() > 0) {
      time += padTime(hours) + ":";
      printMissing = true;
    }
    if (duration.minutes() > 0 || printMissing) {
      time += padTime(minutes) + ":";
      printMissing = true;
    }
    if (duration.seconds() > 0 || printMissing) {
      time += padTime(seconds);
    }
    return time;
  };

  init();
  return b;
}();
