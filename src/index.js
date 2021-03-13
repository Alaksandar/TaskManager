import { reload, openForm, closeForm, submitTask, hideShowTasksColumn, markTask, deleteTask, editTask } from "./actions.js";

import "./assets/styles/style.css";

import edit_icon from "./assets/images/edit-icon.png";
import delete_icon from "./assets/images/icon-delete.png";


const form = document.querySelector("form");
const container = document.querySelector(".container__tasks-container");
const addButton = document.querySelector("button[data-action=add]");
const close_form = document.querySelector(".close_form");

const editIcon = document.createElement("img");
editIcon.src = edit_icon;
const deleteIcon = document.createElement("img");
deleteIcon.src = delete_icon;


// Извлечение данных из localStorage при загрузке страницы:
window.addEventListener("load", reload);


// Раскрыть форму при клике на кнопку "Создать задачу",
// cкрыть кнопку "Создать задачу":
addButton.addEventListener("click", e => openForm(e.target));


// Свернуть форму при клике на кнопку "x",
// показать кнопку "Создать задачу":
document.addEventListener("click", closeForm);


// Создать задачу при клике на кнопку "Добавить":
form.addEventListener("submit", e => submitTask(e));


// Скрыть / показать колонку с заданиями кликом на заголовок:
container.addEventListener("click", hideShowTasksColumn);


// Маркировка задач
container.addEventListener("click", markTask);


// Редактировать задачу кликом по иконке "pancil", если статус задачи checked:
document.addEventListener("click", editTask);


// Удалить задачу кликом по иконке-"х", если статус задачи checked:
container.addEventListener("click", deleteTask);