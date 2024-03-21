



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





export const router = express.Router();

import DBG from 'debug';
const debug = DBG('notes:router-users');
const error = DBG('notes:error-users');


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
            catch (err) { done(err); }
        }
    ));
    facebookLogin = true;
} else {
    facebookLogin = false;
}


router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/users/login'
    }));



// extra comma?

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



// add LocalStrategy to passport


passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            var check = await usersModel.userPasswordCheck(username,
                password);
            if (check.check) {
                done(null, { id: check.username, username: check.username });
            } else {
                done(null, false, check.message);
            }
        } catch (e) { done(e); }
    }
));


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






