




import * as express from 'express'
import { NotesStore as notes } from '../models/notes-store.mjs';
//import useModel from '../models/notes-store.mjs';

import { io } from '../app.mjs'; // for ch 9

import { default as DBG } from 'debug';
const debug = DBG('notes:debug');
const dbgerror = DBG('notes:error'); 



//var express = require('express');

//import { NotesStore as notes } from '../app.mjs';

export const router = express.Router();

//var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {

    // ... placeholder for Notes home page code
    //console.log("^^^^^^^^^^^^666666666666666666666666666666666666666666666666666************************************");
    try {
        
        const notelist = await getKeyTitleList();
        //console.log(util.inspect(notelist));
        res.render('index', { title: 'Notes', notelist: notelist, user: req.user ? req.user : undefined });

    } catch (err) {
        next(err);
        //console.log("keylist:999999999999999999 ");
        //console.log("error error:  " + err);
        //console.log("error error error error!!!!!!!!!");
    }

    
});


async function getKeyTitleList() {
    const keylist = await notes.keylist();

    const keyPromises = keylist.map(key => notes.read(key));
    const notelist = await Promise.all(keyPromises);
    return notelist.map(note => {
        return { key: note.key, title: note.title };

    });


};


const emitNoteTitles = async () => {
    const notelist = await getKeyTitleList();
    io.of('/home').emit('notetitles', { notelist });
};



export function init() {
    io.of('home').on('connect', socket => {
        debug('socketio connection on /home');
    });
    notes.on('notecreated', emitNoteTitles);
    notes.on('noteupdated', emitNoteTitles);
    notes.on('notedestroyed', emitNoteTitles);

}





