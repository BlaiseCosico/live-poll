var option_num = 1;
//functions that copies poll url to clipboard
function copyText() {
    var copyText = document.getElementById("pollURL");
  
    copyText.select();
    copyText.setSelectionRange(0, 99999);
  
    document.execCommand("copy");
  }


$(document).ready(function (){

    $('#show-results-btn').hide();

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      })
    
    //focus question input text
    $("#question").focus();
    var room = $('#room').val();

    // set-up a connection between the client and the server
    var socket = io.connect();

    // Connected, let's sign-up for to receive messages for this room
    socket.on('connect', function() {
        socket.emit('join', {room: room, id: socket.id});
    });

    socket.on('existing data', function(data){
        
        if(data.question){
            $('#question').val(data.question);
        }
        if(data.options){
            option_num = data.options.length;
            let options_list = "";
            for(option of data.options){
                options_list += `
                    <div class="control-group input-group">  
                        <input type="text" class="form-control text-white" id="`+option.id+`" placeholder="`+option.id+`" value="` + option.option + `">
                        <div class="input-group-btn">   
                        <button class="btn btn-danger remove" type="button" value=`+option.id+`><i class="bi bi-trash"></i> 
                        </button>  
                        </div>   
                    </div>
                `
            }
            $('#options').html(options_list);
        }

        if($("#options").find($("input")).length > 1){
            $('#start-btn').prop('disabled', false);
        } 
    });
    
    socket.on('joined room', function(data){
        console.log('someone joined! current room size is: ' + data.room_size);
        $('#start-btn').html("Start collecting responses ("+data.room_size+" live)");
        if(data.voted){
            $('#show-results-btn').html('Stop collecting and share results (' + data.voted + '/' + data.room_size + ' voted)');
        }else{
            $('#show-results-btn').html('Stop collecting and share results ( 0/' + data.room_size + ' voted)');
        }
    });

    // socket.on('someone voted', function(data){
    //     $('#show-results-btn').html('Stop collecting and share results (' + data.voted + '/' + data.total_people + ' voted)');
    // });

    //when add button is clicked, add another input text for option then emit it
    $("#add-btn").click(function() {
        option_num += 1
        let additional_option = `
            <div class="control-group input-group">  
                <input type="text" class="form-control text-white" id="option`+option_num+`"placeholder="Option `+option_num+`">
                <div class="input-group-btn">   
                    <button class="btn btn-danger remove" type="button" value=option`+option_num+`><i class="bi bi-trash"></i> 
                    </button>  
                </div>   
            </div>
        `
        $("#options").append(additional_option);
        socket.emit('adding option', {id: option_num});
        return false;
    });

    //when start button is clicked, enable voting
    $("#start-btn").click(function() {
        socket.emit('start voting');
        $('#show-results-btn').show();
        $(this).hide();
    });

    $('#question').change(function(){
        socket.emit('updating question', {question: $(this).val()});
    });

    //update option
    $('#options').on('change', 'input', function() {
        socket.emit('updating option', {id: $(this).attr('id'), option: $(this).val()});
        
        if($("#options").find($("input")).length > 1){
            $('#start-btn').prop('disabled', false);
        } 
    });
    //delete option
    $('#options').on('click', 'button.btn', function(){
        $(this).parent().parent().remove(); //removes div
        socket.emit('option deleted', {id: $(this).val()});
        if($("#options").find($("input")).length <= 1){
            $('#start-btn').prop('disabled', true);
        }
    })

    $('#restart').click(function(){
        socket.emit('on restart');
        location.reload();
    });



});


