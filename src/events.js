import { add } from './data.js';

const createElement = (info) => {
    const elm = document.createElement(info.elm);
    Object.keys(info).forEach((item) => {
        if (item === 'elm') {
            return;
        }
        if (item === 'dataset') {
            Object.keys(info[item]).forEach((datasetItem) => {
                elm.dataset[datasetItem] = info.dataset[datasetItem];
            });
        } else {
            // console.log(item);
            elm[item] = info[item];
        }
    });
    return elm;
};

const addStudentListener = (info) => new Promise((resolve) => {
    info.topElement.addEventListener('click', (ev) => {
        const target = ev.target,
            ul = target.parentNode.parentNode;
        if (target.dataset.type) {
            switch (target.dataset.type) {
            case 'addStudent':
                // Create an li with a single input (studentName) and insert it before the button that was just clicked.
                ul.insertBefore(createElement({ elm: 'li' }).appendChild(createElement({ elm: 'input', size: 20, type: 'text', dataset: { type: 'newStudent' }, placeholder: 'Student name' })).parentNode,
                    target.parentNode);
                break;
            }
        }
    });
    info.topElement.addEventListener('keyup', (ev) => {
        if (ev.target.tagName !== 'INPUT') {
            return;
        }
        if (!ev.key || ev.key !== 'Enter') {
            return;
        }
        add({ type: ev.target.dataset.type.substring(3).toLowerCase(), name: ev.target.value }).then(console.log).catch(console.error);
        // reload(info);
    });
    info.topElement.addEventListener('dblclick', (ev) => {
        const target = ev.target;
        console.log('dblclick', { target });
        if (target.tagName === 'LI') {

        }
    });
    resolve(info);
});

export { addStudentListener };
