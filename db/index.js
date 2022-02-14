const mongoose = require("mongoose");
require("dotenv").config()

const MONGO_URI = process.env.MONGODB_URI || `mongodb+srv://${process.env.MG_USERNAME}:${process.env.MG_PWD}@cluster0.6fts6.mongodb.net/express-basic-auth`;

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
