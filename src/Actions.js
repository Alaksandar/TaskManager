import { ImportantTask } from "./ImportantTask.js";

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



// Создать задачу при клике на кнопку "Добавить" на основе конструктора из "./Task.js", если:
// 1) поле ввода не пустое,
// 2) выбран уровень срочности.

export function submitTask(e) {

    e.preventDefault();

    const inputText = document.querySelector('input[type="text"]');
    const options = document.querySelectorAll("option");

    const li = document.createElement("li");

    console.log(inputText.value)

    for (let option of options) {

        if (option.selected && (inputText.value != 0)) {

            new ImportantTask(inputText.value).create(li);
            inputText.value = "";
            option.selected = false;
            console.log(li);    
        }
    }
    console.log("inputText.value", inputText.value);
}