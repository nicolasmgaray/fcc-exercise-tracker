const express = require("express");
require("express-async-errors");
const app = express();
const mongoose = require("mongoose");
const { User, Log } = require("./models.js");
const { configRoutes, configMiddleware } = require("./routes.js");

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  error => {
    if (error) {
      console.log(error);
      return;
    }

    mongoose.Promise = global.Promise;

    configMiddleware(app);
    
    configRoutes(app, { User, Log });

 

    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });
  }
);
