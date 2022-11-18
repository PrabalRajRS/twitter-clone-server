const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const newsFeed = require("./routes/api/newsFeed");
const comment = require("./routes/api/comments");


const cors = require("cors")
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cors());
app.use(bodyParser.json());
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
app.use(passport.initialize());
require("./config/passport")(passport);
app.use("/api/users", users);
app.use("/api/newsFeed", newsFeed);
app.use("/api/comments", comment);
app.use('../client/public/uploads', express.static('uploads'));
app.listen(5000);