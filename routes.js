exports.configRoutes = (app, models) => {
  const { User, Log } = models;

  app.post("/api/exercise/new-user", async (req, res) => {   
      const { username } = req.body;    
      let exist = await User.findOne({ username: username }).exec();
      if (exist) return res.json({ error: "User already exist" });    
      let result = await User.create({ username: username });    
      return res.json(result);   
  });

  app.get("/api/exercise/users", async (req, res) => {
    let users = await User.find()
      .select(["username", "_id"])
      .exec();
    return res.json(users);
  });

  app.get("/api/exercise/log", async (req, res) => {
    let { userId, from, to, limit } = req.query;
    if (!userId) return res.json({ error: "userId required" });
    if (!limit) limit = 100;

    let user = await User.findById(userId).exec();
    if (!user) return res.json({ error: "User not found" });

    let query = Log.find({ userId }).limit(parseInt(limit));
    if (from) query.where("date").gte(new Date(from));
    if (to) query.where("date").lte(new Date(to));

    let logs = await query
      .select(["description", "duration", "date", "-_id"])
      .exec();

    return res.json({
      _id: userId,
      username: user.username,
      count: logs.length,
      log: logs
    });
  });

  app.post("/api/exercise/add", async (req, res) => {
    let { userId, description, duration, date } = req.body;

    date = date == undefined || date == "" ? new Date() : new Date(date);

    let user = await User.findById(userId).exec();
    if (!user) return res.json({ error: "User don´t exist" });

    let result = await Log.create({ userId, description, duration, date });

    return res.json({
      username: user.username,
      description,
      duration: parseInt(duration),
      _id: user._id,
      date: date.toDateString()
    });
  });
  
  // Not found middleware
  app.use((req, res, next) => {
    return res({ status: 404, message: "not found" });
  });
  
};

exports.configMiddleware = app => {
  const express = require("express");
  const bodyParser = require("body-parser");
  const cors = require("cors");

  app.use(cors());

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(express.static("public"));
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
  });

  

  // Error Handling middleware
  app.use((err, req, res, next) => {
    let errCode, errMessage;
    if (err.errors) {
      // mongoose validation error
      errCode = 400; // bad request
      const keys = Object.keys(err.errors);
      // report the first validation error
      errMessage = err.errors[keys[0]].message;
    } else {
      // generic or custom error
      errCode = err.status || 500;
      errMessage = err.message || "Internal Server Error";
    }
    res
      .status(errCode)
      .type("txt")
      .send(errMessage);
  });
};
