$(document).ready(function (){ 
            
    var room = $('#room').val();
    // set-up a connection between the client and the server
    var socket = io.connect();
    socket.on('connect', function() {
        // Connected, let's sign-up for to receive messages for this room
        socket.emit('join', {room: room, id: socket.id});
    });

    socket.on('existing data', function(data){
        
        if(data.question){
            $('#question').html('<b>Q. ' + data.question + '</b>');
        }
        if(data.options){
            let options_list = "";
            for(option of data.options){
                options_list += `<label class="options" id="label_`+option.id+`">` + option.option + `
                        <input type="radio" name="radio" id="`+option.id+`" value="`+ option.option +`"> <span class="checkmark"></span> 
                    </label>`
                    }
            $('#options').html(options_list);
        }
        console.log(data.started);
        if(data.started){
            $('.btn-success').prop('disabled', false);
        }
    });

    socket.on('voting has started', function(){
        $('.btn-success').prop('disabled', false);
    });
    
    socket.on('question updated', function(data) {
        $('#question').html('<b>Q. '  + data.question + '</b>');
    });

    socket.on('option added', function(data){
        $("#options").append(`<label class="options" id="label_option`+data.id+`">Other 
                <input type="radio" name="radio" id="option`+data.id+`" value=""> <span class="checkmark"></span> 
            </label>`);
    });

    socket.on('option updated', function(data){
        $('#label_'+data.id).html(data.option + 
            `<input type="radio" name="option" id="option`+data.id+`" value="`+data.option+`"> <span class="checkmark"></span>`                
        );
    });

    socket.on('deleted option', function(data){

        $('#label_option'+data.id).remove();
        
    });

    $('#vote-btn').click(function() {        
        try{
            socket.emit('student voting', {vote: $('form').serializeArray()[0].value});
            alert('voted successfuly!');
        }catch(err){
            alert('please select an answer!')
        }
                
    });
});