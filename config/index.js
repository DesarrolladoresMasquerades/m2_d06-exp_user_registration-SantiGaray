const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session"); // AFTER the COOKIEPARSER
const favicon = require("serve-favicon");
const MongoStore = require("connect-mongo");  // is a CLASS
const path = require("path");

module.exports = (app) => {
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());   //always after URLENCODED and the JSON

  app.use(
    session({                                 // session takes a couple of settings
      secret: process.env.COOKIE_SECRET,      // for example: Hohfaivnr8474930rfnvoh0egw
      cookie: {                               // session takes a couple of settings
        maxAge: 24 * 60 * 60 * 1000,          //One day old // in miliseconds
              },          
        saveUninitialized: false,
        resave: false,
        store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI,  // || "mongodb://localhost/cookies",
          ttl: 24 * 60 * 60,                  // in seconds
        }),
    })
  );

  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "hbs");
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(
    favicon(path.join(__dirname, "..", "public", "images", "favicon.ico"))
  );
};
