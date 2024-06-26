

//  Name: Ronald Kiefer
//  Hebrew:        ר ו נ  א ל ד
//  Date:  April 19, 2024 Friday 1:30 PM
//  Modifying the Notes user interface
//  Imcorporating login and logout routing functionality in Notes application

//  Todo:  create routing module for login and logout URLs
//  and change rest of Notes (app) to use user data



import path from 'path';
import util from 'util'
import { default as express } from 'express';
import { default as passport } from 'passport';
import { default as passportLocal } from 'passport-local';
const LocalStrategy = passportLocal.Strategy;
import * as usersModel from '../models/users-superagent.mjs';
import { sessionCookieName } from '../app.mjs';
import passportFacebook from 'passport-facebook';
const FacebookStrategy = passportFacebook.Strategy;

import { default as crypto } from 'crypto';



export const router = express.Router();

import DBG from 'debug';
const debug = DBG('notes:router-users');
const error = DBG('notes:error-users');

// global variables
var localOne = true;
var localTwo = false;



export function initPassport(app) {
    app.use(passport.initialize());
    app.use(passport.session());
}


export function ensureAuthenticated(req, res, next) {
    try {
        // req.user is set by Passport in the deserializeUser function
        if (req.user) next();
        else res.redirect('/users/login');
    }
    catch (e) {
        next(e);
    }
}


const facebookcallback = process.env.FACEBOOK_CALLBACK_HOST ? process.env.FACEBOOK_CALLBACK_HOST : "http://localhost:3000";

export var facebookLogin;

if (typeof process.env.FACEBOOK_APP_ID !== 'undefined' && process.env.FACEBOOK_APP_ID !== '' && typeof process.env.FACEBOOK_APP_SECRET !== 'undefined' && process.env.FACEBOOK_APP_SECRET !== '') {

    


    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${facebookcallback}/users/auth/facebook/callback`
    },
        async function (accessToken, refreshToken, profile, done) {
            try {

                done(null, await usersModel.findOrCreate({
                    id: profile.username, username: profile.username,
                    password: "", provider: profile.provider, familyName: profile.displayName,
                    givenName: "", middleName: "", photos: profile.photos, emails: profile.emails


                }));
            }
            catch (err) {
                
                
                done(err);//might leave this out if needed
            }
        }
    ));
    facebookLogin = true;
    




} else {
    facebookLogin = false;

    


}



// add LocalStrategy to passport


// don't need strategy for this

//if (lcoalOne = false) {

//    passport.use(new LocalStrategy(
//        async (username, password, done) => {
//            try {
//                done(null, await usersModel.findOrCreate({
//                    id: username, username: username,
//                    password: password


//                }));
//            } catch (e) { done(e); }
//        }
//    ));
//}



passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            var check = await usersModel.userPasswordCheck(username,
                password);
            if (check.check) {
                console.log("checked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
                done(null, { id: check.username, username: check.username });
            } else {
                console.log("error **************************************************");
                done(null, false, check.message);
            }
        } catch (e) { done(e); }
    }
));

router.get('/login', function (req, res, next) {
    try {
        res.render('login', { title: "Login to Notes", user: req.user, });
    }
    catch (e) {
        next(e);
    }
});



// extra comma?


router.post('/login', passport.authenticate('local', {
    successRedirect: '/', // SUCCESS: Go to home page
    failureRedirect: 'login', // FAIL: Go to /users/login

}));





router.get('/logout', function (req, res, next) {

    try {
        req.session.destroy();
        req.logout();
        res.clearCookie(sessionCookieName);
        res.redirect('/');
    }
    catch (e) {
        next(e);
    }

});


router.get('/signup', function (req, res, next) {

    localOne = false;
    res.render('signup');

});


router.post('/signup', async (req, res, next) => {

    try {
        console.log("signup");
        //res.redirect('/');
        await usersModel.findOrCreate({
            id :req.body.username, username: req.body.username,
            password: req.body.password
        })
        res.redirect('/');
    }
    catch {
        res.redirect('signup');
        //console.log("error");
    }
    
    
    //res.redirect('/');

        //var salt = crypto.randomBytes(16);
        //crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
        //    if (err) { console.log(err) }
        //    var providerName = "default";
        //    var familyName = "default";
        //    var givenName = "default";
        //    var middleName = "default";
        //    var emails = "default";
        //    var photos = "default";
        //    try {
        //        console.log("username: " + req.body.username);
        //        console.log("password: " + req.body.password);
        //        await usersModel.findOrCreate({
        //            id: req.body.username, password: hashedPassword, provider: providerName , familyName: familyName,
        //            givenName: givenName, middleName: middleName, emails: emails, photos: photos, salt: salt
        //        })
        //    }
        //    catch (err) {
        //        console.log(err);
        //        console.log("error!!!");

        //    }




        //db.run('INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
        //    req.body.username,
        //    hashedPassword,
        //    salt
        //], function (err) {
        //    if (err) { return next(err); }
        //    var user = {
        //        id: this.lastID,
        //        username: req.body.username
        //    };
        //    req.login(user, function (err) {
        //        if (err) { return next(err); }
        //        res.redirect('/');
        //    });
        //});

        //console.log("username2: " + req.body.username);
        //console.log("password2: " + req.body.password);


        //successRedirect: '/', // SUCCESS: Go to home page
        //failureRedirect: 'signup', // FAIL: Go to /users/signup

    });

    






passport.serializeUser(function (user, done) {
    try {
        done(null, user.username);
    } catch (e) { done(e); }
});

passport.deserializeUser(async (username, done) => {
    try {
        let user = await usersModel.find(username);
        done(null, user);
    } catch (e) { done(e); }
});

