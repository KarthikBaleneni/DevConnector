const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const post = require('../../models/Post')
const {check,validationResult} = require("express-validator");

//@route  POST api/posts
//desc    Create a Post
//access  Private

router.post('/',
    [auth , check('text', 'Text is requied').not().isEmpty()],
     async (req,res)=>{
     const errors = validationResult(req);
         if(!errors.isEmpty()){
             return res.status(400).send({errors: errors.array()})
         }
         try {
             const user = await  User.findById(req.user.id).select('-password');
             const newPost = new Post({
                 text: req.body.text,
                 name: user.name,
                 avatar: user.avatar,
                 user: req.user.id
             });
             const post = await newPost.save();
             res.json(post);
         }catch (e){

         }

         res.send('Posts Route')
     } );

//@route  GET api/posts
//desc    Get all posts
//access  Private

router.get('/',
    auth,
    async (req, res) => {
        try {
            const posts = await post.findById(req.params.id);
            // check User
            if(posts.user.toString() !== req.user.id)
            {
                return res.status(401).json({msg: 'User not authorised'});
            }
            await posts.remove();
            res.json({msg: 'Post Removed'});
        } catch (e) {
            console.log(e.message);
            res.status(500).send('Server Error');
        }
    })

//@route  GET api/posts
//desc    Get posy by ID
//access  Private

router.get('/:id',
    auth,
    async (req, res) => {
        try {
            const posts = await post.findById(req.params.id);
            if(!posts){
                return res.status(500).json({ msg: 'Post not found'});
            }
        } catch (e) {
            console.log(e.message);
            if(e.kind === 'ObjectId'){
                return res.status(400).json({ msg: 'Post not found'});
            }
            res.status(500).send('Server Error');
        }
    })


//@route  DELETE api/posts
//desc    Delete a post
//access  Private

router.get('/:id',
    auth,
    async (req, res) => {
        try {
            const posts = await Post.find().sort({date: -1})
        } catch (e) {
            console.log(e.message);
            res.status(500).send('Server Error');
        }
    })

//@route  PUT api/posts/like/:id
//desc    Like a post
//access  Private

router.put('/like/:id', auth, async(req,resp)=> {
   try {
   const posts = await  post.findById(req.params.id);
    // check whether post is already liked or not.
    if(posts.likes.filter(like => like.user.toString() === req.user.id).length > 0){
        return res.status(400).json({msg: 'Post already liked'})
    }
    posts.likes.unshift({user : req.user.id});
    await posts.save();
    res.json(posts.likes);
   }catch (e) {
       console.log(e.message);
       res.status(500).send('Server Error');
   }
})

//@route  PUT api/posts/unlike/:id
//desc    UnLike a post
//access  Private

router.put('/unlike/:id', auth, async(req,resp)=> {
   try {
   const posts = await  post.findById(req.params.id);
    // check whether post is already liked or not.
    if(posts.likes.filter(like => like.user.toString() === req.user.id).length === 0){
        return res.status(400).json({msg: 'Post has not yet been liked'})
    }
    // get remove index
    const removeIndex = posts.likes.map(like => like.user.toString()).indexOf(req.user.id)
    posts.likes.splice(removeIndex, 1);
    await posts.save();
    res.json(posts.likes);
   }catch (e) {
       console.log(e.message);
       res.status(500).send('Server Error');
   }
})

//@route  POST api/posts/comment/:id
//desc    Post a Comment for a post
//access  Private

router.post('/comment/:id',
    [auth , check('text', 'Text is requied').not().isEmpty()],
     async (req,res)=>{
     const errors = validationResult(req);
         if(!errors.isEmpty()){
             return res.status(400).send({errors: errors.array()})
         }
         try {
             const user = await  User.findById(req.user.id).select('-password');
             const posts = await post.findById(req.params.id);
             const newComment = new Post({
                 text: req.body.text,
                 name: user.name,
                 avatar: user.avatar,
                 user: req.user.id
             });
             posts.comment.unshift(newComment);
             await posts.save();
             res.json(posts.comments);
         }catch (e){
             console.log(e.message);
             res.status(500).send('Server Error');
         }

         res.send('Posts Route')
     } );

//@route  POST api/posts/comment/:id/:comment_id
//desc    Delete Comment
//access  Private

router.get('/comment/:id/:comment_id',
    auth,
    async (req, res) => {
        try {
            const posts = await post.findById(req.params.id);

            // Pull out comment
            const comment = post.comments.find(comment => comment.id ===req.params.comment_id);

            // Make sure comment exists
            if(!comment){
                res.status(400).json({msg: 'Comment does not exist'})
            }
            // check user
            if(comment.user.toString() !==req.user.id)
            {
                res.status(401).json({msg: 'UnAuthorised access'})
            }
            // get remove index
            const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
            post.comments.splice(removeIndex, 1);
            await post.save();
            res.json(post.comments);

        } catch (e) {
            console.log(e.message);
            res.status(500).send('Server Error');
        }
    })




module.exports = router;