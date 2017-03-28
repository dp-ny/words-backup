var boggle = function() {
  var b = {};
  b.time = undefined;
  b.stopped = true;
  var duration = moment.duration(2, 'minutes');
  var $body = $('body');
  var $newButton = $('.boggle-container .actions > .new');
  var $pauseButton = $('.boggle-container .actions > .pause');
  var $boardSize = $('.boggle-container .board-size');

  var $timer = $('.boggle-container .timer');
  var $table = $('table.boggle');
  var $tableTd = $('.boggle-container table.boggle td');
  var redFlash = '#FF1E1E';
  var defaultColor = $('.boggle-container').css('background-color');
  var flashCount = 10;

  var init = function() {
    var initialSize = $table.css('font-size').replace('px', '');
    $boardSize.val(initialSize);
    updateTimer();
    bindActions();
    resetGame();
  };

  var resetGame = function() {
    bindTimerUpdate();
    var now = moment();
    b.time = now.add(duration);
    $timer.html(getTime(duration.hours(), duration.minutes(), duration.seconds()));
  }

  var bindActions = function() {
    $newButton.on('click', function() {
      b.stopped = true;
      $.ajax({
        url: 'boggle/new',
        success: function(data) {
          if (!data.html) {
            alert('unable to fetch new board');
          } else {
            $table.html(data.html);
            resetGame();
            b.stopped = false;
          }
        },
        error: function() {
          alert('an error occurred');
        }
      });
    });
    $boardSize.change(function() {
      var fontSize = Number($boardSize.val());
      $table.css('font-size', fontSize + 'px');
      var size = fontSize + 20;
      $tableTd.css('width', size + 'px');
      $tableTd.css('height', size + 'px');
    });
    $pauseButton.on('click', function() {
      b.stopped = !b.stopped;
      console.log('stopped is now', b.stopped);
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
      bindTimerUpdate();
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
    setTimeout(updateTimer, 100);
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
