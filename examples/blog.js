var Express = require('express')
    , dnode = require('dnode')
    , nQuery = require('../')
    , mongoose = require('mongoose')
    , express = Express.createServer();

mongoose.connect('mongodb://localhost/my_blog');

var Comments = new mongoose.Schema({
    title     : String
  , body      : String
  , date      : Date
});

var BlogPost = new mongoose.Schema({
    author : mongoose.Schema.ObjectId
    , title : String
    , body : String
    , date : Date
    , comments : [Comments]
    , meta : {
        votes : Number
        , favs  : Number
    }
});

var Post = mongoose.model('BlogPost', BlogPost);
var app = function ($) {

    $.on('/', function () {
        $.on('ready', function () {
        
            $('body').append('<h1>My Blog</h1><a href="/new">new post</a>');
            Post.find({ }, function (e, docs) {
                if (e) console.log(e);
                docs.forEach(function (doc) {
                    $('body').append('<hr><div class="post"><h3>'+doc.title+'</h3><p>'+doc.body+'</p></div>');
                });
            });
            
        });
    });
    
    $.on('/new', function () {
        $.on('ready', function () {
        
            $('body').append('<h2>New Blog Post</h2>');
            $('body').append('<form id="new"><input type="text" name="title" placeholder="title" /><textarea name="body"></textarea></form><button id="newPost">New Post</button>');
            $('#newPost').live('click', function () {
                $('#new').serialize(function (val) {
                    var post = new Post($.parseQuerystring(val))
                    post.save();
                    $('#new').html('Blog updated. <a href="/">go see it</a>');
                });
            });
            
        });
    });
    
};

nQuery.use(app);

express
    .use(nQuery.middleware)
    .use(Express.static(__dirname + '/public'))
    .use(nQuery.static)
    .listen(3000);

dnode(nQuery.middleware).listen(express);

console.log('ready.');

