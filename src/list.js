import { log, reThrow } from './utils';
import { add } from './data.js';


const list = (getData = Promise.resolve(), getDisplay = () => { }, getId = () => { }) => getData()
    .then((list) => {
        const ul = document.createElement('ul');
        list.map((item) => {
            const li = document.createElement('li');
            li.innerHTML = getDisplay(item);
            li.dataset.id = getId(item);
            ul.appendChild(li);
            return true;
        });
        return ul;
    })
    .catch(reThrow('list caught an error'));

const addButtons = (listElm, addText = 'Add') => Promise.resolve(listElm)
    .then((listElm) => {
        const li = document.createElement('li');
        li.innerHTML = `<button data-type="add">${addText}</button>`;
        //listElm.insertBefore(li.cloneNode(true), listElm.firstChild);
        listElm.appendChild(li);
        return listElm;
    })
    .catch(reThrow('addButton caught an error'));

const clickListener = (ev) => {
    const target = ev.target;
    if (target.tagName === 'BUTTON' && target.dataset.type && target.dataset.type === 'add') {

        const input = document.createElement('input');
        input.size = 20;
        input.type = 'text';
        input.dataset.type = 'newStudent';
        input.placeholder = 'Student name';
        target.parentNode.replaceChild(input, target);
    }
};

const keyListener = (ev) => {
    if (ev.target.tagName !== 'INPUT') {
        return;
    }
    if (!ev.key || ev.key !== 'Enter') {
        return;
    }
    add({ type: ev.target.dataset.type.substring(3).toLowerCase(), name: ev.target.value })
        .then(log('added from keylistener'))
        .catch(reThrow('add in keyListener caught an error'));
    // reload(info);
};

const addListener = (listElm) => Promise.resolve(listElm)
    .then((listElm) => {
        listElm.addEventListener('click', clickListener);
        listElm.addEventListener('keyup', keyListener);
        return listElm;
    })
    .catch(reThrow('addListener caught an error'));

export { addButtons, addListener, list };
