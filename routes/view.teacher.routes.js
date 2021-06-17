const express = require("express");
const Router = express.Router();
const views = require("../controllers/TeacherController");

Router.get("/", views.index);
Router.get("/poll/:roomId", views.createPoll);
Router.get("/result/:roomId", views.result);

module.exports = Router;