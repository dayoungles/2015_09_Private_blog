var express = require('express');
var app = express();
var Mongoose = require('mongoose');

var url = 'mongodb://dayg:Dayg123@125.209.195.232:27017/newDb';
var Schema = Mongoose.schema();
var fs = require('fs');

var imgPath="./img/";
var savePath = './upload/';
var formidable = require('formidable');

var users = new Schema ({
    email:String,
    name: String,
    password: String,
    auth: Number
});

var posts = new Schema({
    user:{ref:"users", type: Schema.Types.ObjectId},
    postAuth: Number,
    date:Date,
    title:String,
    content:String,
    tag:[String],
    comment:[{ref:"comments", type:Schema.Types.ObjectId}]
});

var comments = new Schema({
    user:{ref:"users", userId: Schema.Types.ObjectId},
    post:{ref:"posts", postId:Schema.Types.ObjectId},
    body:String,
    daedaet:{ref:"comments", commentId:Schema.Types.ObjectId}
});

var mUsers = Mongoose.model("User", users);
var mPosts = Mongoose.model("Post", posts);
var mComments = Mongoose.model("Comment", comments);

Mongoose.connect(url);
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("mongoose connected completed");

    });



});



//파일 업로드


var isFormData = function(req){
    var type= req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
};
//
//app.post('/users', function(req, res){
//	var form = new formidable.IncomingForm();
//	var body = {};
//	if(!isFormData(req)) {
//		res.status(400).end('Bad request');
//		return;
//	}
//	form.on('field', function(name, value){
//		body[name] = value;
//	});
//
//	form.on('fileBegin', function(name, file){
//		file.path = savePath + body.imgName;
//	});
//
//	form.on('end', function(fields, files){
//		MongoClient.connect(url, function(err, db){
//			if(err) res.sendStatus(500);
//			db.collection('users').insert(body, function(err, inserted){
//				if(err) res.sendStatus(500);
//
//				res.sendStatus(200);
//				db.close();
//			});
//		});
//	});
//	form.parse(req);
//});



app.get('/users',function(req, res){
	MongoClient.connect(url, function(err, db){
		if(err) throw err;

		var query = {name: req.param('name')};

		db.collection('users').find(query).toArray(function(err, docs){
			if(err) throw err;
			res.end(JSON.stringify(docs));
			db.close();
		});
	});
});


app.get('/index', function(req, res){
    // TODO
    // 정책 확인. 레벨에 따라 노출되는 글을 제한할지, 아니면 내용만 보여주지 않을지.


	fs.readFile('index.html', function(err, data){
		res.writeHead(200, {'Content-Type':'text.html'});
		res.end(data);

	});
});

app.get('/login', function(req, res){
	fs.readFile('login.html', function(err, data){
		res.writeHead(200, {'Content-Type':'text.html'});
		res.end(data);

	});
});

app.get('/showPost/:postId', function(req, res){
    //요청한 사용자의 세션이 없거나 || 사용자의 auth level이 post의 auth level보다 크면
        //authFail 페이지로 리다이렉션 한다


	fs.readFile('showPost.html', function(err, data){
        //db에서 postId 로 해당하는 포스트와 댓글 정보를 모두 가지고 온다.
        //data에 붙인다.
		res.writeHead(200, {'Content-Type':'text.html'});
		res.end(data);

	});
});

app.get('/authFail', function(req, res){
	fs.readFile('authFail.html', function(err, data){
		res.writeHead(200, {'Content-Type':'text.html'});
		res.end(data);

	});
});

app.get('/searchResult', function(req, res){
    //TODO
    //db post collection의 tag에서 주어진 req.body.tag를 검색한다.
    // 결과로 나온 post의 title과 작성자를 data에 붙여서 돌려보내준다.
    //결과가 없으면 noresult를 data에 붙여서 보내도 괜춘할 듯.
	fs.readFile('searchResult.html', function(err, data){
		res.writeHead(200, {'Content-Type':'text.html'});
		res.end(data);

	});
});

app.get('/write', function(req, res){
   fs.readFile('/writePost', function(err, data){
       res.writeHead(200, {'Content-Type':'text.html'});
       res.end(data);
   }) ;
});

app.get('/deletePost/:postId', function(req, res){
    //TODO
    // 세션을 가지고 와서 삭제요청을 한 사용자의 id를 확인한다.
    // postid를 이용해서 해당 포스트의 작성자가 요청한 사용자와 같은지 확인한다.
        //같으면     // postId를 찾아서 db posts에서 삭제한다
        //같지 않으면 권한이 없음을 알려주고 원래 페이지로 내버려둔다.
    //index페이지로
});

app.get('/deleteComment/:postId', function(req, res){
   //req.body.commentId를 해서 commentId를 확보해놓는다.
    //삭제를 요청한 사용자의 id를 확인해 놓는다.
    //그 comment의 작성자와 삭제를 요청한
});

app.post('/loginProcess', function(req, res){
    var user = {
        'password': req.body.password,
        'email': req.body.email
    }
    //user가 users 컬렉션에 있는지 확인

    //없으면 로그인 없는 사용자라는 alert 띄워주고 홈으로 패스
    //있으면 패스워드 맞는지 확인
        //맞으면 session 생성해서 홈으로 패스
        //안맞으면 패스워드 확인 alert 띄워주고 같은 페이지.

});

app.post('/sendPost', function(req, res){
    var post={
        user:req.session.getId,
        postAuth: req.body.postAuth,
        date: new Date(now),
        title: req.body.title,
        content: req.body.content,
        tag:req.body.tags
    }
    //TODO
    //post를 db posts에 save한다.
    //index page로 돌려보내준다.

});

app.post('/addComment', function(req, res){
    //TODO
    //db comments 에 댓글 단 사람, 댓글이 달린 postId, 댓글 내용을 입력한다.
})



app.listen(7777);
