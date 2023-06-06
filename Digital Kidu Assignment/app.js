const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: "karma12gh123skbc",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());


const userAuth=require('./routes/userAuthRoute')

app.use("/",userAuth);


module.exports = app;
