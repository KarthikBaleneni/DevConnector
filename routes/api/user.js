const express = require('express');
const { check, query, validationResult } = require('express-validator');
const router = express.Router();

//@route  POST api/users
//desc    registration Logic
//access  Public

//router.get('/',  (req,res)=> res.send('User Route'));
router.post('/', [
    check('name', 'Name is required').not().notEmpty(),
    check('email', 'Valid Email ID is required').isEmail(),
    check('password', 'Enter a password with length of minimum six characters').isLength({min: 6})

] ,(req,res)=> {
    const errros = validationResult(req);
    if(!errros.isEmpty()){
        return res.status(400).json({errros: errros.array()})
    } 
    res.send('User Route') }) ;

module.exports = router;