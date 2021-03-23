import { NotImportantTask } from "./notImportantTask.js";
import { ImportantTask } from "./importantTask.js";
import { VeryImportantTask } from "./veryImportantTask.js";
import { Task } from "./task.js";

import { notImportantStore, importantStore, veryImportantStore } from "./store.js";

import "./assets/styles/style.css";

// import edit_icon from "./assets/images/edit-icon.png";
// import delete_icon from "./assets/images/icon-delete.png";

const addButton = document.querySelector("button[data-action=add]");
const close_form = document.querySelector(".close_form");
const select = document.querySelectorAll(".select");

const inputText = document.querySelector('input[type="text"]');



// Раскрыть форму при клике на кнопку "Создать задачу" (и иконке "pancil"),
// cкрыть кнопку "Создать задачу":

export function openForm(addButton) {

    const addList = document.querySelector("#add-list");
    addList.classList.remove("close");
    addList.classList.add("open");

    addButton.hidden = true;
}



// Свернуть форму при клике на кнопку "x" (и кнопку "Добавить"),
// очистить содержимое и пользовательские атрибуты поля ввода,
// отменить селектор, показать кнопку "Создать задачу":

export function closeForm(close_form) {

    const addList = close_form.parentElement.parentElement;
    addList.classList.remove("open");
    addList.classList.add("close");

    inputText.removeAttribute("tasktypename");
    inputText.removeAttribute("editLiAttribute");
    inputText.value = "";

    const options = document.querySelectorAll(".option");
    for (let option of options) {
        option.selected = false;
    }

    const addButton = document.querySelector("button[data-action=add]");
    addButton.hidden = false;

    closeWarningMassage(inputText, select);
}



// Скрыть всплывающие сообщения:

export function closeWarningMassage(inputText, select) {

    const warnings = document.querySelectorAll(".warning");

    for (let warning of warnings) {

        // window.setTimeout(function () {       
        warning.classList.add("close_warning");
        warning.classList.remove("open_warning");
        // }, 3500);
    }
}



// Редактировать задачу кликом по иконке "pancil", раскрыть форму,
// задать пользовательские атрибуты и содержимое полю ввода,
// переход к function submitTask()

export function editTask(e) {

    if (e.target.classList.contains("edit") && e.target.parentElement.firstElementChild.checked === false) {

        openForm(addButton);

        let taskType = e.target.parentElement.dataset;

        let taskTypeName = Object.keys(taskType)[0];

        let editLiAttribute = Object.values(taskType)[0];

        inputText.value = e.target.previousElementSibling.innerText;
        inputText.setAttribute("taskTypeName", taskTypeName);
        inputText.setAttribute("editLiAttribute", editLiAttribute);

        closeWarningMassage(inputText, select);

    } else return;
}



// Создать задачу при клике на кнопку "Добавить":
// a) при редактировании задачи (поле ввода содержит пользовательские атрибуты),
// b) на основе конструктора из "./task.js";
// поместить задачу в соответствующей колонке, если:
// 1) поле ввода не пустое, 2) выбран уровень срочности, 3) задача не дублируется;
// свернуть форму;
// findDublicateTask() - блокировка ввода дублирующихся задач;
// changeLocalStorage() - сохранение изменений в LocalStorage;

export function submitTask(e) {
    e.preventDefault();

    const valueTrim = String(inputText.value).trim();
    const options = document.querySelectorAll("option");
    const li = document.createElement("li");


    if (inputText.getAttribute("tasktypename")) {

        editTaskToSubmit(inputText);

    } else if (valueTrim === "") {

        const emptyStr_warning = document.querySelector(".emptyStr_warning");
        emptyStr_warning.classList.remove("close_warning");
        emptyStr_warning.classList.add("open_warning");


    } else if (findDublicateTask(valueTrim)) {

        const task_warning = document.querySelector(".task_warning");
        task_warning.classList.remove("close_warning");
        task_warning.classList.add("open_warning");

    } else {

        if (options[0].selected) {

            new NotImportantTask(valueTrim).create(li);
            changeLocalStorage("notImportantStore", notImportantStore);

            closeForm(close_form);

        } else if (options[1].selected) {

            new ImportantTask(valueTrim).create(li);
            changeLocalStorage("importantStore", importantStore);

            closeForm(close_form);

        } else if (options[2].selected) {

            new VeryImportantTask(valueTrim).create(li);
            changeLocalStorage("veryImportantStore", veryImportantStore);

            closeForm(close_form);

        } else {

            const select_warning = document.querySelector(".select_warning");
            select_warning.classList.remove("close_warning");
            select_warning.classList.add("open_warning");
        }
    }
}



// Сохранение отредактированной задачи при клике на кнопку "Добавить":

function editTaskToSubmit(inputText) {

    const taskTypeName = inputText.getAttribute("tasktypename");
    const editLiAttribute = inputText.getAttribute("editLiAttribute");

    const options = document.querySelectorAll("option");
    const list = document.querySelectorAll("li");

    for (let li of list) {

        if ((Object.keys(li.dataset)[0] === taskTypeName) &&
            (Object.values(li.dataset)[0] === editLiAttribute)) {


            if ((options[0].selected) || (options[1].selected) || (options[2].selected)) {

                const label = li.firstElementChild.nextElementSibling;

                if ((label.innerText === inputText.value) || !(findDublicateTask(inputText.value))) {

                    label.innerText = inputText.value;
                    const new_li = document.createElement("li");



                    if (taskTypeName === "notImportant") {

                        if (options[0].selected) {

                            notImportantStore[editLiAttribute].name = label.innerText;
                            notImportantStore[editLiAttribute].checked = li.firstElementChild.checked;

                        } else if (options[1].selected) {

                            notImportantStore.splice(li.dataset.notImportant, 1);
                            li.remove();
                            new ImportantTask(inputText.value).create(new_li);

                        } else if (options[2].selected) {

                            notImportantStore.splice(li.dataset.notImportant, 1);
                            li.remove();
                            new VeryImportantTask(inputText.value).create(new_li);

                        } else return;



                    } else if (taskTypeName === "important") {

                        if (options[0].selected) {

                            li.remove();
                            importantStore.splice(li.dataset.important, 1);
                            new NotImportantTask(inputText.value).create(new_li);

                        } else if (options[1].selected) {

                            importantStore[editLiAttribute].name = label.innerText;
                            importantStore[editLiAttribute].checked = li.firstElementChild.checked;

                        } else if (options[2].selected) {

                            importantStore.splice(li.dataset.important, 1);
                            li.remove();
                            new VeryImportantTask(inputText.value).create(new_li);

                        } else return;



                    } else if (taskTypeName === "veryImportant") {

                        if (options[0].selected) {

                            li.remove();
                            veryImportantStore.splice(li.dataset.veryImportant, 1);
                            new NotImportantTask(inputText.value).create(new_li);

                        } else if (options[1].selected) {

                            li.remove();
                            veryImportantStore.splice(li.dataset.veryImportant, 1);
                            new ImportantTask(inputText.value).create(new_li);

                        } else if (options[2].selected) {

                            veryImportantStore[editLiAttribute].name = label.innerText;
                            veryImportantStore[editLiAttribute].checked = li.firstElementChild.checked;

                        } else return;
                    }

                    culculateListAtributes(notImportantStore, "data-not-important");
                    culculateListAtributes(importantStore, "data-important");
                    culculateListAtributes(veryImportantStore, "data-very-important");

                    changeLocalStorage("notImportantStore", notImportantStore);
                    changeLocalStorage("importantStore", importantStore);
                    changeLocalStorage("veryImportantStore", veryImportantStore);

                    closeForm(close_form);

                } else {

                    const task_warning = document.querySelector(".task_warning");
                    task_warning.classList.remove("close_warning");
                    task_warning.classList.add("open_warning");
                }

            } else {

                const select_warning = document.querySelector(".select_warning");
                select_warning.classList.remove("close_warning");
                select_warning.classList.add("open_warning");
            }
        }
    }
}



// Скрыть / показать колонку с заданиями кликом на заголовок:

export function hideShowTasksColumn(e) {

    if (!e.target.classList.contains("title")) {
        return

    } else {
        for (let li of Array.from(e.target.nextElementSibling.children)) {

            if (!li.firstElementChild.checked) {

                li.classList.toggle("clean");
                e.target.classList.toggle("chosen");
            }
        }
    }
}



// Маркировка задач, сохранение статуса маркировки в "./Store.js"

export function markTask(e) {

    if (e.target.tagName !== "INPUT") {

        return;

    } else {

        e.target.setAttribute("checked", e.target.checked);

        const editIcon = e.target.nextElementSibling.nextElementSibling;
        editIcon.classList.toggle("close");

        const deleteIcon = e.target.nextElementSibling.nextElementSibling.nextElementSibling;
        deleteIcon.classList.toggle("close");

        let taskType = e.target.nextElementSibling.parentElement.dataset;
        let taskTypeName = Object.keys(taskType)[0];


        if (taskTypeName === "notImportant") {

            changeStoreChecked(notImportantStore, taskType, taskTypeName, e.target.checked);
            changeLocalStorage("notImportantStore", notImportantStore);

        } else if (taskTypeName === "important") {

            changeStoreChecked(importantStore, taskType, taskTypeName, e.target.checked);
            changeLocalStorage("importantStore", importantStore);

        } else if (taskTypeName === "veryImportant") {

            changeStoreChecked(veryImportantStore, taskType, taskTypeName, e.target.checked);
            changeLocalStorage("veryImportantStore", veryImportantStore);
        }
    }
}


// сохранение статуса маркировки в "./Store.js"

function changeStoreChecked(store, type, name, checkedStatus) {

    const storeElementIndex = store.findIndex(el => el.id == type[name]);
    store[storeElementIndex].checked = checkedStatus;
}



// Удалить задачу кликом по иконке-"х", если статус задачи checked:

export function deleteTask(e) {

    if (e.target.classList.contains("delete") &&
        e.target.closest("li").firstElementChild.checked === true) {

        let taskType = e.target.parentElement.dataset;
        let taskTypeName = Object.keys(taskType)[0];

        e.target.closest("li").remove();

        if (taskTypeName === "notImportant") {

            notImportantStore.splice(e.target.parentElement.dataset.notImportant, 1);

            changeLocalStorage("notImportantStore", notImportantStore);
            culculateListAtributes(notImportantStore, "data-not-important");

        } else if (taskTypeName === "important") {

            importantStore.splice(e.target.parentElement.dataset.important, 1);

            culculateListAtributes(importantStore, "data-important");
            changeLocalStorage("importantStore", importantStore);

        } else if (taskTypeName === "veryImportant") {

            veryImportantStore.splice(e.target.parentElement.dataset.veryImportant, 1);

            culculateListAtributes(veryImportantStore, "data-very-important");
            changeLocalStorage("veryImportantStore", veryImportantStore);
        }
    } else return;

    closeForm(close_form);
}



// Переопределить data-attribute и id всех задач при удалении одной из них: 

function culculateListAtributes(store, attribute) {

    const list = document.querySelectorAll(`[${attribute}]`);

    for (let i in store) {
        store[i].id = i;
        list[i].setAttribute(attribute, i);
    }
}



// Блокировка ввода дублирующихся задач:

function findDublicateTask(name) {

    const notImportantDublecateIndex = notImportantStore.findIndex(el => el.name === name);
    const importantDublecateIndex = importantStore.findIndex(el => el.name === name);
    const veryImportantDublecateIndex = veryImportantStore.findIndex(el => el.name === name);

    if (notImportantDublecateIndex === -1 && importantDublecateIndex === -1 && veryImportantDublecateIndex === -1) {
        return false;
    } else {
        return true;
    }
}



// Сохранение изменений в LocalStorage при создании, маркировке и удалении задач;
function changeLocalStorage(name, store) {

    localStorage.setItem(name, JSON.stringify(store));

    console.log("store", store);
}



// Извлечение данных из localStorage при загрузке страницы:

export function reload() {

    reloadStorages("notImportantStore", notImportantStore, "data-not-important", ".not-important-task-col ul");
    reloadStorages("importantStore", importantStore, "data-important", ".important-task-col ul");
    reloadStorages("veryImportantStore", veryImportantStore, "data-very-important", ".very-important-task-col ul");
}

function reloadStorages(name, store, attribute, list) {

    let keys = Object.keys(localStorage);
    for(let key of keys) {

        if (key === name) {

            store.push(...JSON.parse(localStorage.getItem(key)));

            for (let i in store) {
    
                const li = document.createElement("li");
                li.setAttribute(attribute, i);
    
                new Task(store[i].name, store[i].checked).create(li);
    
                const ul = document.querySelector(list);
                ul.append(li);
            }
        } 
    }
}