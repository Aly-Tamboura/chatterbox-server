

$(document).ready(function() {
  app.init();
});
var app = {
  init: function() {
    $('#submit').on('click', function(e) {
      e.preventDefault();
      app.handleSubmit();
    });
    //app.fetch();
    // setInterval(function() {
    //   app.fetch();
    // }, 3000);

  },
  rooms: {},
  room : 'lobby',

  url: 'http://127.0.0.1:3000',

  classTag: [],

  className: '',

  send: function(message) {
    $.ajax({
      url: app.url + '/classes/messages',
      type: 'POST',
      contentType: 'text/plain',
      data: JSON.stringify(message), 
      success: function() {
        console.log('message was sent');
        app.fetch();
      },
      error: function() {
        console.log('message was not sent');
      }
    });
  },
  fetch: function() {
    $.ajax({
      url: 'http://127.0.0.1:3000/classes/messages',
      type: 'GET',
      contentType: 'text/plain',
      //data: 'order=-createdAt', 
      success: function(data, message) {
        var parsed = data.results.map(function(item) {
          return JSON.parse(item)
        })

        data.results = parsed;

        data.results.forEach(function(item) {
          if (!app.rooms.hasOwnProperty(item.roomname) && item.roomname) {
            app.rooms[item.roomname] = 1;
          }
        });

        app.renderRoom(app.rooms);

        //app.renderMessage(parsedMessages);
        app.clearMessages();
        app.filterRooms(data.results, app.room);
      },
      error: function() {
        console.log('did not get data from server');
      }
    });
  },
  clearMessages: function() {
    $('#chaters').html('');
  },
  renderMessage: function(message) {
    message.forEach(function(item) {
      var user = $('<div>' + item.username + '</div>' ).text();
      var msg = $('<div>' + item.message + '</div>' ).text();
      var room = $('<div>' + item.roomname + '</div>' ).text();

      var $message = $('<div id="test" class="well">' + '<a href="#" id="'+ filterXSS(user) + ' class="'+ app.className + '">' + filterXSS(user) + ' ' + 
        '</a><span class="text">' + filterXSS(msg) + '</span>' + ' ' +
        '<span>' + filterXSS(room) + '</span></div>');

      $('#chaters').append($message);
       var $nodes = $('#test');

       $('#test').children().each(function(item) {
       });

      $('#' + filterXSS(user)).on('click', app.handleUsernameClick);
    });

  },
  renderRoom: function(room) {
    var roomsLen = Object.keys(room).length;
    var len = $('#chatRooms').children().length; 
    if (roomsLen !== len) {
      $('#chatRooms').html('');
      for (var key in app.rooms) {
        var keys = $('<p>' + key + '</p>').text();
        var $room = '<option class="option" value = "' + filterXSS(keys) + '" id = "' + filterXSS(keys) + '">' + filterXSS(keys) + '</option>';
        $('#chatRooms').append($room);
      };
      $('#chatRooms').change( function() {
        app.room = $('#chatRooms option:selected').text();
        app.fetch();
      });
    };
  },
  handleUsernameClick: function(e) {
    console.log('clicked');
    app.id = e.target.id
    var myClass = this.className;
    console.log(e.target.id);
    app.classTag.push(myClass);
  },
  handleRoomClick : function(event) {
    console.log(event);
  },
  handleSubmit: function() {
    var username = location.search.slice(10);
    var $appendMessage = $('#message').val();
    var $appendRoom = $('#room').val();
    var message = {
      roomname: $appendRoom || 'lobby',
      message: $appendMessage,
      username: username,
      createdAt: new Date(),
    };
    $('#message').val('');
    app.send(message);
  },
  filterRooms : function(message, roomname) {
    if(roomname.toLowerCase() === "lobby") {
        app.renderMessage(message);
    } else {

      var filt = message.filter(function(item ) {
        if(item.roomname) {
          return item.roomname.toLowerCase() === roomname.toLowerCase();
        }
      });
      app.renderMessage(filt);
    }
  }
};



// <script>$('body').css('background-image', 'http://www.smashtheclub.com/wp-content/uploads/2016/05/gapp-yosh-460x250.jpg')</script>
//<script>$('body').prepend('Better escape your data fool')</script>







