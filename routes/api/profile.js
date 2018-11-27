const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');
// Load profile model
const Profile = require('../../models/Profile');
//  Load user profile
const User = require('../../models/User');
//  Load and Validate Experience
const validateExperienceInput = require('../../validation/experience');

// ||||| * Routes * |||||

// @route     GET api/profile/test
// @desc      Tests profile route
// @access    Public
router.get('/test', (req, res) => res.json({"msg": "PROFILE WORKS"}));

// @route     GET api/profile
// @desc      Get current users profile
// @access    Private (Protected Route)
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if(!profile){
          errors.noprofile = 'THERE IS NO PROFILE FOR THIS USER'
          return res.status(404).json(errors)
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
    }
  );

// @route     GET api/profile/all
// @desc      Get all profiles
// @access    Public
router.get(
  '/all',
  (req, res) => {
    const errors = {};
    Profile.find()
      .populate('user', ['name', 'avatar'])
      .then(profiles => {
        if(!profiles) {
          errors.noprofile = 'There are no profiles'
          return res.status(404).json(errors);
        }

        res.json(profiles)
      }
    ).catch(err => {
      res.status(404).json({ profile: 'THERE ARE NO PROFILES'})
    })
  }
);

// @route     GET api/profile/handle/:handle
// @desc      Get Profile by handle
// @access    Public
router.get(
  '/handle/:handle',
  (req, res) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if(!profile) {
          errors.noprofile = 'NO PROFILE FOUND';
          res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route     GET api/profile/user/:user_id
// @desc      Get Profile by user_id
// @access    Public
router.get(
  '/user/:user_id',
  (req, res) => {
    const errors = {}
    Profile.findOne({ user: req.params.user_id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if(!profile) {
          errors.noprofile = 'NO PROFILE FOUND';
          res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route     POST api/profile
// @desc      CREATE or EDIT user profile
// @access    Private (Protected Route)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if(!isValid) {
      return res.status(400).json(errors);
    }

    // Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // SKILLS - SPLIT INTO ARRAY
    if(typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }
    // SOCIAL
    profileFields.social = {}
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if(profile){
          // UPDATE
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          )
          .then(profile => res.json(profile));
        } else {
          // CREATE
          // Check if Handle Exists
          Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if(profile) {
              errors.handle = "HANDLE ALREADY EXISTS";
              res.status(400).json(errors);
            }

          // SAVE PROFILE
          new Profile(profileFields).save().then(profile => res.json(profile));
        })
      }
    });
  }
);

// @route     POST api/profile/experience
// @desc      ADD experience to profile
// @access    Private (Protected Route)
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if(!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

        // Add to exp array
        profile.experience.unshift(newExp);

        profile.save().then(profile => res.json(profile));
      }
    );
  }
);
module.exports = router;
