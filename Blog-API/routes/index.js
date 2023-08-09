var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const { Author } = require("../db");
const passport = require("passport");
const jwt = require('jsonwebtoken')
require('dotenv').config();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Blog" });
});

router.get("/signup", (req, res, next) => {
    //res.sendStatus(403);
  res.render('signup', {title:'Sign up'})
});

router.post("/signup", function (req, res, next) {
  //res.sendStatus(403);
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

router.get("/login", async (req, res, next) => {
  const author = await Author.findOne({ username: 'test' })
  res.render("login", { title: 'Log in'});
});

router.post("/login", async function (req, res, next) {
  const author = await Author.findOne({ username: req.body.username })
  if (!author) return res.send("No author");
  const pw = author.password;
  try {
    bcrypt.compare(req.body.password, pw, async (err, isMatch) => {
      if (err) return next(err);
      if (isMatch) {
        const token = jwt.sign({user:author._id}, process.env.secretKey)
        res.json({token})
      } else res.send('Wrong password')
    });
  } catch (err) {
    res.send('Error comparing passwords')
  }
});

router.get('/create', passport.authenticate('jwt', {session:false}), (req,res)=> {
  res.json({msg: 'Accessed authorized route'})
})

//route used to check bearer token
router.get('/creates', (req,res)=> {
  res.json({msg: req.headers.authorization})
})


module.exports = router;
