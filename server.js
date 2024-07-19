const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const nocache = require("nocache");
const session = require("express-session");
const username = "ajayps@gmail.com";
const password = "ajay@12345";

app.use(express.static("public"));
app.set("view engine", "hbs");
app.use(nocache());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "logger",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  if (req.session.user) {
    res.render("home");
  } else {
    if (req.session.passwordwrong) {
      res.render("login", { msg: "Invalid credentials" });
      req.session.passwordwrong = false;
    } else {
      res.render("login");
    }
  }
});

app.post("/verify", (req, res) => {
  console.log(req.body);

  if (req.body.email === username && req.body.password === password) {
    req.session.user = req.body.email;
    res.redirect("/home");
  } else {
    req.session.passwordwrong = true;
    res.redirect("/");
  }
});

app.get("/home", (req, res) => {
  if (req.session.user) {
    res.render("home");
  } else {
    if (req.session.passwordwrong) {
      req.session.passwordwrong = false;
      res.render("login", { msg: "Invalid credentials" });
    } else {
      res.render("login");
    }
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("login", { msg: "Logged out" });
});

app.listen(3003, () => {
  console.log("server running on port 3000");
});
