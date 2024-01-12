




import { Note, AbstractNotesStore } from './Notes.mjs';
const notes = [];
export default class InMemoryNotesStore extends AbstractNotesStore {


    async close() { }


    async update(key, title, body) {
        notes[key] = new Note(key, title, body);
        return notes[key];
    }

    async create(key, title, body) {
        notes[key] = new Note(key, title, body);
        return notes[key];
    }


    async read(key07) {
        if (notes[key07]) {
            return notes[key07];
        }
        else throw new Error(`Note ${key07} does not exist`);
    }

    async destroy(key) {
        if (notes[key]) {
            delete notes[key];
        } else throw new Error(`Note ${key} does not exist`);
    }

    async keylist() {
        return Object.keys(notes);
    }

    async count() {
        return notes.length;
    }
}





