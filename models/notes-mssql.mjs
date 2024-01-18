




import { Note, AbstractNotesStore } from './Notes.mjs';
//import { msnodesqlv8 as sql} from 'mssql';
import {
    connectDB as connectSequlz,
    close as closeSequlz
} from './sequlz.mjs';


import DBG from 'debug';
const debug = DBG('notes:notes-sequelize');
const error = DBG('notes:error-sequelize');


var config2 = {
    "server": "(localdb)\\localDBDemo",
    "database": "notes",
    "driver": "msnodesqlv8",
    "options": {
        "trustedConnection": true
    }
};


sql.connect(config2, function (err) {
    if (err) debug(err);
    if (err) console.log(err);
    var request = new sql.Request();
    request.query('select * from notes', function (err, recordset) {
        if (err) console.log(err)
        debug(recordset);
        console.log(recordset);
    }

});



//export class NotesStoreSequelize extends AbstractNotesStore {
//    constructor() {
//        super();
//        this.notes = [];
//        this.sequlz = undefined;
//    }

//    async connect() {
//        if (typeof this.sequlz === 'undefined') {
//            this.sequlz = await connectSequlz();
//        }
//        return this.sequlz;
//    }

//    async close() {
//        if (this.sequlz) await closeSequlz();
//        this.sequlz = undefined;
//    }

//    async add(title, body) {
//        const note = new Note({
//            title: title,
//            body: body
//        });
//        await note.save();
//        return note;
//    }

//    async update(id, title, body) {
//        const note = await this.get(id);
//        if (note) {
//            note.title = title;
//            note.body = body;
//            await note.save();
//        }
//        return note;
//    }

//    async delete(id) {
//        const note = await this.get(id);
//        if (note) {
//            await note.destroy();
//        }
//        return note;
//    }

//    async clear() {
//        await Note.destroy({
//            where: {}
//        });
//    }

//    async getAll() {
//        return await Note.findAll();
//    }

//    async get(id) {
//        return await Note.findByPk(id);
//    }
//}


// node js connection for mssql
// node js function to connect to mssql by way of Sequelize
// node js function to close connection to mssql by way of Sequelize
// node js function to get all notes from mssql by way of Sequelize
// node js function to get a single note from mssql by way of Sequelize
// node js function to add a note to mssql by way of Sequelize
// node js function to update a note in mssql by way of Sequelize
// node js function to delete a note from mssql by way of Sequelize
// node js function to delete all notes from mssql by way of Sequelize
// node js function to initialize mssql database by way of Sequelize
// node js function to close mssql database by way of Sequelize
// node js function to drop mssql database by way of Sequelize
// node js function to create mssql database by way of Sequelize

//express js connection for mssqllocaldb



//function connectDB() {
//return new Promise((resolve, reject) => {
//        sql.connect(process.env.SEQUELIZE_CONNECT)
//            .then(() => {
//                debug('connected');
//                resolve();
//            })
//            .catch(err => {
//                error(err);
//                reject(err);
//            });
//    });
//}

