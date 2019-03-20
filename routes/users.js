const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User model
require("./../models/User");
const Users = mongoose.model("users");

// User Login route
router.get('/login', (req, res) => {
    //console.log('te');
    res.render('users/login');
});

// User Register route
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Register form POST
router.post('/register', (req, res) => {
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({text: "Password do not match"});
    }

    if(req.body.password.length < 4){
        errors.push({text: "Password should be at least 4 charactors.."});
    }

    if(errors.length > 0){
        res.render('users/register', {
            errors:errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }else{
        Users.findOne({email:req.body.email})
                .then(user => {
                    if(user){
                        req.flash('error_msg', 'User already exists. Please log in.');
                        res.redirect('/users/register');
                    } else{

                        const newUser = new Users({
                            name: req.body.name,
                            email: req.body.email,
                            password: req.body.password
                        });
                        
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if(err) throw err;
                                newUser.password = hash;
                                newUser.save()
                                            .then(user => {
                                                req.flash('success_msg', 'You are now regitered and now able to log in.');
                                                res.redirect('/users/login');
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                req.flash('error_msg', 'Something went wrong when login.');
                                                return;
                                            });
                                    
                            });
                        });

                    }
                });
        
    }
});

module.exports = router;