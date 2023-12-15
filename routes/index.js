var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const localStrategy = require("passport-local");
const upload = require("./multer")

passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. signup page*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Signup | pinterest' });
});

// login route
router.get('/login',function(req, res){
  // console.log(req.flash("error"));
  res.render('login', {error: req.flash("error")});
})

// feed route
router.get("/feed", async function(req, res){
  
  const post = await postModel.find();
  console.log(post);
  res.render('feed', {post});
})

// profile route
router.get("/profile", isLoggedIn, async function(req, res){
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate('posts')
  console.log(user)
  res.render("profile", {user})
})

// upload route
router.post("/upload", isLoggedIn, upload.single("file") , async function(req, res){
  if(!req.file){
    return res.status(404).send('no files were given');
  }
  // res.send("File uploaded successfully")
  // jo file upload hui hai use save karo as a post and uska post id user ko dena hai and post ko user id
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id,
  })

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile")
})

// dp upload route
router.post("/dpupload", isLoggedIn, upload.single("file") , async function(req, res){
  if(!req.file){
    return res.status(404).send('no files were given');
  }
  // res.send("File uploaded successfully")
  const user = await userModel.findOne({username: req.session.passport.user});
  user.dp = req.file.filename;
  await user.save();
  res.redirect("/profile")
  // res.send("dp uploaded")
}
)

// register a profile
router.post("/register", function(req, res){
  const { username, email, fullname } = req.body;
  const userData = new userModel({username, email, fullname });

  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile");
    })
  })
})

// login a profile
router.post("/login",passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
}), function(req, res){
});

router.get("/logout", function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req,res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/")
}


module.exports = router;
