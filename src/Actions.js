import { NotImportantTask } from "./NotImportantTask.js";
import { ImportantTask } from "./ImportantTask.js";
import { VeryImportantTask } from "./VeryImportantTask.js";

import { notImportantStore, importantStore, veryImportantStore } from "./Store.js";

import "./assets/styles/style.css";


// Раскрыть форму при клике на кнопку "Создать задачу",
// cкрыть кнопку "Создать задачу":


export function openForm(addButton) {

    const addList = document.querySelector("#add-list");
    addList.classList.remove("close");
    addList.classList.add("open");

    addButton.hidden = true;
}



// Свернуть форму при клике на кнопку "x",
// показать кнопку "Создать задачу":


export function closeForm(close_form) {

    const addList = document.querySelector("#add-list");
    addList.classList.remove("open");
    addList.classList.add("close");

    const addButton = document.querySelector("button[data-action=add]");
    addButton.hidden = false;
}



// Создать задачу при клике на кнопку "Добавить" на основе конструктора из "./Task.js",
// поместить задачу в соответствующей колонке, если:
// 1) поле ввода не пустое,
// 2) выбран уровень срочности.

export function submitTask(e) {

    e.preventDefault();

    const inputText = document.querySelector('input[type="text"]');
    const options = document.querySelectorAll("option");

    const li = document.createElement("li");

    if (options[0].selected && (inputText.value != 0)) {

        new NotImportantTask(inputText.value).create(li);
        inputText.value = "";
        options[0].selected = false;

    } else if (options[1].selected && (inputText.value != 0)) {

        new ImportantTask(inputText.value).create(li);
        inputText.value = "";
        options[1].selected = false;

    } else if (options[2].selected && (inputText.value != 0)) {

        new VeryImportantTask(inputText.value).create(li);
        inputText.value = "";
        options[2].selected = false;
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

        } else if (taskTypeName === "important") {
            changeStoreChecked(importantStore, taskType, taskTypeName, e.target.checked);

        } else if (taskTypeName === "veryImportant") {
            changeStoreChecked(veryImportantStore, taskType, taskTypeName, e.target.checked);
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
            culculateListAtributes(notImportantStore, "data-not-important");

        } else if (taskTypeName === "important") {
            
            importantStore.splice(e.target.parentElement.dataset.notImportant, 1);
            culculateListAtributes(importantStore, "data-important");

        } else if (taskTypeName === "veryImportant") {
            
            veryImportantStore.splice(e.target.parentElement.dataset.notImportant, 1);
            culculateListAtributes(veryImportantStore, "data-very-important");
        }

    } else return;

}

function culculateListAtributes(store, attribute) {

    const list = document.querySelectorAll(`[${attribute}]`);
    
    for (let i in store) {
        list[i].setAttribute(attribute, i);
        store[i].id = i;
    }
}