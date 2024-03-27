




import * as express from 'express'
import { NotesStore as notes4 } from '../models/notes-store.mjs';
//import useModel from '../models/notes-store.mjs';
import { facebookLogin } from './users.mjs'


//var express = require('express');

//import { NotesStore as notes } from '../app.mjs';

export const router = express.Router();

//var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {

    // ... placeholder for Notes home page code
    console.log("^^^^^^^^^^^^666666666666666666666666666666666666666666666666666************************************");
    try {
        //console.log("1111111111111111111111111-222222222222222222222-33333333333333333333333");
        const keylist = await notes4.keylist();
        //console.log(`keylist !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  ` + keylist);
        const keyPromises = keylist.map(key2 => {
            return notes4.read(key2);
        });
        const notelist = await Promise.all(keyPromises);
        //console.log(util.inspect(notelist));
        res.render('index', { title: 'Notes', notelist: notelist, user: req.user ? req.user : undefined, facebookLogin: facebookLogin });

    } catch (err) {
        next(err);
        //console.log("keylist:999999999999999999 ");
        //console.log("error error:  " + err);
        //console.log("error error error error!!!!!!!!!");
    }

    
});







