//jshint esversion:6
const dotenv = require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

mongoose.connect(process.env.RESTREVIEWS_DB_URI,{ useUnifiedTopology: true ,useNewUrlParser: true});
const homeStartingContent = "This live app is demonstration of collective database based full stack web application.Users may use it to express themselves out here and their thoughts would persist on the platform, and could be shared with others. For API of the database chack about section.";
const aboutContent = "The app uses templating to achieve modularity and its robustness. Currently it is supported by RESTful APIs, which could be used to serve devbelopers requests to access the database.";
const contactContent="To reach out to me checkout my website: ";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//let posts = [];
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post",postSchema);

// const homeStartingContent = new Post({
//   name: "Vanilla",
//   article: "Hello welcome to this shity website:/"
// })

//homeStartingContent.save();


app.get("/", function(req, res){

  //  var startingContent = 

  // res.render("home", {
  //   startingContent: homeStartingContent,
  //   posts: posts
  //   });

  Post.find({},function(err,posts){
    res.render("home",{
      startingContent: homeStartingContent,
      posts: posts
    })
  })

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post =new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res){

  // const requestedTitle = _.lowerCase(req.params.postName);

  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

  const requestedPostId = req.params.postId;

  Post.findOne({_id:requestedPostId},function(err,post){
    if(!err){
    
      res.render("post", {
      title: post.title,
      content: post.content
  });
}else console.log(err);


});

});

app.listen(process.env.PORT || 3001, function() {
  console.log("Server started on port 3001");
});
