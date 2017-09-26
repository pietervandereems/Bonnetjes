import * as PouchDB from 'pouchdb-browser';
import { log, errLog } from './utils';

PouchDB.plugin(require('pouchdb-find'));

const db = new PouchDB('marks-aid'),
    indexes = [
        {
            fields: ['type'],
            name: 'type',
            ddoc: 'typeindex',
            type: 'json'
        },
        {
            fields: ['type', 'name'],
            name: 'student',
            ddoc: 'studentindex',
            type: 'json'
        }
    ];

console.log("REMOVE THIS! (data.js)");
window.db = db;

const createIndexes = () => Promise.all(indexes.map((index) => db.createIndex({ index: index })));     // db.createIndex does nothing if index already exists.

const getStudents = () => createIndexes()
    .then(() => db.find({
        selector: { type: 'student' }
    }))
    .then((results) => results.docs);

const listStudents = () => new Promise((resolve, reject) => {
    getStudents()
        .then((students) => {
            const ul = document.createElement('ul');
            const info = {
                students: students.map((student) => {
                    const li = document.createElement('li');
                    li.innerHTML = student.name;
                    ul.appendChild(li);
                    return Object.assign({}, student, { element: li });
                }),
                topElement: ul
            };

            document.querySelector('#students').appendChild(ul);
            resolve(info);
        })
        .catch((err) => {
            console.error(err); // console.error this because a TypeError information is otherwise lost (empty object with (deep) cloning, no stackTrace with .toString)
            reject(Object.assign({}, err, { msg: 'Error caught at listStudents' }));
        });
});

const listGrade = (name, output) => new Promise((resolve, reject) => {
    createIndexes()
        .then(() => db.find({
            selector: { type: 'student', name: name }
        }))
        .then((result) => {
            if (result.docs.length === 0) {
                output.innerHTML = 'Unknown student';
                resolve(false);
                return;
            }

            const student = result.docs[0],
                ul = document.createElement('ul');

            student.grades = student.grades || [];

            if (student.grades.length === 0) {
                output.innerHTML += ', No grades available for this student';
                resolve({
                    name: name,
                    grades: []
                });
                return;
            }
            const grades = student.grades.map((grade) => {
                const li = document.createElement('li');
                li.innerHTML = grade.subject + ':' + grade.grade;
                ul.appendChild(li);
                return grade;
            });
            output.appendChild(ul);

            resolve({
                name: name,
                grades: grades
            });
        })
        .catch((err) => {
            console.error(err); // console.error this because a TypeError information is otherwise lost (empty object with (deep) cloning, no stackTrace with .toString)
            reject(Object.assign({}, err, { msg: 'Error caught at listSubjects' }));
        });
});

const listGrades = (info) => Promise.all(info.students.map((student) => listGrade(student.name, student.element)))
    .then((studentsInfo) => ({ topElement: info.topElement, students: studentsInfo.filter((student) => Boolean(student)) })); // Add information of all students tot the list then pass on the info


const add = (doc, options) => db.post(doc, options);

export { listGrades, listStudents, add, getStudents };
