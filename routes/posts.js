var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
// var mongoose = require('mongoose')  
// , Schema = mongoose.Schema
  
// var postSchema = Schema({
  // _id     : Number,
  // title    : String,
  // link    : String,
  // upvotes     : Number,
  // comments : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
// });

// var commentSchema = Schema({
  // _id     : Number,
  // post : { type: Number, ref: 'Post' },
  // author    : String,
  // body  : String,
  // upvote : String,

// });

// var Post  = mongoose.model('Post', postSchema);
// var Comment = mongoose.model('Comment', commentSchema);

/*
 * GET post.
 */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('post');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});
/*
 * POST post.
 */
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('post');
	req.body.upvotes=0;
	req.body.comments=[];
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});
/* 
 *GET post by Id
 */
 router.get('/:id',function(req,res){
	var id=req.params.id
	var db = req.db;
    var collection = db.get('post');
	collection.findOne({"_id": id}, function(err, doc) {
		// var commentsCollection=db.get('comments');
		// var id=doc._id.toHexString();
		// commentsCollection.find({post:id},{},function(e,doc2){
			// console.log(doc2);
		// })
		res.json(doc);
    });
 })


/* 
 * PUT upvote
 */
router.put('/:id/upvote', function(req, res) {
    var id=req.params.id
	var db = req.db;
    var collection = db.get('post');
	collection.update(
		{ "_id" : id },
		{ $inc: { "upvotes": 1 } },
		function(err, results) {
			res.send(
				(err === null) ? { msg: '' } : { msg: err }
			);
		}
	)
	
});

/* 
 * POST comment
 */
 router.post('/:id/comments', function(req, res) {
    var db = req.db;
	var parentId=req.params.id;
    var collection = db.get('post');
	req.body.post=parentId;
	req.body.upvotes=0;
	req.body._id=new ObjectId();
	// collection.insert(req.body,function(err, result){
        // res.send(
            // (err === null) ? { msg: '' } : { msg: err }
        // );
    // });
    collection.findAndModify(
		{ "_id" : parentId },
		{ $push: { "comments": req.body } },
		function(err, results) {
			(err === null) ? { msg: '' } : { msg: err }
		}
	)
	res.send({
		_id:req.body._id,
		author:req.body.author,
		body:req.body.body,
		upvotes:req.body.upvotes
	});
});

module.exports = router;