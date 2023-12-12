var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/createuser", async function(req,res){
  let users = await userModel.create({
    username: "uniquesonu",
    password: "its.sonu@123",
    email: "sonu@gmail.com",
    fullName: "Sonu Kumar"
  })
  res.send(users)
})

router.get("/createpost", async function(req, res){
  let posts = await userModel.create({
    postText: "Hello everyone, this is my first post."
  })
})

module.exports = router;
