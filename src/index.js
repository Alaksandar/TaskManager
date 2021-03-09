import { openForm, closeForm, submitTask, hideShowTasksColumn, markTask, deleteTask } from "./actions.js";

import "./assets/styles/style.css";

import delete_icon from "./assets/images/icon-delete.png";

const addButton = document.querySelector("button[data-action=add]");
const close_form = document.querySelector(".close_form");
const form = document.querySelector("form");
const container = document.querySelector(".container__tasks-container");

const deleteIcon = document.createElement("img");
deleteIcon.src = delete_icon;


// Раскрыть форму при клике на кнопку "Создать задачу",
// cкрыть кнопку "Создать задачу":

addButton.addEventListener("click", e => openForm(e.target));


// Свернуть форму при клике на кнопку "x",
// показать кнопку "Создать задачу":

close_form.addEventListener("click", e => closeForm(e.target));


// Создать задачу при клике на кнопку "Добавить":

form.addEventListener("submit", e => submitTask(e));



// Скрыть / показать колонку с заданиями кликом на заголовок:

container.addEventListener("click", hideShowTasksColumn);


// Маркировка задач

container.addEventListener("click", markTask);



// Удалить задачу кликом по иконке-"х", если статус задачи checked:

container.addEventListener("click", deleteTask);