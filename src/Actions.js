import { NotImportantTask } from "./notImportantTask.js";
import { ImportantTask } from "./importantTask.js";
import { VeryImportantTask } from "./veryImportantTask.js";
import { Task } from "./task.js";

import { notImportantStore, importantStore, veryImportantStore } from "./store.js";

import "./assets/styles/style.css";



// Раскрыть форму при клике на кнопку "Создать задачу",
// cкрыть кнопку "Создать задачу":

export function openForm(addButton) {

    const addList = document.querySelector("#add-list");
    addList.classList.remove("close");
    addList.classList.add("open");

    addButton.hidden = true;
}



// Свернуть форму при клике на кнопку "x", показать кнопку "Создать задачу",
// очистить поле ввода и отменить селектор:

export function closeForm(close_form) {
    const addList = close_form.parentElement.parentElement;
    addList.classList.remove("open");
    addList.classList.add("close");

    const inputText = document.querySelector('input[type="text"]');
    inputText.value = "";

    const options = document.querySelectorAll(".option");
    for (let option of options) {
        option.selected = false;
    }

    const addButton = document.querySelector("button[data-action=add]");
    addButton.hidden = false;
}



// Создать задачу при клике на кнопку "Добавить" на основе конструктора из "./task.js",
// поместить задачу в соответствующей колонке, если:
// 1) поле ввода не пустое, 2) выбран уровень срочности;
// findDublicateTask() - блокировка ввода дублирующихся задач;
// changeLocalStorage() - сохранение изменений в LocalStorage;

export function submitTask(e) {

    e.preventDefault();

    const inputText = document.querySelector('input[type="text"]');
    const options = document.querySelectorAll("option");

    const li = document.createElement("li");

    const { value } = inputText;

    if (value === "" || findDublicateTask(value)) {
        return
    }


    if (options[0].selected && (inputText.value != null)) {

        new NotImportantTask(inputText.value).create(li);
        inputText.value = "";
        options[0].selected = false;

        changeLocalStorage("notImportantStore", notImportantStore);

    } else if (options[1].selected && (inputText.value != null)) {

        new ImportantTask(inputText.value).create(li);
        inputText.value = "";
        options[1].selected = false;

        changeLocalStorage("importantStore", importantStore);

    } else if (options[2].selected && (inputText.value != null)) {

        new VeryImportantTask(inputText.value).create(li);
        inputText.value = "";
        options[2].selected = false;

        changeLocalStorage("veryImportantStore", veryImportantStore);
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
}



// Извлечение данных из localStorage при загрузке страницы:

export function reload() {


    if (localStorage.getItem("notImportantStore")) {

        notImportantStore.push(...JSON.parse(localStorage.getItem("notImportantStore")));

        for (let i in notImportantStore) {

            const li = document.createElement("li");
            li.setAttribute("data-not-important", i);

            new Task(notImportantStore[i].name, notImportantStore[i].checked).create(li);

            const ul = document.querySelector(".not-important-task-col ul");
            ul.append(li);
        }
    }

    if (localStorage.getItem("importantStore")) {

        importantStore.push(...JSON.parse(localStorage.getItem("importantStore")));

        for (let i in importantStore) {

            const li = document.createElement("li");
            li.setAttribute("data-important", i);

            new Task(importantStore[i].name, importantStore[i].checked).create(li);

            const ul = document.querySelector(".important-task-col ul");
            ul.append(li);
        }
    }

    if (localStorage.getItem("veryImportantStore")) {

        veryImportantStore.push(...JSON.parse(localStorage.getItem("veryImportantStore")));

        for (let i in veryImportantStore) {

            const li = document.createElement("li");
            li.setAttribute("data-very-important", i);

            new Task(veryImportantStore[i].name, veryImportantStore[i].checked).create(li);

            const ul = document.querySelector(".very-important-task-col ul");
            ul.append(li);
        }
    }
}