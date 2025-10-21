import express from 'express';
import { check, query, validationResult } from 'express-validator';
// import User from '../../models/api/User';
const router = express.Router();
import gravatar from 'gravatar';
//const gravatar = require('gravatar');
import bcrypt from 'bcryptjs';
//import {User} from '../../models/User';

//@route  POST api/users
//desc    registration Logic
//access  Public

//router.get('/',  (req,res)=> res.send('User Route'));
router.post('/', [
    check('name', 'Name is required').not().notEmpty(),
    check('email', 'Valid Email ID is required').isEmail(),
    check('password', 'Enter a password with length of minimum six characters').isLength({ min: 6 })

], async(req, res) => {
    const errros = validationResult(req);
    if (!errros.isEmpty()) {
        return res.status(400).json({ errros: errros.array() })
    }
    const { name, email, password } = req.body;
    try {
        // Check User exists or not
       let user = await User.findOne({email}) ;
       if(user){
        res.status(400).json({errors : [{msg: 'User Already Exists'}]})
       }
       // Pull user Gravator
       const avatar = gravatar.url(email, {
         s: 200,
         r: 'pg',
         d: 'mm'
       });

       user = new User({
        name,
        email,
        avatar,
        password
       })

       // Encrypt password 

       const salt = await bcrypt.salt(20);
       user.password = await bcrypt.hash(password, salt);

       //Saving user
       await user.save();
       res.send('User Registered');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;