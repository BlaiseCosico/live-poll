const express = require("express");
const Router = express.Router();
const views = require("../controllers/StudentController");


Router.get("/poll/:roomId", views.answerPoll);
Router.get("/poll-result/:roomId", views.result);
// Router.post("/test:id", views.test);

module.exports = Router;