const express = require('express');
const router = express.Router();
//import { check, query, validationResult } from 'express-validator';
// import User from '../../models/api/User';
const {check, query, validationResult} = require('express-validator');
const config = require('config');
//import gravatar from 'gravatar';
const gravatar = require('gravatar');
//import bcrypt from 'bcryptjs';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth')
const {profile_url} = require("gravatar");

//@route  GET api/profile/me
//desc    Get Current users profile
//access  Private
router.get('/me', auth,
async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name'], 'avatar');
        if(!profile){
            return res.status(400).send({msg: 'No Profile present for this user'})
        }
        res.json(profile);
    } catch (e) {
        console.log(e.message);
        res.status(400).send('server Error');
    }
}
);

//@route  POST api/profile/
//desc    create or update a user Profile
//access  Private

router.post('/',

    [auth,
        [check('status', 'status is required').not().isEmpty()],
        [check('skills', 'skills are required').not().isEmpty()]
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const {linkedin,
            bio,
            company ,
            website ,
            location ,
            status ,
            githubusername,
            skills,
            youtube,
            instagram,
            twitter ,
            facebook} = req.body;
        //Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(githubusername) profileFields.githubusername = githubusername;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.bio = status;
        if(skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }
        profileFields.social = {}
        if(youtube) profileFields.social.youtube = youtube;
        if(twitter) profileFields.social.twitter = twitter;
        if(instagram) profileFields.social.instagram = instagram;
        if(facebook) profileFields.social.facebook = facebook;

        try {
         let profile = await Profile.findOne({user: req.user.id});
            if(profile)
            {
             profile = await  Profile.findOneAndUpdate(
                 {user : req.user.id},
                 {$set : profileFields},
                 {new : true}
             );
             return  res.json(profile);
            }
            // create
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        }catch (e) {
            console.log(e.message);
            res.status(400).send({msg: 'server Error'});
        }
    })

//@route  GET api/profile/
//desc    get all profile
//access  Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles);
    } catch (e) {
        console.log(e.message);
        res.status(400).send({msg: 'server error'});
    }
})


//@route  DELETE api/profile/
//desc    delete profile , users , posts
//access  private

router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndDelete({user: req.user.id});
        await User.findOneAndDelete({_id: req.user.id});
        res.json({msg: 'user deleted'});
    } catch (e) {
        console.log(e.message);
        res.status(400).send({msg: 'server error'});
    }
})

module.exports = router;