


// import * as util from 'util';
import { default as express } from 'express';
import { NotesStore as notes } from '../models/notes-store.mjs';
export const router = express.Router();

import { default as DBG } from 'debug';
const debug = DBG('notes:debug');
const dbgerror = DBG('notes:error'); 

//const capcon = 'capture-console'
import * as capcon from 'capture-console';

import { ensureAuthenticated } from './users.mjs';



//let stdout;

// Add Note.
router.get('/add', ensureAuthenticated,(req, res, next) => {

    //stdout = capcon.captureStdout(() => {
    //    // whatever is done in here has stdout captured,
    //    // the return value is a string containing stdout
    //    console.log(`add running`);
    //    return "add running";
    //});

    

    res.render('noteedit', {
        title: "Add a Note",
        docreate: true,
        notekey: '',
        user: req.user,
        note: undefined
    });
});


// Save Note (update)
router.post('/save', ensureAuthenticated, async (req, res, next) => {
    try {
        let note;
        if (req.body.docreate === "create") {

            console.log("data: " + req.body.body + "  " + req.body.title)
            note = await notes.create(req.body.notekey,
                req.body.title, req.body.body);


        } else {
            note = await notes.update(req.body.notekey,
                req.body.title, req.body.body);
        }
        console.log("reqbodynotekey reqbodynotekey reqbodynotekey reqbodynotekey  ::::::::::::::::::" + req.body.notekey);
        res.redirect('/notes/view?key=' + req.body.notekey);
    }
    catch (err) { next(err); }
});

// Read Note (read)
router.get('/view', async (req, res, next) => {
    try {
        let note = await notes.read(req.query.key);
        res.render('noteview', {
            title: note ? note.title : "",
            notekey: req.query.key,
            user: req.user ? req.user : undefined,
            note: note
        });
    } catch (err) { next(err); }
});



// Edit note (update)
router.get('/edit', ensureAuthenticated, async (req, res, next) => {
    try {
        let note = await notes.read(req.query.key);
        res.render('noteedit', {
            title: note ? ("Edit " + note.title) : "Add a Note",
            docreate: false,
            notekey: req.query.key,
            user: req.user,
            note: note
        });
    } catch (err) { next(err); }
});



// Ask to Delete note (destroy)
router.get('/destroy', ensureAuthenticated, async (req, res, next) => {
    try {
        let note = await notes.read(req.query.key);
        res.render('notedestroy', {
            title: note ? `Delete ${note.title}` : "",
            notekey: req.query.key,
            user: req.user,
            note: note
        });
    } catch (err) { next(err); }
});




// Really destroy note (destroy)
router.post('/destroy/confirm', ensureAuthenticated, async (req, res, next) => {
    try {
        await notes.destroy(req.body.notekey);
        res.redirect('/');
    } catch (err) { next(err); }
});




