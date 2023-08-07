var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const { Author } = require("../db");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Blog" });
});

router.get("/signup", (req, res, next) => {
  res.sendStatus(403); //No one can sign up, only my blog!
});

router.post("/signup", function (req, res, next) {
  res.sendStatus(403);
  bcrypt.hash(req.body.password, 10, async (err, hashedPw) => {
    if (err) return next(err);
    const author = new Author({
      username: req.body.username,
      password: hashedPw,
    });
    const save = await author.save();
  });
  res.render("index");
});

router.get("/login", (req, res, next) => {
  res.render("login", { title: "Log in" });
});

router.post("/login", async function (req, res, next) {
  const author = await Author.findOne({ username: req.body.username })
    .populate("password")
    .exec();
  if (!author) return res.send("No author");
  const pw = author.password;
  try {
    bcrypt.compare(req.body.password, pw, async (err, isMatch) => {
      if (err) return next(err);
      if (isMatch) {
        //Make sure to use JWT to keep session later
        res.render("index", { title: `Welcome ${author.username}` });
      } else res.send('Wrong password')
    });
  } catch (err) {
    res.send('Error comparing passwords')
  }
});

module.exports = router;
