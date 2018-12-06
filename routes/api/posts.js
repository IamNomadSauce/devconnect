const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// VALIDATION
const { validatePostInput, validateCommentInput } = require('../../validation/post');

// @route     GET api/posts/test
// @desc      Tests posts route
// @access    Public
// router.get('/test', (req, res) => res.json({"msg": "POSTS WORKS"}));


// @route     GET api/posts
// @desc      Get All posts route
// @access    Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostfound: "NO POSTs FOUND" }));
});

// @route     GET api/posts/:id
// @desc      Get post by id
// @access    Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: "NO POST FOUND WITH THAT ID"}));
});

// @route     POST api/posts/
// @desc      CREATE POST
// @access    PRIVATE
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
});

// @route     DELETE api/posts/:id
// @desc      DELETE POST
// @access    PRIVATE
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if(post.user.toString() !== req.user.id){
            return res.status(401).json({ notauthorized: 'USER NOT AUTHORIZED' });
          }

          // IF AUTHORIZED, DELETE POST
          post.remove().then(() => res.json({ success: true }));
        }).catch(err => res.status(404).json({ postnotfound: 'POST NOT FOUND' }));
    })
});

// @route     POST api/posts/like/:id
// @desc      Like POST
// @access    PRIVATE
router.post('/like/:id',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
              return res.status(400).json({ alreadyliked: 'USER ALREADY LIKED POST' });
            }

            post.likes.unshift({ user: req.user.id });
            post.save().then(post => res.json(post));
          }).catch(err => res.status(404).json({ postnotfound: 'POST NOT FOUND' }));
      })
});

// @route     POST api/posts/unlike/:id
// @desc      UnLike POST
// @access    PRIVATE
router.post('/unlike/:id',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
              return res.status(400).json({ alreadyliked: 'USER HAS NOT LIKED POST' });
            }
            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
            post.likes.splice(removeIndex, 1);

            post.save().then(post => res.json(post));
          }).catch(err => res.status(404).json({ postnotfound: 'POST NOT FOUND' }));
      }
    );
  }
);

// @route     POST api/posts/comment/:id
// @desc      Comment on POST
// @access    PRIVATE
router.post('/comment/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);
    if(!isValid) {
      return res.status(400).json(errors);
    }
    try {
      let post = await Post.findById(req.params.id);
      if(!post) {
        errors.nopost = `No post found for ${req.params.id}`;
        return res.status(400).json(errors);
      }
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }

      // addcomments to array
      post.comments.unshift(newComment);
      // Save Post
      post = await post.save();
      return res.json(post);
    }
    catch (err) {
      errors.nopost = `No post found for ${req.params.id}`;
      return res.status(404).json(errors);
    }
  }
);

// @route     DELETE api/posts/comment/:id/:comment_id
// @desc      REMOVE COMMENT on POST
// @access    PRIVATE
router.delete(
  '/comment/:id/:commentId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let post = await Post.findById(req.params.id)
      if (!post) {
        errors.nopost = `NO POST FOUND FOR ${req.params.id}`
        return res.status(404).json(errors)
      }

      // Check to see if comment exists
      if (
        post.comments.filter(
          (comment) => comment._id.toString() === req.params.commentId
        ).length === 0
      ) {
        errors.commentnotexists = 'COMMENT DOES NOT EXIST'
        return res.status(404).json(errors)
      }

      // Get Remove Index
      const removeIndex = post.comments
        .map((item) => item._id.toString())
        .indexOf(req.params.commentId)

      // Splice comment out of array
      post.comments.splice(removeIndex, 1)

      await post.save()
      return res.json(post)
    } catch (err) {
      errors.nopost = `No post found for ${req.params.id}`
      return res.status(404).json(errors)
    }
  }
)

module.exports = router;
