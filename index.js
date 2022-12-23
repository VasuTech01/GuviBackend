const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("./src/DB/mongoose");
const helmet = require("helmet");
const path = require("path");
const uuid = require("uuid");
const session = require("express-session");
const router = require("./src/routers/User");
const port = process.env.PORT || 5000;
const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 60 * 1000,
    },
  })
);
app.use((req, res,next) => {
    req.session.no ? req.session.no = req.session.no + 1 : req.session.no = 1;
    next();
})
app.get("/", (req, res) => {
    console.log(req.session);
  res.send(req.session);
});
app.use(router);
app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
