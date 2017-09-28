import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);

import { reThrow } from './utils';


const db = new PouchDB('bonnetjes'),
    indexes = [
        {
            fields: ['subject'],
            name: 'subject',
            ddoc: 'subjectindex',
            type: 'json'
        }
    ],
    subjects = {
        _id: '_design/subjects',
        version: 4,
        views: {
            subjects: {
                map: function mapFun (doc) {
                    if (doc.subject) {
                        emit(doc.subject);
                    }
                }.toString()
            }
        }
    };
var checked = false;

console.error('DB is exposed, remove the line below in data.js!');
window.db = db;

const createMap = () => db.get(subjects._id)
    .then((docs) => {
        if (!docs.version || docs.version !== subjects.version) {
            console.info('Updating subject map/reduce');
            return db.put(Object.assign({}, subjects, { _rev: docs._rev }));
        }
        return docs;
    })
    .catch((err) => {
        console.error(err);
        if (err.name !== 'conflict') {
            reThrow('Createmap problem, subjects:', subjects)(err);
        }
    });

const createIndexes = () => Promise.all(indexes.map((index) => db.createIndex({ index: index })));     // db.createIndex does nothing if index already exists.

const check = () => {
    if (!checked) {
        return Promise.all([createMap, createIndexes])
            .then(() => {
                checked = true;
                return true;
            });
    }
    return Promise.resolve(true);
};

check();

const getBonnetjes = (subject) => check()
    .then(() => db.find({ selector: { subject: subject } }))
    .then((results) => results.docs);

const getSubjects = () => check()
    .then(() => db.query('subjects', { reduce: '_count' }))
    .then((results) => results.rows);

const add = (doc, options) => db.post(doc, options);

export { add, getBonnetjes, getSubjects };
