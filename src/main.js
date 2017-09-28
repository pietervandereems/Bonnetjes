import { addButtons, addListener, list } from './list';
import { errLog, log } from './utils';
import { getBonnetjes, getSubjects } from './data.js';
// import { addStudentListener } from './events.js';

// listStudents()
//     .then(addStudentListener)
//     .then(listGrades)
//     .then((info) => new Promise((resolve) => {
//         // Add "add student" buttons to top and bottom of the list then pass on the info data.
//         const li = document.createElement('li');
//         li.innerHTML = '<button data-type="addStudent">Add Student</button>';
//         if (info.students.length > 0) {
//             info.topElement.insertBefore(li.cloneNode(true), info.topElement.firstChild);
//         }
//         info.topElement.appendChild(li);
//         resolve(info);
//     }))
//     .then(log('main.js call'))
//     .catch(errLog('Error caught in main.js list'));

list(getSubjects, (item) => item.name, (item) => item._id)
    .then(console.info);
    // .then((list) => addButtons(list, '+'))
    // .then((list) => addListener(list))
    // .then((list) => {
    //     document.getElementById('subjects').appendChild(list);
    // })
    // .catch(errLog('error caught in list inside main.js'));
