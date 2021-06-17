const roomdata = require('roomdata');
let rooms = [];
let curr_room;


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function socket(io){

    io.on('connection', (socket) =>  {

        socket.on('disconnect', function(){
            try{
                io.to(curr_room).emit('joined room', {room_size: (io.sockets.adapter.rooms.get(curr_room).size) - 1, voted: roomdata.get(socket, "voted")});
            }catch(err){
                console.log("no curr room size");
            }
          });

        socket.on('create_room', (data) => {
        
            let id = makeid(8);

            if(!rooms.includes(id)){
                rooms.push(id);
                //generate a room where people can go to, and pass teacherID
                socket.emit('generate_id', {roomID: id, teacherID: data.socket_id});
            }
        });

        //joins a room based on id from url
        socket.on('join', function(data) {
            // socket.join(data.room);
            roomdata.joinRoom(socket, data.room);

            console.log('room is: ' + data.room);
            curr_room = data.room;

            //get number of clients in a room - 1;
            let room_size;
            if(io.sockets.adapter.rooms.get(curr_room).size){
                room_size = io.sockets.adapter.rooms.get(curr_room).size - 1;
            }else{
                room_size = 0;
            }

            io.to(curr_room).emit('joined room', {room_size: (room_size), voted: roomdata.get(socket, "voted")});
            //sends previous data if existing
            console.log(roomdata.get(socket, "options"));
            io.to(curr_room).emit('existing data', {question: roomdata.get(socket, "question"), options: roomdata.get(socket, "options"), 
                                        voted: roomdata.get(socket, "voted"), started: roomdata.get(socket, 'started')});
        });
        
        //teacher updated question
        socket.on('updating question', function(data){
            roomdata.set(socket, "question", data.question);
            
            io.to(curr_room).emit("question updated", {question: data.question});
        });

        //teacher added option
        socket.on('adding option', function(data){
            io.to(curr_room).emit("option added", {id: data.id});
        });

        //teacher updated option
        socket.on('updating option', function(data){

            //checks if updated option is already in dictionary, if it is update else append
            if(roomdata.get(socket, "options")){
                
                options = roomdata.get(socket, "options");
                let i;
                let found = options.some( (element, index) => {i = index; return element.id == data.id;});
                console.log(found , i);
                if(found){
                    options[i].option = data.option;
                }else{
                    options.push({id: data.id, option: data.option, vote: 0});
                }

            }else{
                let options = [];
                options.push({id: data.id, option: data.option, vote: 0});
                roomdata.set(socket, "options", options);
            }
            
            //update option count here;
            
            // roomdata.set(socket, "options", {id: data.id, option: data.option});
            io.to(curr_room).emit("option updated", {id: data.id, option: data.option})
        });

        socket.on('option deleted', function(data){
            
            console.log(data.id);
            let options = roomdata.get(socket, "options");
            console.log(options);
            let i;
            if(options.some( (element, index) => {i = index; return element.id == data.id;})){
                options.splice(i, 1);
            };
            
            io.to(curr_room).emit("deleted option", {id: i+1}); //array index +1

        });

        socket.on('on restart', function(){
            roomdata.set(socket, "question", "");
            roomdata.set(socket, "options", [{ id: 'option1', option: '', vote: 0 },]);
        });

        //teacher started voting process
        socket.on('start voting', function(){
            io.to(curr_room).emit('voting has started');
            roomdata.set(socket, 'started', true);
            
        })

        //student voted
        //get room option array, update the vote amount, return the updated option
        socket.on('student voting', function(data){
        
            let options = [];

            options = roomdata.get(socket, "options");
            let i;
            if(options.some( (element, index) => {i = index; return element.option == data.vote;})){
                console.log('found');
                options[i].vote += 1;
                roomdata.set(socket, "options", options);

                if(roomdata.get(socket, "voted")){
                    roomdata.set(socket, "voted", roomdata.get(socket, "voted")+1);
                }else{
                    roomdata.set(socket, "voted", 1);
                }
                
            }

            // io.to(curr_room).emit("update vote", options[i]);
            io.to(curr_room).emit("someone voted", {voted: roomdata.get(socket, "voted"), total_people: (io.sockets.adapter.rooms.get(curr_room).size) - 1});

            //update total number of voters, pass it 
        });

    });

   
}


module.exports = { socket: socket };