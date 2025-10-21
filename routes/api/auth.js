const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const {check, query, validationResult} = require('express-validator');
const config = require('config');
//import gravatar from 'gravatar';
const gravatar = require('gravatar');
//import bcrypt from 'bcryptjs';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//@route  GET api/auth
//desc    Test Route
//access  Public

router.get('/', auth, async(req,res)=> {
    try {
      const user = await User.findById(req.user.id).select('-password'); 
      res.json(user); 
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

//@route  POST api/Auth
//desc    Authenticate user and get Token
//access  Public

//router.get('/',  (req,res)=> res.send('User Route'));
router.post('/', [
    check('email', 'Valid Email ID is required').isEmail(),
    check('password', 'password is required').exists(),

], async(req, res) => {
    const errros = validationResult(req);
    if (!errros.isEmpty()) {
        return res.status(400).json({ errros: errros.array() })
    }
    const { email, password } = req.body;
    try {
        // Check User Creds valid or not
       let user = await User.findOne({email}) ;
       if(!user){
        return res.status(400).json({errors : [{msg: 'Invalid Credentials'}]})
       }

       const isMatch = await bcrypt.compare(password, user.password);

       if(!isMatch){
        res.status(401).json({
            msg: 'Invalid Credentials'
        })
       }
      
       const payload = {
        user: {
            id: user.id
        }
       }
       jwt.sign(payload, config.get('jwtSecret') , {expiresIn : 360000}, (err, token) => {
        if(err) throw err;
        res.json({token});
       });
      // res.send('User Registered');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;