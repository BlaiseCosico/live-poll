$(document).ready(function (){ 
    
    var room = $('#room').val();
    // set-up a connection between the client and the server
    var socket = io.connect();
    socket.on('connect', function() {
        // Connected, let's sign-up for to receive messages for this room
        socket.emit('join', {room: room, id: socket.id});
    });

    socket.on('existing data', function(data){
      //bad to emit every time. fix tomorrow.
      let results = "<h2> " + data.question + "</h2>" 
      //populate html here 
      for(option_label of data.options){
        console.log(option_label);
        results += `
          <div class="skill">
            <div class="skill-name">` + option_label.option + `</div>
            <div class="skill-bar">
              <div class="skill-per" per="` + (option_label.vote / data.voted) * 100 + `"></div>
            </div>
          </div>
        `
      }
      $("#skills-container").html(results);

      $('.skill-per').each(function(){
          var $this = $(this);
          var per = $this.attr('per');
          $this.css("width",per+'%');
          $({animatedValue: 0}).animate({animatedValue: per},{
            duration: 1000,
            step: function(){
              $this.attr('per', Math.floor(this.animatedValue) + '%');
            },
            complete: function(){
              $this.attr('per', Math.floor(this.animatedValue) + '%');
            }
          });
        });
      $('#question').html(data.question);
      console.log(data);
    });

    socket.on('updating vote', function(data){
      //update per value
      console.log(data);
    });

    $('.skill-per').each(function(){
        var $this = $(this);
        var per = $this.attr('per');
        $this.css("width",per+'%');
        $({animatedValue: 0}).animate({animatedValue: per},{
          duration: 1000,
          step: function(){
            $this.attr('per', Math.floor(this.animatedValue) + '%');
          },
          complete: function(){
            $this.attr('per', Math.floor(this.animatedValue) + '%');
          }
        });
      });

    $('#new-poll').click(function() {
        socket.emit('on restart');
        window.location.href='/teacher/poll/'+room;
    });
});