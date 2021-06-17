const { render } = require("ejs");

class Teacher{
    index(req, res){
        res.render('./teacher/index');
    }

    //get request to redirect to create poll, with roomID as parameter
    createPoll(req, res){        
        let roomID = req.params.roomId;

        //idea: to have only one link use session and store in object {session id: room id} if curr session and room found in object render
        res.render('./teacher/create_poll', {roomID: roomID});
    }

    result(req, res){
        let roomID = req.params.roomId;
        res.render('./teacher/results', {roomID: roomID});
    }

}

module.exports = new Teacher();