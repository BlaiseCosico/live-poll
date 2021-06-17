const { render } = require("ejs");

class Student{
    //get request to redirect to create poll, with roomID as parameter
    answerPoll(req, res){        
        let roomID = req.params.roomId;
        res.render('./student/answer_poll', {roomID: roomID});
    }

    result(req, res){  
        let roomID = req.params.roomId;
        
        res.render('./student/results', {roomID: roomID});
    }
}

module.exports = new Student();