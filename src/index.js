import PouchDB from 'pouchdb-browser';
// var PouchDB = require('pouchdb-browser').default;

PouchDB.plugin(require('pouchdb-find'));
import UpUp from 'upup';

const db = new PouchDB('bonnetjes');
const indexes = [
    {
        fields: ['subject'],
        name: 'subject',
        ddoc: 'subjectindex',
        type: 'json'
    }
];
const subjects = {
    _id: '_design/subjects',
    views: {
        index: {
            map: function mapFun (doc) {
                if (doc.subject) {
                    emit(doc.subject);
                }
            }.toString()
        }
    }
};

const createMap = () => db.put(subjects)
    .catch((err) => {
        if (err.name !== 'conflict') {
            throw err;
        }
    });

const createIndexes = () => Promise.all(indexes.map((index) => db.createIndex({ index: index })));     // db.createIndex does nothing if index already exists.

const listBonnetjes = (subject) => {

    createIndexes()
        .then(() => db.find({
            selector: { subject: subject }
        }))
        .then((result) => {
            const list = result.docs.reduce((acc, bon) => acc + `<li>€${bon.prijs}</li>`);
            const total = result.docs.reduce((acc, bon) => acc + bon.prijs);
            return { list, total };
        })
        .catch(console.error);

};

const listSubjects = () => {
    createMap()
        .then(() => db.query('subjects', { reduce: '_count' }))
        .then((result) => {
            console.log('result', result);
        })
        .catch(console.error);
};

window.onload = () => {
    document.getElementById('subjects').addEventListener('click', (ev) => {
        console.log(ev);
    });
};
